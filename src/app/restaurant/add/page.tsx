"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useCreateRestaurant } from "@/hooks/useRestaurants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, MapPin, Phone, Clock, FileText, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function AddRestaurantPage() {
  const { isAuthorized, isLoading } = useAuthGuard()
  const router = useRouter()
  const createRestaurantMutation = useCreateRestaurant()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    description: "",
    location: "",
    phone: "",
    hours: "",
    image: "",
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await createRestaurantMutation.mutateAsync(formData)
      setSuccess(true)
      setTimeout(() => {
        router.push('/profile?tab=restaurants')
      }, 2000)
    } catch (err: any) {
      console.error('Error creating restaurant:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create restaurant'
      setError(errorMessage)
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
            <h2 className="text-xl font-semibold mb-2">Restaurant Created!</h2>
            <p className="text-muted-foreground mb-4">
              Your restaurant has been successfully created. Redirecting to your profile...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add New Restaurant</h1>
            <p className="text-muted-foreground">Create a new restaurant listing</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Restaurant Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Bella Vista"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cuisine">Cuisine Type *</Label>
                      <Input
                        id="cuisine"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        placeholder="e.g., Italian, Chinese, American"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Describe your restaurant, specialties, atmosphere..."
                      rows={4}
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact & Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Contact
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Address *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., 123 Main St, Downtown"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g., (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours">Operating Hours</Label>
                      <Input
                        id="hours"
                        name="hours"
                        value={formData.hours}
                        onChange={handleInputChange}
                        placeholder="e.g., Mon-Sun: 11:00 AM - 10:00 PM"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Restaurant Image
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/restaurant-image.jpg"
                      type="url"
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional: Provide a URL to an image of your restaurant
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Link href="/profile">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={createRestaurantMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {createRestaurantMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        Create Restaurant
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
