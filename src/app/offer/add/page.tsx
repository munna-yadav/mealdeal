"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { restaurantAPI, offerAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Tag, DollarSign, Calendar, FileText, Building2 } from "lucide-react"
import Link from "next/link"
import type { RestaurantSimple as Restaurant } from "@/types"

export default function AddOfferPage() {
  const { isAuthorized, isLoading, user } = useAuthGuard()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    discount: "",
    terms: "",
    expiresAt: "",
    restaurantId: "",
  })

  // Fetch user's restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!user?.id) return

      try {
        const response = await restaurantAPI.getByOwner(user.id)
        setRestaurants(response.data.restaurants || [])
      } catch (err) {
        console.error('Error fetching restaurants:', err)
      } finally {
        setIsLoadingRestaurants(false)
      }
    }

    fetchRestaurants()
  }, [user?.id])

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

    // Auto-calculate discount percentage
    if (name === 'originalPrice' || name === 'discountedPrice') {
      const originalPrice = name === 'originalPrice' ? parseFloat(value) : parseFloat(formData.originalPrice)
      const discountedPrice = name === 'discountedPrice' ? parseFloat(value) : parseFloat(formData.discountedPrice)
      
      if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
        const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        setFormData(prev => ({
          ...prev,
          [name]: value,
          discount: discountPercentage.toString()
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }))
      }
    }
  }

  const handleRestaurantChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      restaurantId: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate prices
      const originalPrice = parseFloat(formData.originalPrice)
      const discountedPrice = parseFloat(formData.discountedPrice)
      
      if (discountedPrice >= originalPrice) {
        throw new Error('Discounted price must be less than original price')
      }

      await offerAPI.create(formData)
      setSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } catch (err: any) {
      console.error('Error creating offer:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create offer'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Offer Created!</h2>
            <p className="text-muted-foreground mb-4">
              Your offer has been successfully created. Redirecting to your profile...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show message if no restaurants
  if (!isLoadingRestaurants && restaurants.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Add New Offer</h1>
              <p className="text-muted-foreground">Create a new deal for your restaurant</p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Restaurants Found</h2>
                <p className="text-muted-foreground mb-4">
                  You need to create a restaurant first before adding offers.
                </p>
                <Link href="/restaurant/add">
                  <Button>
                    <Building2 className="w-4 h-4 mr-2" />
                    Add Restaurant
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
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
            <h1 className="text-3xl font-bold">Add New Offer</h1>
            <p className="text-muted-foreground">Create a new deal for your restaurant</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Offer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Restaurant Selection */}
                <div className="space-y-2">
                  <Label htmlFor="restaurant">Restaurant *</Label>
                  {isLoadingRestaurants ? (
                    <div className="h-10 border border-gray-300 rounded-md flex items-center px-3">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin mr-2" />
                      Loading restaurants...
                    </div>
                  ) : (
                    <Select value={formData.restaurantId} onValueChange={handleRestaurantChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                            {restaurant.name} - {restaurant.cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Offer Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., 3-Course Italian Dinner for Two"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Describe what's included in this offer..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price *</Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Discounted Price *</Label>
                      <Input
                        id="discountedPrice"
                        name="discountedPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount %</Label>
                      <Input
                        id="discount"
                        name="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={handleInputChange}
                        placeholder="Auto-calculated"
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Expiry and Terms */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Validity & Terms
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Expiry Date *</Label>
                    <Input
                      id="expiresAt"
                      name="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <textarea
                      id="terms"
                      name="terms"
                      value={formData.terms}
                      onChange={handleInputChange}
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Valid for dinner only. Cannot be combined with other offers."
                      rows={3}
                    />
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
                    disabled={isSubmitting || isLoadingRestaurants}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Tag className="w-4 h-4" />
                        Create Offer
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
