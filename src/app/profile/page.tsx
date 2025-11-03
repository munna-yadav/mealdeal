"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useRestaurantsByOwner } from "@/hooks/useRestaurants"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DealCard } from "@/components/deal-card"
import { User, Heart, History, Settings, MapPin, Bell, Star, Trash2, Edit, Building2, Plus } from "lucide-react"
import type { DealCardProps } from "@/types"

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

// Placeholder data - these features will be implemented later
interface SavedDeal extends DealCardProps {
  savedDate: string
}

interface DealHistoryItem {
  id: string
  title: string
  restaurant: string
  date: string
  status: "used" | "expired"
  paidPrice: number
  originalPrice: number
  savings: number
}

interface FavoriteRestaurant {
  id: string
  name: string
  cuisine: string
  image: string
  rating: number
  activeDeals: number
}

const savedDeals: SavedDeal[] = []
const dealHistory: DealHistoryItem[] = []
const favoriteRestaurants: FavoriteRestaurant[] = []

function ProfilePageContent() {
  const { isAuthorized, isLoading, user } = useAuthGuard()
  const { data: userRestaurants = [], isLoading: isLoadingRestaurants } = useRestaurantsByOwner(user?.id)
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("saved")
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedLocation, setEditedLocation] = useState("Downtown") // TODO: Add location to user model

  // Handle tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['saved', 'restaurants', 'history', 'favorites', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

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
    { id: "restaurants", label: "My Restaurants", icon: Building2, count: userRestaurants.length },
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
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    Start saving deals you&apos;re interested in for easy access later
                  </p>
                  <Button>Browse Deals</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "restaurants" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Restaurants</h2>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">{userRestaurants.length} restaurants</p>
                  <Button asChild>
                    <Link href="/restaurant/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Restaurant
                    </Link>
                  </Button>
                </div>
              </div>
              
              {isLoadingRestaurants ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[1, 2, 3].map((i) => (
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
              ) : userRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {userRestaurants.map((restaurant) => (
                    <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"}
                          alt={restaurant.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 text-black">
                            {restaurant.offers.filter(offer => offer.isActive && new Date(offer.expiresAt) > new Date()).length} active offers
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold line-clamp-1">{restaurant.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{restaurant.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="line-clamp-1">{restaurant.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {restaurant.reviewCount} reviews
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={`/restaurant/edit/${restaurant.id}`}>
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`/restaurant/${restaurant.id}`}>
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No restaurants yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first restaurant listing to start offering deals to customers
                  </p>
                  <Button asChild>
                    <Link href="/restaurant/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Restaurant
                    </Link>
                  </Button>
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

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  )
}
