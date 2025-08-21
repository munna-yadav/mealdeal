"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DealCard } from "@/components/deal-card"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

// Mock data for deals
const allDeals = [
  {
    id: "1",
    title: "3-Course Italian Dinner for Two",
    restaurant: {
      name: "Bella Vista",
      rating: 4.8,
      location: "Downtown"
    },
    discount: 50,
    originalPrice: 120,
    discountedPrice: 60,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    expiresIn: "2 days",
    cuisine: "Italian",
    isFavorite: false
  },
  {
    id: "2", 
    title: "All-You-Can-Eat Sushi",
    restaurant: {
      name: "Sakura Sushi",
      rating: 4.6,
      location: "Midtown"
    },
    discount: 30,
    originalPrice: 80,
    discountedPrice: 56,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    expiresIn: "5 hours",
    cuisine: "Japanese",
    isFavorite: true
  },
  {
    id: "3",
    title: "Gourmet Burger & Craft Beer",
    restaurant: {
      name: "Urban Grill",
      rating: 4.4,
      location: "West Side"
    },
    discount: 25,
    originalPrice: 32,
    discountedPrice: 24,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    expiresIn: "1 day",
    cuisine: "American",
    isFavorite: false
  },
  {
    id: "4",
    title: "Authentic Butter Chicken & Naan",
    restaurant: {
      name: "Spice Route",
      rating: 4.7,
      location: "East Village"
    },
    discount: 40,
    originalPrice: 45,
    discountedPrice: 27,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    expiresIn: "3 days",
    cuisine: "Indian",
    isFavorite: false
  },
  {
    id: "5",
    title: "Fresh Poke Bowl & Smoothie",
    restaurant: {
      name: "Ocean Fresh",
      rating: 4.5,
      location: "Beachside"
    },
    discount: 35,
    originalPrice: 28,
    discountedPrice: 18,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    expiresIn: "6 hours",
    cuisine: "Hawaiian",
    isFavorite: true
  },
  {
    id: "6",
    title: "BBQ Ribs Feast for Family",
    restaurant: {
      name: "Smoky Joe's",
      rating: 4.3,
      location: "Southside"
    },
    discount: 45,
    originalPrice: 85,
    discountedPrice: 47,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
    expiresIn: "4 days",
    cuisine: "BBQ",
    isFavorite: false
  },
  {
    id: "7",
    title: "Authentic Ramen & Gyoza",
    restaurant: {
      name: "Noodle Bar",
      rating: 4.6,
      location: "Little Tokyo"
    },
    discount: 20,
    originalPrice: 35,
    discountedPrice: 28,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
    expiresIn: "1 day",
    cuisine: "Japanese",
    isFavorite: false
  },
  {
    id: "8",
    title: "Taco Tuesday Special",
    restaurant: {
      name: "La Cantina",
      rating: 4.2,
      location: "Mexican Quarter"
    },
    discount: 30,
    originalPrice: 25,
    discountedPrice: 18,
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop",
    expiresIn: "12 hours",
    cuisine: "Mexican",
    isFavorite: true
  }
]

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedDiscount, setSelectedDiscount] = useState("all")
  const [sortBy, setSortBy] = useState("discount")

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

  const cuisines = [...new Set(allDeals.map(deal => deal.cuisine))]
  const locations = [...new Set(allDeals.map(deal => deal.restaurant.location))]

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
        {filteredDeals.length > 0 ? (
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

