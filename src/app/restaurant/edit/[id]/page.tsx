"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useUpdateRestaurant } from "@/hooks/useRestaurants"
import { restaurantAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LocationSearch } from "@/components/location-search"
import { ArrowLeft, Building2, MapPin, Phone, Clock, FileText, Image as ImageIcon, Navigation, Save } from "lucide-react"
import Link from "next/link"
import { type LocationData } from "@/lib/geolocation"
import { toast } from "sonner"

interface EditRestaurantPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const { isAuthorized, isLoading: authLoading } = useAuthGuard()
  const router = useRouter()
  const updateRestaurantMutation = useUpdateRestaurant()
  // Toast is imported from sonner
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [restaurantId, setRestaurantId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    description: "",
    location: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    phone: "",
    hours: "",
    image: "",
  })
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)

  // Get restaurant ID from params and fetch restaurant data
  useEffect(() => {
    async function loadRestaurant() {
      try {
        const { id } = await params
        const restaurantIdNum = parseInt(id)
        setRestaurantId(restaurantIdNum)

        // Fetch restaurant data
        const response = await restaurantAPI.getById(restaurantIdNum)
        const restaurant = response.data.restaurant

        // Check if user owns this restaurant
        if (!restaurant) {
          setError('Restaurant not found')
          setLoading(false)
          return
        }

        // Populate form with existing data
        setFormData({
          name: restaurant.name || "",
          cuisine: restaurant.cuisine || "",
          description: restaurant.description || "",
          location: restaurant.location || "",
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          phone: restaurant.phone || "",
          hours: restaurant.hours || "",
          image: restaurant.image || "",
        })

        // Set location data if coordinates exist
        if (restaurant.latitude && restaurant.longitude) {
          setUserLocation({
            coordinates: {
              latitude: restaurant.latitude,
              longitude: restaurant.longitude
            }
          })
        }

        setLoading(false)
      } catch (err: unknown) {
        console.error('Error loading restaurant:', err)
        setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to load restaurant')
        setLoading(false)
      }
    }

    if (isAuthorized) {
      loadRestaurant()
    }
  }, [params, isAuthorized])

  // Show loading while checking auth
  if (authLoading || loading) {
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

  // Show error if restaurant couldn't be loaded
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Restaurant</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/profile">
              <Button variant="outline">Back to Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLocationChange = (location: LocationData | null) => {
    setUserLocation(location)
    if (location && !location.error) {
      setFormData(prev => ({
        ...prev,
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        latitude: undefined,
        longitude: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!restaurantId) {
      setError('Restaurant ID is missing')
      return
    }

    try {
      await updateRestaurantMutation.mutateAsync({
        id: restaurantId,
        ...formData
      })
      
      setSuccess(true)
      toast.success("Restaurant updated successfully! 🎉", {
        description: "Your restaurant information has been updated."
      })
      
      setTimeout(() => {
        router.push('/profile?tab=restaurants')
      }, 2000)
    } catch (err: unknown) {
      console.error('Error updating restaurant:', err)
      const errorMessage = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || 
                           (err as { message?: string })?.message || 'Failed to update restaurant'
      setError(errorMessage)
      toast.error("Failed to update restaurant", {
        description: errorMessage
      })
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Restaurant Updated!</h2>
            <p className="text-muted-foreground mb-4">
              Your restaurant has been successfully updated. Redirecting to your profile...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile?tab=restaurants">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Restaurant</h1>
              <p className="text-muted-foreground">Update your restaurant information</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Restaurant Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter restaurant name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cuisine" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Cuisine Type *
                    </Label>
                    <Input
                      id="cuisine"
                      name="cuisine"
                      type="text"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      placeholder="e.g., Italian, Mexican, Chinese"
                      required
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter restaurant address"
                    required
                  />
                  
                  {/* GPS Location */}
                  <div className="mt-4">
                    <Label className="flex items-center gap-2 mb-2">
                      <Navigation className="h-4 w-4" />
                      GPS Location (Optional)
                    </Label>
                    <LocationSearch 
                      onLocationChange={handleLocationChange}
                      currentLocation={userLocation}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Add precise coordinates for better direction services
                    </p>
                  </div>
                </div>

                {/* Contact & Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Operating Hours
                    </Label>
                    <Input
                      id="hours"
                      name="hours"
                      type="text"
                      value={formData.hours}
                      onChange={handleInputChange}
                      placeholder="Mon-Sun: 9:00 AM - 10:00 PM"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your restaurant's atmosphere, specialties, and what makes it unique..."
                    rows={4}
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image URL
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/restaurant-image.jpg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide a URL to an image of your restaurant
                  </p>
                </div>

                <Separator />

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Link href="/profile?tab=restaurants">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={updateRestaurantMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {updateRestaurantMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Restaurant
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


