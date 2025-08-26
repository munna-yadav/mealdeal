import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, type JWTPayload } from '@/lib/auth'

const prisma = new PrismaClient()

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
    const { restaurantId, date, time, partySize, specialRequests, phoneNumber, email } = body

    // Validate required fields
    if (!restaurantId || !date || !time || !partySize) {
      return NextResponse.json(
        { error: 'Restaurant, date, time, and party size are required' },
        { status: 400 }
      )
    }

    // Validate party size
    if (partySize < 1 || partySize > 20) {
      return NextResponse.json(
        { error: 'Party size must be between 1 and 20' },
        { status: 400 }
      )
    }

    // Validate date is in the future
    const reservationDate = new Date(date)
    const now = new Date()
    if (reservationDate <= now) {
      return NextResponse.json(
        { error: 'Reservation date must be in the future' },
        { status: 400 }
      )
    }

    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: parseInt(restaurantId),
      },
      select: {
        id: true,
        name: true,
        location: true,
        phone: true,
      }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: decoded.userId,
        restaurantId: parseInt(restaurantId),
        date: reservationDate,
        time,
        partySize: parseInt(partySize),
        specialRequests,
        phoneNumber,
        email,
        status: 'PENDING',
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
            phone: true,
            image: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Reservation created successfully',
      reservation
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
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

    const { searchParams } = new URL(req.url)
    const restaurantId = searchParams.get('restaurantId')
    const status = searchParams.get('status')

    // Build where clause
    const where: Record<string, unknown> = {
      userId: decoded.userId,
    }

    if (restaurantId) {
      where.restaurantId = parseInt(restaurantId)
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // Get user's reservations
    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true,
            phone: true,
            image: true,
            cuisine: true,
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({
      reservations
    })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
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
    const { reservationId, status } = body

    // Validate required fields
    if (!reservationId || !status) {
      return NextResponse.json(
        { error: 'Reservation ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Check if reservation exists and belongs to user
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: parseInt(reservationId),
        userId: decoded.userId,
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Update reservation status
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: parseInt(reservationId),
      },
      data: {
        status: status.toUpperCase(),
      },
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
    })

    return NextResponse.json({
      message: 'Reservation updated successfully',
      reservation: updatedReservation
    })
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

