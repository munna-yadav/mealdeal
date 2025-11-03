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
    const search = searchParams.get('search')
    const cuisine = searchParams.get('cuisine')
    const location = searchParams.get('location')
    const discount = searchParams.get('discount')
    const userLat = searchParams.get('lat')
    const userLng = searchParams.get('lng')
    const radius = searchParams.get('radius')
    const sortBy = searchParams.get('sortBy') || 'created'
    
    // Pagination parameters
    const limit = parseInt(searchParams.get('limit') || '12')
    const cursor = searchParams.get('cursor')

    // Build where clause
    const whereClause: Record<string, unknown> = {}

    if (restaurantId) {
      whereClause.restaurantId = parseInt(restaurantId)
    }

    if (activeOnly) {
      whereClause.isActive = true
      whereClause.expiresAt = {
        gt: new Date(),
      }
    }

    // Build restaurant filters for nested queries
    const restaurantWhere: Record<string, unknown> = {}

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { restaurant: { name: { contains: search, mode: 'insensitive' } } },
        { restaurant: { cuisine: { contains: search, mode: 'insensitive' } } },
        { restaurant: { location: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (cuisine && cuisine !== 'all') {
      restaurantWhere.cuisine = { equals: cuisine, mode: 'insensitive' }
    }

    if (location && location !== 'all') {
      restaurantWhere.location = { contains: location, mode: 'insensitive' }
    }

    if (Object.keys(restaurantWhere).length > 0) {
      whereClause.restaurant = restaurantWhere
    }

    // Add cursor pagination support
    if (cursor) {
      whereClause.id = { gt: parseInt(cursor) }
    }

    // Add discount filter
    if (discount && discount !== 'all') {
      switch (discount) {
        case 'high':
          whereClause.discount = { gte: 40 }
          break
        case 'medium':
          whereClause.discount = { gte: 25, lt: 40 }
          break
        case 'low':
          whereClause.discount = { lt: 25 }
          break
      }
    }

    // Build order by clause
    let orderBy: Record<string, unknown> = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'discount':
        orderBy = { discount: 'desc' }
        break
      case 'price':
        orderBy = { discountedPrice: 'asc' }
        break
      case 'rating':
        orderBy = { restaurant: { rating: 'desc' } }
        break
      case 'expiry':
        orderBy = { expiresAt: 'asc' }
        break
      case 'created':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Fetch offers with pagination
    let offers = await prisma.offer.findMany({
      where: whereClause,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            cuisine: true,
            location: true,
            latitude: true,
            longitude: true,
            rating: true,
            image: true,
          },
        },
      },
      orderBy,
      take: limit + 1, // Take one extra to check if there's a next page
    })

    // Check if there's a next page
    const hasNextPage = offers.length > limit
    if (hasNextPage) {
      offers = offers.slice(0, limit) // Remove the extra item
    }

    // Get total count for the current query
    const totalCount = await prisma.offer.count({ where: whereClause })

    // Apply location-based filtering if coordinates are provided
    if (userLat && userLng && radius) {
      const userCoords: Coordinates = {
        latitude: parseFloat(userLat),
        longitude: parseFloat(userLng),
      }
      const radiusKm = parseFloat(radius)

  // Create a new array of offers that includes a `distance` property
  // Note: we create a new typed variable so TypeScript knows the property exists.
  // OfferType is inferred from the runtime `offers` array returned by Prisma
  type OfferType = typeof offers[number]
      let offersWithDistance: (OfferType & { distance: number | null })[] = offers.map(offer => {
        if (offer.restaurant.latitude && offer.restaurant.longitude) {
          const distance = calculateDistance(userCoords, {
            latitude: offer.restaurant.latitude,
            longitude: offer.restaurant.longitude,
          })
          return { ...offer, distance }
        }
        return { ...offer, distance: null }
      })

      // Filter by the requested radius (keep offers without coordinates), then sort if requested
      offersWithDistance = offersWithDistance.filter(offer => {
        if (offer.distance === null) return true // keep offers without coords
        return offer.distance <= radiusKm
      })

      // Sort by distance if location sorting is requested
      if (sortBy === 'distance') {
        offersWithDistance.sort((a, b) => {
          if (a.distance === null && b.distance === null) return 0
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })
      }

      // Assign the processed list back for downstream pagination/response
      offers = offersWithDistance
    }

    // Get filter options for frontend
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

    // Determine next cursor
    const nextCursor = hasNextPage && offers.length > 0 
      ? offers[offers.length - 1].id.toString() 
      : undefined

    return NextResponse.json({
      offers,
      filters: {
        cuisines: cuisines.map(c => c.cuisine),
        locations: locations.map(l => l.location),
      },
      count: offers.length,
      pagination: {
        hasNextPage,
        nextCursor,
        totalCount,
      },
    })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
