import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, type JWTPayload } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies (same pattern as /auth/me)
    const token = req.cookies.get('access_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify the token and get user
    const decoded: JWTPayload = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await req.json()
    const { 
      title, 
      description, 
      originalPrice, 
      discountedPrice, 
      discount, 
      terms, 
      expiresAt, 
      restaurantId 
    } = body

    // Validate required fields
    if (!title || !originalPrice || !discountedPrice || !discount || !expiresAt || !restaurantId) {
      return NextResponse.json(
        { error: 'Title, original price, discounted price, discount, expiry date, and restaurant are required' },
        { status: 400 }
      )
    }

    // Verify that the user owns the restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: parseInt(restaurantId),
        ownerId: decoded.userId,
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found or you do not own this restaurant' },
        { status: 404 }
      )
    }

    // Validate prices and discount
    const originalPriceNum = parseFloat(originalPrice)
    const discountedPriceNum = parseFloat(discountedPrice)
    const discountNum = parseInt(discount)

    if (discountedPriceNum >= originalPriceNum) {
      return NextResponse.json(
        { error: 'Discounted price must be less than original price' },
        { status: 400 }
      )
    }

    // Validate expiry date
    const expiryDate = new Date(expiresAt)
    if (expiryDate <= new Date()) {
      return NextResponse.json(
        { error: 'Expiry date must be in the future' },
        { status: 400 }
      )
    }

    // Create offer
    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        originalPrice: originalPriceNum,
        discountedPrice: discountedPriceNum,
        discount: discountNum,
        terms,
        expiresAt: expiryDate,
        restaurantId: parseInt(restaurantId),
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            cuisine: true,
            location: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Offer created successfully',
      offer,
    })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get('restaurantId')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    let offers

    if (restaurantId) {
      // Get offers for a specific restaurant
      const whereClause: any = {
        restaurantId: parseInt(restaurantId),
      }

      if (activeOnly) {
        whereClause.isActive = true
        whereClause.expiresAt = {
          gt: new Date(),
        }
      }

      offers = await prisma.offer.findMany({
        where: whereClause,
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              cuisine: true,
              location: true,
              rating: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      // Get all offers
      const whereClause: any = {}

      if (activeOnly) {
        whereClause.isActive = true
        whereClause.expiresAt = {
          gt: new Date(),
        }
      }

      offers = await prisma.offer.findMany({
        where: whereClause,
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              cuisine: true,
              location: true,
              rating: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    return NextResponse.json({
      offers,
    })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
