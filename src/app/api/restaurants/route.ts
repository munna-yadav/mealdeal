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
    const { name, cuisine, description, location, phone, hours, image } = body

    // Validate required fields
    if (!name || !cuisine || !location) {
      return NextResponse.json(
        { error: 'Name, cuisine, and location are required' },
        { status: 400 }
      )
    }

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        cuisine,
        description,
        location,
        phone,
        hours,
        image,
        ownerId: decoded.userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        offers: true,
      },
    })

    return NextResponse.json({
      message: 'Restaurant created successfully',
      restaurant,
    })
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ownerId = searchParams.get('ownerId')

    let restaurants

    if (ownerId) {
      // Get restaurants for a specific owner
      restaurants = await prisma.restaurant.findMany({
        where: {
          ownerId: parseInt(ownerId),
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          offers: {
            where: {
              isActive: true,
              expiresAt: {
                gt: new Date(),
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      // Get all restaurants
      restaurants = await prisma.restaurant.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          offers: {
            where: {
              isActive: true,
              expiresAt: {
                gt: new Date(),
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    return NextResponse.json({
      restaurants,
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
