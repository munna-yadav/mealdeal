import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, type JWTPayload } from '@/lib/auth'

const prisma = new PrismaClient()

// Generate a unique redemption code
function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
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
    const { offerId } = body

    // Validate required fields
    if (!offerId) {
      return NextResponse.json(
        { error: 'Offer ID is required' },
        { status: 400 }
      )
    }

    // Check if offer exists and is active
    const offer = await prisma.offer.findFirst({
      where: {
        id: parseInt(offerId),
        isActive: true,
        expiresAt: {
          gt: new Date(),
        }
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            phone: true,
          }
        }
      }
    })

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found or has expired' },
        { status: 404 }
      )
    }

    // Check if user has already claimed this deal
    const existingClaim = await prisma.claimedDeal.findFirst({
      where: {
        userId: decoded.userId,
        offerId: parseInt(offerId),
        status: {
          in: ['CLAIMED', 'REDEEMED']
        }
      }
    })

    if (existingClaim) {
      return NextResponse.json(
        { error: 'You have already claimed this deal' },
        { status: 400 }
      )
    }

    // Generate redemption code
    let redemptionCode = generateRedemptionCode()
    
    // Ensure code is unique
    let codeExists = await prisma.claimedDeal.findFirst({
      where: { redemptionCode }
    })
    
    while (codeExists) {
      redemptionCode = generateRedemptionCode()
      codeExists = await prisma.claimedDeal.findFirst({
        where: { redemptionCode }
      })
    }

    // Create claimed deal
    const claimedDeal = await prisma.claimedDeal.create({
      data: {
        userId: decoded.userId,
        offerId: parseInt(offerId),
        redemptionCode,
        status: 'CLAIMED',
      },
      include: {
        offer: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                location: true,
                phone: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Deal claimed successfully',
      claimedDeal: {
        id: claimedDeal.id,
        redemptionCode: claimedDeal.redemptionCode,
        claimedAt: claimedDeal.claimedAt,
        status: claimedDeal.status,
        offer: {
          id: claimedDeal.offer.id,
          title: claimedDeal.offer.title,
          discount: claimedDeal.offer.discount,
          originalPrice: claimedDeal.offer.originalPrice,
          discountedPrice: claimedDeal.offer.discountedPrice,
          expiresAt: claimedDeal.offer.expiresAt,
          restaurant: claimedDeal.offer.restaurant
        }
      }
    })
  } catch (error) {
    console.error('Error claiming deal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
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

    // Get user's claimed deals
    const claimedDeals = await prisma.claimedDeal.findMany({
      where: {
        userId: decoded.userId,
      },
      include: {
        offer: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                location: true,
                phone: true,
                image: true,
              }
            }
          }
        }
      },
      orderBy: {
        claimedAt: 'desc'
      }
    })

    return NextResponse.json({
      claimedDeals
    })
  } catch (error) {
    console.error('Error fetching claimed deals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
