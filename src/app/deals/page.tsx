"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DealCard } from "@/components/deal-card"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { useOffers } from "@/hooks/useOffers"

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
  const searchParams = useSearchParams()
  const { data: offers = [], isLoading, error } = useOffers(true) // Only active offers
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedDiscount, setSelectedDiscount] = useState("all")
  const [sortBy, setSortBy] = useState("discount")

  // Handle URL parameters (e.g., from category clicks on home page)
  useEffect(() => {
    const cuisine = searchParams.get('cuisine')
    if (cuisine) {
      setSelectedCuisine(cuisine)
    }
  }, [searchParams])

  // Convert offers to deal format for DealCard component
  const allDeals = offers.map(offer => ({
    id: offer.id.toString(),
    title: offer.title,
    restaurant: {
      name: offer.restaurant.name,
      rating: offer.restaurant.rating,
      location: offer.restaurant.location
    },
    discount: offer.discount,
    originalPrice: offer.originalPrice,
    discountedPrice: offer.discountedPrice,
    image: offer.restaurant.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    expiresIn: getDaysUntilExpiry(offer.expiresAt),
    cuisine: offer.restaurant.cuisine,
    isFavorite: false // TODO: Implement favorites functionality
  }))

  // Get unique cuisines and locations for filters
  const cuisines = [...new Set(offers.map(offer => offer.restaurant.cuisine))].sort()
  const locations = [...new Set(offers.map(offer => offer.restaurant.location))].sort()

  // Filter and sort deals
  const filteredDeals = allDeals
    .filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCuisine = selectedCuisine === "all" || 
                            deal.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      
      const matchesLocation = selectedLocation === "all" || 
                             deal.restaurant.location.toLowerCase() === selectedLocation.toLowerCase()
      
      const matchesDiscount = selectedDiscount === "all" || 
                             (selectedDiscount === "high" && deal.discount >= 40) ||
                             (selectedDiscount === "medium" && deal.discount >= 25 && deal.discount < 40) ||
                             (selectedDiscount === "low" && deal.discount < 25)
      
      return matchesSearch && matchesCuisine && matchesLocation && matchesDiscount
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return b.discount - a.discount
        case "price":
          return a.discountedPrice - b.discountedPrice
        case "rating":
          return b.restaurant.rating - a.restaurant.rating
        case "expiry":
          // Simple expiry sorting (hours < days)
          const aHours = a.expiresIn.includes("hour") ? parseInt(a.expiresIn) : parseInt(a.expiresIn) * 24
          const bHours = b.expiresIn.includes("hour") ? parseInt(b.expiresIn) : parseInt(b.expiresIn) * 24
          return aHours - bHours
        default:
          return 0
      }
    })

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

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deals, restaurants, or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    {cuisines.map(cuisine => (
                      <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={selectedDiscount} onValueChange={setSelectedDiscount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Discount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Discounts</SelectItem>
                    <SelectItem value="high">40%+ Off</SelectItem>
                    <SelectItem value="medium">25-39% Off</SelectItem>
                    <SelectItem value="low">Under 25% Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Highest Discount</SelectItem>
                    <SelectItem value="price">Lowest Price</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="expiry">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCuisine !== "all" || selectedLocation !== "all" || selectedDiscount !== "all") && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                Search: "{searchTerm}" ×
              </Badge>
            )}
            {selectedCuisine !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCuisine("all")}>
                Cuisine: {selectedCuisine} ×
              </Badge>
            )}
            {selectedLocation !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedLocation("all")}>
                Location: {selectedLocation} ×
              </Badge>
            )}
            {selectedDiscount !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedDiscount("all")}>
                Discount: {selectedDiscount === "high" ? "40%+" : selectedDiscount === "medium" ? "25-39%" : "Under 25%"} ×
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchTerm("")
                setSelectedCuisine("all")
                setSelectedLocation("all")
                setSelectedDiscount("all")
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDeals.length} of {allDeals.length} deals
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Sorted by: {sortBy === "discount" ? "Highest Discount" : 
                        sortBy === "price" ? "Lowest Price" : 
                        sortBy === "rating" ? "Highest Rating" : "Expiring Soon"}
            </span>
          </div>
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
        ) : filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map((deal) => (
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
            <Button 
              onClick={() => {
                setSearchTerm("")
                setSelectedCuisine("all")
                setSelectedLocation("all")
                setSelectedDiscount("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredDeals.length > 0 && filteredDeals.length >= 8 && (
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


