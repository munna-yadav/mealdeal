"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DealCard } from "@/components/deal-card"
import { AdvancedSearch } from "@/components/advanced-search"
import { Loader2, Gift } from "lucide-react"
import { useInfiniteOffers } from "@/hooks/useOffers"
import { useIntersection } from "@/hooks/useIntersection"
import type { OfferAPIParams, SearchFilters } from "@/types"

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

export default function DealsPage() {
  const [searchParams, setSearchParams] = useState<Omit<OfferAPIParams, 'cursor' | 'page'>>({
    activeOnly: true,
    sortBy: 'discount'
  })

  // Convert search filters to API parameters
  const apiParams = useMemo(() => {
    const params: Omit<OfferAPIParams, 'cursor' | 'page'> = {
      activeOnly: true,
      sortBy: searchParams.sortBy || 'discount'
    }
    
    if (searchParams.search) params.search = searchParams.search
    if (searchParams.cuisine && searchParams.cuisine !== 'all') params.cuisine = searchParams.cuisine
    if (searchParams.location && searchParams.location !== 'all') params.location = searchParams.location
    if (searchParams.discount && searchParams.discount !== 'all') params.discount = searchParams.discount
    if (searchParams.lat) params.lat = searchParams.lat
    if (searchParams.lng) params.lng = searchParams.lng
    if (searchParams.radius) params.radius = searchParams.radius
    
    return params
  }, [searchParams])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteOffers(apiParams)

  // Flatten all pages into a single array of offers
  const offers = useMemo(() => {
    return data?.pages.flatMap(page => page.offers) ?? []
  }, [data])

  // Get available filters from the first page
  const availableFilters = useMemo(() => {
    return data?.pages[0]?.filters ?? { cuisines: [], locations: [] }
  }, [data])

  // Intersection observer for infinite scroll
  const [loadMoreRef, isLoadMoreVisible] = useIntersection({
    threshold: 0.1,
    rootMargin: '100px'
  })

  // Trigger next page load when load more element is visible
  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSearchChange = useCallback((filters: SearchFilters) => {
    const newParams: Omit<OfferAPIParams, 'cursor' | 'page'> = {
      activeOnly: true,
      sortBy: filters.sortBy || 'discount'
    }
    
    if (filters.search) newParams.search = filters.search
    if (filters.cuisine !== 'all') newParams.cuisine = filters.cuisine
    if (filters.location !== 'all') newParams.location = filters.location
    if (filters.discount !== 'all') newParams.discount = filters.discount
    if (filters.userLocation && !filters.userLocation.error) {
      newParams.lat = filters.userLocation.coordinates.latitude
      newParams.lng = filters.userLocation.coordinates.longitude
      newParams.radius = filters.radius || 10
    }
    
    setSearchParams(newParams)
  }, [])

  if (isError) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Gift className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Deals</h2>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎉 Hot Deals</h1>
          <p className="text-muted-foreground">
            Discover amazing food deals and save on your favorite meals
          </p>
        </div>

        {/* Advanced Search */}
        <div className="mb-8">
          <AdvancedSearch
            onSearchChange={handleSearchChange}
            availableFilters={availableFilters}
            searchType="deals"
            placeholder="Search deals, cuisine, or location..."
            showLocationSearch={true}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${offers.length} deal${offers.length !== 1 ? 's' : ''} found`}
            {data?.pages[0]?.pagination?.totalCount && (
              <span className="ml-2">
                (Total: {data.pages[0].pagination.totalCount})
              </span>
            )}
          </p>
        </div>

        {/* Deals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {offers.map((offer) => (
              <DealCard
                key={offer.id}
                id={offer.id.toString()}
                title={offer.title}
                restaurant={{
                  name: offer.restaurant.name,
                  rating: offer.restaurant.rating,
                  location: offer.restaurant.location,
                }}
                discount={offer.discount}
                originalPrice={offer.originalPrice}
                discountedPrice={offer.discountedPrice}
                image={offer.restaurant.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"}
                expiresIn={getDaysUntilExpiry(offer.expiresAt)}
                cuisine={offer.restaurant.cuisine}
                isFavorite={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No deals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Infinite scroll loading indicator */}
        {(hasNextPage || isFetchingNextPage) && (
          <div 
            ref={loadMoreRef}
            className="flex justify-center items-center py-8"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more deals...</span>
            </div>
          </div>
        )}

        {/* End of results indicator */}
        {!hasNextPage && !isLoading && offers.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
                                You&apos;ve seen all {offers.length} deals
            </p>
          </div>
        )}
      </div>
    </div>
  )
}