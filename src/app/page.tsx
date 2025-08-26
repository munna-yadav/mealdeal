"use client"

import { Button } from "@/components/ui/button"
import { DealCard } from "@/components/deal-card"
import { RestaurantCard } from "@/components/restaurant-card"
import { Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRestaurants } from "@/hooks/useRestaurants"
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

// Static categories with dynamic counts (will be calculated from real data)
const categories = [
  { name: "Italian", icon: "🍝" },
  { name: "Japanese", icon: "🍱" },
  { name: "American", icon: "🍔" },
  { name: "Mexican", icon: "🌮" },
  { name: "Chinese", icon: "🥡" },
  { name: "Indian", icon: "🍛" },
  { name: "BBQ", icon: "🍖" },
  { name: "Hawaiian", icon: "🌺" },
]

export default function Home() {
  const { data: restaurants = [], isLoading: restaurantsLoading } = useRestaurants()
  const { data: offers = [], isLoading: offersLoading } = useOffers(true) // Only active offers

  // Get featured deals (first 3 offers)
  const featuredDeals = offers.slice(0, 3).map(offer => ({
    id: offer.id.toString(),
    title: offer.title,
    restaurant: {
      id: offer.restaurant.id.toString(),
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
    isFavorite: false
  }))

  // Get popular restaurants (first 4 restaurants)
  const popularRestaurants = restaurants.slice(0, 4).map(restaurant => {
    const activeOffers = restaurant.offers.filter(offer => 
      offer.isActive && new Date(offer.expiresAt) > new Date()
    )
    const minDiscount = activeOffers.length > 0 
      ? Math.min(...activeOffers.map(offer => offer.discount))
      : 0

    return {
      id: restaurant.id.toString(),
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating,
      reviewCount: restaurant.reviewCount,
      location: restaurant.location,
      deliveryTime: restaurant.hours || "Contact for hours",
      image: restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      dealCount: activeOffers.length,
      minDiscount
    }
  })

  // Calculate category counts from real data
  const categoriesWithCounts = categories.map(category => {
    const matchingRestaurants = restaurants.filter(r => 
      r.cuisine.toLowerCase().includes(category.name.toLowerCase())
    )
    const totalDeals = matchingRestaurants.reduce((sum, r) => 
      sum + r.offers.filter(o => o.isActive && new Date(o.expiresAt) > new Date()).length, 0
    )
    
    return {
      ...category,
      deals: totalDeals
    }
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-yellow-500/5 py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                  Discover Amazing
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
                  Restaurant Deals
                </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Save up to <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">50%</span> on your favorite meals. Find the best restaurant deals and discounts in your area.
                </p>
              </div>
            
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto justify-center items-center">
                <Button size="lg" asChild className="h-12 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Link href="/restaurants">
                    <Search className="mr-2 h-4 w-4" />
                    Search Restaurants & Deals
                  </Link>
                </Button>
              </div>
            
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-muted-foreground">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">1,200+</div>
                <div className="text-sm text-muted-foreground">Active Deals</div>
              </div>
              <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-400 bg-clip-text text-transparent">50%</div>
                  <div className="text-sm text-muted-foreground">Avg. Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">Browse by Cuisine</span>
            </h2>
            <p className="text-muted-foreground">Explore deals from your favorite food categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            {categoriesWithCounts.map((category) => (
              <Link
                key={category.name}
                href={`/deals?cuisine=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-card rounded-lg p-6 text-center transition-all hover:shadow-lg hover:scale-105 border hover:border-yellow-500/30 hover:bg-gradient-to-br hover:from-yellow-50/5 hover:to-orange-50/5">
                  <div className="text-4xl mb-3 transition-transform group-hover:scale-110">{category.icon}</div>
                  <h3 className="font-semibold mb-1 group-hover:text-yellow-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-yellow-700/70 transition-colors">{category.deals} deals</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                🔥 <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Featured Deals</span>
              </h2>
              <p className="text-muted-foreground">Limited time offers you can&apos;t miss</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/deals">
                View All Deals
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {offersLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : featuredDeals.length > 0 ? (
              featuredDeals.map((deal) => (
                <DealCard key={deal.id} {...deal} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No featured deals available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16 bg-muted/10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                ⭐ <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Popular Restaurants</span>
              </h2>
              <p className="text-muted-foreground">Top-rated restaurants with active deals</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Trending now</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {restaurantsLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : popularRestaurants.length > 0 ? (
              popularRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No restaurants available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to <span className="bg-gradient-to-r from-yellow-300 to-amber-200 bg-clip-text text-transparent">Save</span> on Your Next Meal?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of food lovers who save money with MealDeal every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/deals">
                  Browse All Deals
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Download App
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
