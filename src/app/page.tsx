import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DealCard } from "@/components/deal-card"
import { RestaurantCard } from "@/components/restaurant-card"
import { Search, MapPin, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const featuredDeals = [
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
  }
]

const popularRestaurants = [
  {
    id: "1",
    name: "Bella Vista",
    cuisine: "Italian • Fine Dining",
    rating: 4.8,
    reviewCount: 324,
    location: "Downtown",
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    dealCount: 3,
    minDiscount: 50
  },
  {
    id: "2",
    name: "Sakura Sushi",
    cuisine: "Japanese • Sushi Bar",
    rating: 4.6,
    reviewCount: 198,
    location: "Midtown",
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    dealCount: 2,
    minDiscount: 30
  },
  {
    id: "3",
    name: "Urban Grill",
    cuisine: "American • Burgers",
    rating: 4.4,
    reviewCount: 156,
    location: "West Side",
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    dealCount: 1,
    minDiscount: 25
  },
  {
    id: "4",
    name: "Spice Route",
    cuisine: "Indian • Curry House",
    rating: 4.7,
    reviewCount: 267,
    location: "East Village",
    deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    dealCount: 4,
    minDiscount: 40
  }
]

const categories = [
  { name: "Italian", icon: "🍝", deals: 12 },
  { name: "Japanese", icon: "🍱", deals: 8 },
  { name: "American", icon: "🍔", deals: 15 },
  { name: "Mexican", icon: "🌮", deals: 9 },
  { name: "Chinese", icon: "🥡", deals: 11 },
  { name: "Indian", icon: "🍛", deals: 7 },
]

export default function Home() {
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
          <div className="container max-w-screen-2xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
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
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search restaurants, cuisines, or dishes..."
                  className="pl-10 h-12"
                />
              </div>
              <div className="relative sm:w-48">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Location"
                  className="pl-10 h-12"
                />
              </div>
                <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  Search Deals
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
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">Browse by Cuisine</span>
            </h2>
            <p className="text-muted-foreground">Explore deals from your favorite food categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
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
        <div className="container max-w-screen-2xl mx-auto px-4">
                      <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                🔥 <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Featured Deals</span>
              </h2>
              <p className="text-muted-foreground">Limited time offers you can't miss</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/deals">
                View All Deals
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16 bg-muted/10">
        <div className="container max-w-screen-2xl mx-auto px-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container max-w-screen-2xl mx-auto px-4 text-center">
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
