"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin, Clock, Phone, Heart, Share, Calendar, Gift } from "lucide-react"
import { restaurantAPI, reservationsAPI, dealsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { ReservationModal } from "@/components/reservation-modal"
import type { Restaurant } from "@/hooks/useRestaurants"

// Default placeholder data for loading/error states
const defaultImages = [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
]

interface RestaurantPageProps {
  params: Promise<{
    id: string
  }>
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [claimingDeals, setClaimingDeals] = useState<Set<number>>(new Set())
  const [claimedDeals, setClaimedDeals] = useState<Set<number>>(new Set())
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const { id } = await params
        const response = await restaurantAPI.getAll()
        const restaurants = response.data.restaurants
        const foundRestaurant = restaurants.find((r: Restaurant) => r.id.toString() === id)
        
        if (!foundRestaurant) {
    notFound()
          return
        }
        
        setRestaurant(foundRestaurant)
      } catch (err) {
        console.error('Error fetching restaurant:', err)
        setError('Failed to load restaurant')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [params])

  // Handler functions for the action buttons
  const handleCallRestaurant = () => {
    if (restaurant?.phone) {
      window.location.href = `tel:${restaurant.phone}`
    } else {
      toast({
        title: "Phone number not available",
        description: "This restaurant hasn't provided a phone number",
        variant: "destructive"
      })
    }
  }

  const handleGetDirections = () => {
    if (restaurant?.latitude && restaurant?.longitude) {
      // Use Google Maps with coordinates
      const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`
      window.open(url, '_blank')
    } else if (restaurant?.location) {
      // Fallback to address search
      const encodedAddress = encodeURIComponent(restaurant.location)
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      window.open(url, '_blank')
    } else {
      toast({
        title: "Location not available",
        description: "This restaurant's location information is not available",
        variant: "destructive"
      })
    }
  }

  const handleMakeReservation = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a reservation",
        variant: "destructive"
      })
      return
    }
    setShowReservationModal(true)
  }

  const handleClaimDeal = async (offerId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to claim deals",
        variant: "destructive"
      })
      return
    }

    if (claimedDeals.has(offerId)) return

    setClaimingDeals(prev => new Set(prev).add(offerId))
    try {
      const response = await dealsAPI.claim(offerId)
      
      setClaimedDeals(prev => new Set(prev).add(offerId))
      toast({
        title: "Deal claimed successfully! 🎉",
        description: `Redemption code: ${response.data.claimedDeal.redemptionCode}`,
      })
    } catch (error: any) {
      toast({
        title: "Failed to claim deal",
        description: error.response?.data?.error || "Please try again later",
        variant: "destructive"
      })
    } finally {
      setClaimingDeals(prev => {
        const newSet = new Set(prev)
        newSet.delete(offerId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-[400px] md:h-[500px] bg-gray-200 animate-pulse"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Restaurant Not Found</h1>
          <p className="text-muted-foreground">{error || 'The restaurant you are looking for does not exist.'}</p>
        </div>
      </div>
    )
  }

  // Calculate active offers
  const activeOffers = restaurant.offers.filter(
    offer => offer.isActive && new Date(offer.expiresAt) > new Date()
  )

  // Use restaurant image or default
  const restaurantImages = restaurant.image ? [restaurant.image, ...defaultImages] : defaultImages

  return (
    <div className="min-h-screen">
      {/* Hero Image Gallery */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full">
          <div className="relative col-span-1 md:col-span-1 lg:col-span-2">
            <Image
              src={restaurantImages[0]}
              alt={restaurant.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-2">
            <div className="relative">
              <Image
                src={restaurantImages[1]}
                alt={`${restaurant.name} interior`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative">
              <Image
                src={restaurantImages[2]}
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
                {restaurant.hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{restaurant.hours}</span>
                </div>
                )}
                {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{restaurant.phone}</span>
                </div>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Active Deals */}
            <div>
              <h2 className="text-2xl font-bold mb-6">🔥 Current Deals</h2>
              <div className="grid gap-4">
                {activeOffers.length > 0 ? activeOffers.map((deal) => (
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
                          {deal.description && (
                          <p className="text-muted-foreground mb-2">{deal.description}</p>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-green-600">${deal.discountedPrice}</span>
                              <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Expires {new Date(deal.expiresAt).toLocaleDateString()}
                            </div>
                          </div>
                          {deal.terms && (
                          <p className="text-xs text-muted-foreground mt-2">{deal.terms}</p>
                          )}
                        </div>
                        <Button 
                          className={`md:w-auto w-full ${claimedDeals.has(deal.id) ? "bg-green-600 hover:bg-green-700" : ""}`}
                          onClick={() => handleClaimDeal(deal.id)}
                          disabled={claimingDeals.has(deal.id) || claimedDeals.has(deal.id)}
                        >
                          {claimedDeals.has(deal.id) ? (
                            <>
                              <Gift className="w-4 h-4 mr-1" />
                              Claimed!
                            </>
                          ) : claimingDeals.has(deal.id) ? (
                            "Claiming..."
                          ) : (
                            <>
                              <Gift className="w-4 h-4 mr-1" />
                              Claim Deal
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No active deals at the moment.</p>
                      <p className="text-sm text-muted-foreground mt-1">Check back later for new offers!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Menu */}
            <div>
              <h2 className="text-2xl font-bold mb-6">📋 Menu</h2>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Menu information not available.</p>
                  <p className="text-sm text-muted-foreground mt-1">Contact the restaurant directly for menu details.</p>
                    </CardContent>
                  </Card>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-6">⭐ Reviews</h2>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{restaurant.rating}</span>
                    <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                          </div>
                  <p className="text-muted-foreground">Individual reviews coming soon!</p>
                    </CardContent>
                  </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Restaurant Hours */}
            {restaurant.hours && (
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
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={handleCallRestaurant}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Restaurant
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGetDirections}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleMakeReservation}
                >
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
      
      {/* Reservation Modal */}
      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
    </div>
  )
}


