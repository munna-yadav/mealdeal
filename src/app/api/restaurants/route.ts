import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { calculateDistance } from '@/lib/geolocation'
import type { JWTPayload, Coordinates } from '@/types'

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
    const { name, cuisine, description, location, latitude, longitude, phone, hours, image } = body

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
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
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
    const search = searchParams.get('search')
    const cuisine = searchParams.get('cuisine')
    const location = searchParams.get('location')
    const userLat = searchParams.get('lat')
    const userLng = searchParams.get('lng')
    const radius = searchParams.get('radius')
    const sortBy = searchParams.get('sortBy') || 'created'

    // Build where clause
    const where: any = {}
    
    if (ownerId) {
      where.ownerId = parseInt(ownerId)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cuisine: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (cuisine && cuisine !== 'all') {
      where.cuisine = { equals: cuisine, mode: 'insensitive' }
    }

    if (location && location !== 'all') {
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'created':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Fetch restaurants
    let restaurants: any[] = await prisma.restaurant.findMany({
      where,
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
      orderBy,
    })

    // Apply location-based filtering if coordinates are provided
    if (userLat && userLng && radius) {
      const userCoords: Coordinates = {
        latitude: parseFloat(userLat),
        longitude: parseFloat(userLng),
      }
      const radiusKm = parseFloat(radius)

      restaurants = restaurants
        .map(restaurant => {
          if (restaurant.latitude && restaurant.longitude) {
            const distance = calculateDistance(userCoords, {
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            })
            return { ...restaurant, distance }
          }
          return { ...restaurant, distance: null }
        })
        .filter(restaurant => {
          if (restaurant.distance === null) return true // Include restaurants without coordinates
          return restaurant.distance <= radiusKm
        })

      // Sort by distance if location sorting is requested
      if (sortBy === 'distance') {
        restaurants.sort((a, b) => {
          if (a.distance === null && b.distance === null) return 0
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })
      }
    }

    // Get unique cuisines and locations for frontend filters
    const cuisines = await prisma.restaurant.findMany({
      select: { cuisine: true },
      distinct: ['cuisine'],
      orderBy: { cuisine: 'asc' },
    })

    const locations = await prisma.restaurant.findMany({
      select: { location: true },
      distinct: ['location'],
      orderBy: { location: 'asc' },
    })

    return NextResponse.json({
      restaurants,
      filters: {
        cuisines: cuisines.map(c => c.cuisine),
        locations: locations.map(l => l.location),
      },
      count: restaurants.length,
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
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
    const { id, name, cuisine, description, location, latitude, longitude, phone, hours, image } = body

    // Validate required fields
    if (!id || !name || !cuisine || !location) {
      return NextResponse.json(
        { error: 'ID, name, cuisine, and location are required' },
        { status: 400 }
      )
    }

    // Check if restaurant exists and belongs to the user
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        id: parseInt(id),
        ownerId: decoded.userId,
      }
    })

    if (!existingRestaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found or you do not have permission to edit it' },
        { status: 404 }
      )
    }

    // Update restaurant
    const restaurant = await prisma.restaurant.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        cuisine,
        description,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        phone,
        hours,
        image,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        offers: true,
      }
    })

    return NextResponse.json({
      message: 'Restaurant updated successfully',
      restaurant
    })
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
