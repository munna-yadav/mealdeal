"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AdvancedSearch } from "@/components/advanced-search"
import { Star, MapPin, Building2 } from "lucide-react"
import { restaurantAPI } from "@/lib/api"
import { formatDistance } from "@/lib/geolocation"
import type { Restaurant, SearchFilters, LocationData } from "@/types"

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableFilters, setAvailableFilters] = useState({ cuisines: [], locations: [] })

  const fetchRestaurants = async (filters: SearchFilters) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      
      if (filters.search) params.search = filters.search
      if (filters.cuisine !== 'all') params.cuisine = filters.cuisine
      if (filters.location !== 'all') params.location = filters.location
      if (filters.sortBy) params.sortBy = filters.sortBy
      
      // Add location parameters if available
      if (filters.userLocation && !filters.userLocation.error) {
        params.lat = filters.userLocation.coordinates.latitude
        params.lng = filters.userLocation.coordinates.longitude
        params.radius = filters.radius || 10
      }

      const response = await restaurantAPI.getAll(params)
      setRestaurants(response.data.restaurants || [])
      setAvailableFilters(response.data.filters || { cuisines: [], locations: [] })
    } catch (err: any) {
      setError('Failed to fetch restaurants')
      console.error('Error fetching restaurants:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchRestaurants({
      search: '',
      cuisine: 'all',
      location: 'all', 
      discount: 'all',
      sortBy: 'rating'
    })
  }, [])

  const handleSearchChange = useCallback((filters: SearchFilters) => {
    fetchRestaurants(filters)
  }, []) // Empty dependency array since fetchRestaurants doesn't depend on external state

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Restaurants</h2>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Restaurants</h1>
          <p className="text-muted-foreground">
            Discover amazing restaurants and their exclusive deals
          </p>
        </div>

        {/* Advanced Search */}
        <div className="mb-8">
          <AdvancedSearch
            onSearchChange={handleSearchChange}
            availableFilters={availableFilters}
            searchType="restaurants"
            placeholder="Search restaurants, cuisine, or location..."
            showLocationSearch={true}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => {
              const activeOffers = restaurant.offers.filter(
                offer => offer.isActive && new Date(offer.expiresAt) > new Date()
              )
              
              return (
                <Link 
                  key={restaurant.id} 
                  href={`/restaurant/${restaurant.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-[1.02]">
                    <div className="relative h-48">
                      <Image
                        src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"}
                        alt={restaurant.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {activeOffers.length > 0 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            {activeOffers.length} deal{activeOffers.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <div className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{restaurant.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {restaurant.location}
                          {restaurant.distance && (
                            <span className="ml-2 text-xs text-blue-600 font-medium">
                              • {formatDistance(restaurant.distance)}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{restaurant.reviewCount} reviews</span>
                        <span>By {restaurant.owner.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters, or be the first to add a restaurant to the platform
            </p>
            <Button asChild>
              <Link href="/restaurant/add">
                <Building2 className="w-4 h-4 mr-2" />
                Add Restaurant
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

