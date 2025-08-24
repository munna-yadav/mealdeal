"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DealCard } from "@/components/deal-card"
import { AdvancedSearch } from "@/components/advanced-search"
import { SlidersHorizontal } from "lucide-react"
import { offerAPI } from "@/lib/api"
import { formatDistance, type LocationData } from "@/lib/geolocation"

// Helper function to calculate days until expiry
const getDaysUntilExpiry = (expiresAt: string) => {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 1) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    return diffHours > 0 ? `${diffHours} hours` : 'Expired'
  }
  return `${diffDays} days`
}

interface Offer {
  id: number
  title: string
  description?: string
  originalPrice: number
  discountedPrice: number
  discount: number
  terms?: string
  expiresAt: string
  isActive: boolean
  restaurantId: number
  restaurant: {
    id: number
    name: string
    cuisine: string
    location: string
    latitude?: number
    longitude?: number
    rating: number
    image?: string
  }
  distance?: number
  createdAt: string
  updatedAt: string
}

interface SearchFilters {
  search: string
  cuisine: string
  location: string
  discount: string
  sortBy: string
  userLocation?: LocationData | null
  radius?: number
}

export default function DealsPage() {
  const searchParams = useSearchParams()
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableFilters, setAvailableFilters] = useState({ cuisines: [], locations: [] })

  const fetchOffers = async (filters: SearchFilters) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params: any = { activeOnly: true }
      
      if (filters.search) params.search = filters.search
      if (filters.cuisine !== 'all') params.cuisine = filters.cuisine
      if (filters.location !== 'all') params.location = filters.location
      if (filters.discount !== 'all') params.discount = filters.discount
      if (filters.sortBy) params.sortBy = filters.sortBy
      
      // Add location parameters if available
      if (filters.userLocation && !filters.userLocation.error) {
        params.lat = filters.userLocation.coordinates.latitude
        params.lng = filters.userLocation.coordinates.longitude
        params.radius = filters.radius || 10
      }

      const response = await offerAPI.getAll(params)
      setOffers(response.data.offers || [])
      setAvailableFilters(response.data.filters || { cuisines: [], locations: [] })
    } catch (err: any) {
      setError('Failed to fetch offers')
      console.error('Error fetching offers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load and URL parameter handling
  useEffect(() => {
    const cuisine = searchParams.get('cuisine')
    fetchOffers({
      search: '',
      cuisine: cuisine || 'all',
      location: 'all',
      discount: 'all',
      sortBy: 'discount'
    })
  }, [searchParams])

  const handleSearchChange = useCallback((filters: SearchFilters) => {
    fetchOffers(filters)
  }, []) // Empty dependency array since fetchOffers doesn't depend on external state

  // Convert offers to deal format for DealCard component
  const allDeals = offers.map(offer => ({
    id: offer.id.toString(),
    title: offer.title,
    restaurant: {
      name: offer.restaurant.name,
      rating: offer.restaurant.rating,
      location: `${offer.restaurant.location}${offer.distance ? ` • ${formatDistance(offer.distance)}` : ''}`
    },
    discount: offer.discount,
    originalPrice: offer.originalPrice,
    discountedPrice: offer.discountedPrice,
    image: offer.restaurant.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    expiresIn: getDaysUntilExpiry(offer.expiresAt),
    cuisine: offer.restaurant.cuisine,
    isFavorite: false // TODO: Implement favorites functionality
  }))

  if (error) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Deals</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-screen-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Deals</h1>
          <p className="text-muted-foreground text-lg">
            Discover {allDeals.length} amazing restaurant deals in your area
          </p>
        </div>

        {/* Advanced Search */}
        <div className="mb-8">
          <AdvancedSearch
            onSearchChange={handleSearchChange}
            availableFilters={availableFilters}
            searchType="deals"
            placeholder="Search deals, restaurants, or cuisines..."
            showLocationSearch={true}
            initialFilters={{
              cuisine: searchParams.get('cuisine') || 'all'
            }}
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {allDeals.length} deals
          </p>
        </div>

        {/* Deals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : allDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allDeals.map((deal) => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No deals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {allDeals.length > 0 && allDeals.length >= 8 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Deals
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


