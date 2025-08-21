import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Clock, Phone, Heart, Share, Calendar } from "lucide-react"

// Mock restaurant data
const restaurants = {
  "1": {
    id: "1",
    name: "Bella Vista",
    cuisine: "Italian • Fine Dining",
    rating: 4.8,
    reviewCount: 324,
    location: "123 Main St, Downtown",
    phone: "(555) 123-4567",
    hours: "Mon-Sun: 11:00 AM - 10:00 PM",
    deliveryTime: "25-35 min",
    description: "Experience authentic Italian cuisine in an elegant atmosphere. Our chefs use traditional recipes passed down through generations, featuring fresh ingredients imported directly from Italy.",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
    ],
    deals: [
      {
        id: "1",
        title: "3-Course Italian Dinner for Two",
        discount: 50,
        originalPrice: 120,
        discountedPrice: 60,
        description: "Includes appetizer, main course, and dessert",
        expiresIn: "2 days",
        terms: "Valid for dinner only. Cannot be combined with other offers."
      },
      {
        id: "2",
        title: "Wine Tasting Experience",
        discount: 35,
        originalPrice: 85,
        discountedPrice: 55,
        description: "Taste 6 premium Italian wines with cheese pairing",
        expiresIn: "1 week",
        terms: "Available weekends only. Must be 21+."
      }
    ],
    menu: [
      {
        category: "Appetizers",
        items: [
          { name: "Bruschetta alla Nonna", price: 12, description: "Toasted bread with tomatoes, basil, and garlic" },
          { name: "Antipasto Platter", price: 18, description: "Selection of cured meats, cheeses, and olives" },
          { name: "Calamari Fritti", price: 16, description: "Crispy fried squid with marinara sauce" }
        ]
      },
      {
        category: "Main Courses",
        items: [
          { name: "Osso Buco", price: 32, description: "Braised veal shanks with risotto Milanese" },
          { name: "Spaghetti Carbonara", price: 24, description: "Traditional Roman pasta with pancetta and egg" },
          { name: "Branzino al Sale", price: 28, description: "Mediterranean sea bass baked in sea salt" }
        ]
      },
      {
        category: "Desserts",
        items: [
          { name: "Tiramisu", price: 8, description: "Classic Italian coffee-flavored dessert" },
          { name: "Panna Cotta", price: 7, description: "Vanilla custard with berry compote" }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "2 days ago",
        comment: "Absolutely incredible dining experience! The osso buco was perfectly tender and the service was impeccable."
      },
      {
        id: 2,
        name: "Mike Chen",
        rating: 5,
        date: "1 week ago",
        comment: "Best Italian restaurant in the city. The wine selection is outstanding and the atmosphere is perfect for date night."
      },
      {
        id: 3,
        name: "Emma Davis",
        rating: 4,
        date: "2 weeks ago",
        comment: "Great food and ambiance. The carbonara was authentic and delicious. Will definitely be back!"
      }
    ]
  }
}

interface RestaurantPageProps {
  params: {
    id: string
  }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = restaurants[params.id as keyof typeof restaurants]

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image Gallery */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full">
          <div className="relative col-span-1 md:col-span-1 lg:col-span-2">
            <Image
              src={restaurant.images[0]}
              alt={restaurant.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-2">
            <div className="relative">
              <Image
                src={restaurant.images[1]}
                alt={`${restaurant.name} interior`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative">
              <Image
                src={restaurant.images[2]}
                alt={`${restaurant.name} food`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary">
            <Share className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button size="icon" variant="secondary">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Restaurant Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{restaurant.cuisine}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{restaurant.rating}</span>
                  <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.phone}</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Active Deals */}
            <div>
              <h2 className="text-2xl font-bold mb-6">🔥 Current Deals</h2>
              <div className="grid gap-4">
                {restaurant.deals.map((deal) => (
                  <Card key={deal.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{deal.title}</h3>
                            <Badge variant="destructive" className="bg-red-500">
                              {deal.discount}% OFF
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{deal.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-green-600">${deal.discountedPrice}</span>
                              <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Expires in {deal.expiresIn}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{deal.terms}</p>
                        </div>
                        <Button className="md:w-auto w-full">
                          Claim Deal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Menu */}
            <div>
              <h2 className="text-2xl font-bold mb-6">📋 Menu</h2>
              <div className="space-y-6">
                {restaurant.menu.map((section) => (
                  <Card key={section.category}>
                    <CardHeader>
                      <CardTitle className="text-xl">{section.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {section.items.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <span className="font-semibold">${item.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            {index < section.items.length - 1 && <Separator className="mt-3" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-6">⭐ Reviews</h2>
              <div className="space-y-4">
                {restaurant.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{review.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="text-center">
                  <Button variant="outline">View All Reviews</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Restaurant Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{restaurant.hours}</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Restaurant
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Make Reservation
                </Button>
              </CardContent>
            </Card>

            {/* Similar Restaurants */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Restaurants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop"
                        alt="Sakura Sushi"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Sakura Sushi</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.6</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop"
                        alt="Spice Route"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Spice Route</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

