"use client"

import { useState } from "react"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DealCard } from "@/components/deal-card"
import { User, Heart, History, Settings, MapPin, Bell, Star, Trash2, Edit } from "lucide-react"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "Downtown",
  memberSince: "January 2024",
  totalSavings: 2847,
  dealsUsed: 34,
  favoriteRestaurants: 12,
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
}

// Mock saved deals
const savedDeals = [
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
    isFavorite: true,
    savedDate: "2 hours ago"
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
    isFavorite: true,
    savedDate: "1 day ago"
  }
]

// Mock deal history
const dealHistory = [
  {
    id: "h1",
    title: "Gourmet Burger & Craft Beer",
    restaurant: "Urban Grill",
    originalPrice: 32,
    paidPrice: 24,
    savings: 8,
    date: "March 15, 2024",
    status: "used"
  },
  {
    id: "h2",
    title: "Thai Curry Feast",
    restaurant: "Bangkok Bistro",
    originalPrice: 45,
    paidPrice: 32,
    savings: 13,
    date: "March 10, 2024",
    status: "used"
  },
  {
    id: "h3",
    title: "Mexican Taco Platter",
    restaurant: "La Cantina",
    originalPrice: 28,
    paidPrice: 18,
    savings: 10,
    date: "March 5, 2024",
    status: "expired"
  }
]

// Mock favorite restaurants
const favoriteRestaurants = [
  {
    id: "1",
    name: "Bella Vista",
    cuisine: "Italian",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
    activeDeals: 3
  },
  {
    id: "2",
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
    activeDeals: 2
  },
  {
    id: "3",
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop",
    activeDeals: 4
  }
]

export default function ProfilePage() {
  const { isAuthorized, isLoading, user } = useAuthGuard()
  const [activeTab, setActiveTab] = useState("saved")
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedLocation, setEditedLocation] = useState("Downtown") // TODO: Add location to user model

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Return null if not authorized (useAuthGuard will handle redirect)
  if (!isAuthorized) {
    return null
  }

  const tabs = [
    { id: "saved", label: "Saved Deals", icon: Heart, count: savedDeals.length },
    { id: "history", label: "Order History", icon: History, count: dealHistory.length },
    { id: "favorites", label: "Favorite Restaurants", icon: Star, count: favoriteRestaurants.length },
    { id: "settings", label: "Settings", icon: Settings, count: null }
  ]

  const handleSaveProfile = () => {
    // Here you would save the profile data
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-screen-2xl mx-auto px-4">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                      <Image
                        src={`https://avatar.vercel.sh/${user?.email}`}
                        alt={user?.name || "User"}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                  <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Full name"
                          className="flex-1"
                        />
                        <Select value={editedLocation} onValueChange={setEditedLocation}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Downtown">Downtown</SelectItem>
                            <SelectItem value="Midtown">Midtown</SelectItem>
                            <SelectItem value="West Side">West Side</SelectItem>
                            <SelectItem value="East Village">East Village</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile}>Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold">{user?.name}</h1>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {editedLocation}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">${userData.totalSavings}</div>
                    <div className="text-sm text-muted-foreground">Total Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userData.dealsUsed}</div>
                    <div className="text-sm text-muted-foreground">Deals Used</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userData.favoriteRestaurants}</div>
                    <div className="text-sm text-muted-foreground">Favorites</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-4 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count !== null && (
                      <Badge variant="secondary" className="text-xs">
                        {tab.count}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "saved" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Saved Deals</h2>
                <p className="text-muted-foreground">{savedDeals.length} deals saved</p>
              </div>
              
              {savedDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedDeals.map((deal) => (
                    <div key={deal.id} className="relative">
                      <DealCard {...deal} />
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        Saved {deal.savedDate}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No saved deals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start saving deals you're interested in for easy access later
                  </p>
                  <Button>Browse Deals</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order History</h2>
                <p className="text-muted-foreground">{dealHistory.length} orders</p>
              </div>
              
              <div className="space-y-4">
                {dealHistory.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{order.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{order.restaurant}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">{order.date}</span>
                            <Badge 
                              variant={order.status === "used" ? "default" : "secondary"}
                              className={order.status === "used" ? "bg-green-500" : ""}
                            >
                              {order.status === "used" ? "Used" : "Expired"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">${order.paidPrice}</div>
                          <div className="text-sm text-muted-foreground line-through">${order.originalPrice}</div>
                          <div className="text-sm text-green-600">Saved ${order.savings}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Favorite Restaurants</h2>
                <p className="text-muted-foreground">{favoriteRestaurants.length} restaurants</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRestaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                        <Image
                          src={restaurant.image}
                          alt={restaurant.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {restaurant.activeDeals > 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-red-500">
                            {restaurant.activeDeals} Active Deal{restaurant.activeDeals > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              
              <div className="grid gap-6">
                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Deal Alerts</h4>
                        <p className="text-sm text-muted-foreground">Get notified about new deals from your favorite restaurants</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Expiry Reminders</h4>
                        <p className="text-sm text-muted-foreground">Reminders before your saved deals expire</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Primary Location</h4>
                        <p className="text-sm text-muted-foreground">Main area for finding deals</p>
                      </div>
                      <Select defaultValue={userData.location.toLowerCase()}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="downtown">Downtown</SelectItem>
                          <SelectItem value="midtown">Midtown</SelectItem>
                          <SelectItem value="west side">West Side</SelectItem>
                          <SelectItem value="east village">East Village</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
