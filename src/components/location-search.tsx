"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, AlertCircle, Check, X } from "lucide-react"
import { 
  getCurrentLocation, 
  checkLocationPermission, 
  getUserLocationWithCache,
  clearLocationCache,
  formatDistance,
  type LocationData 
} from "@/lib/geolocation"

interface LocationSearchProps {
  onLocationChange: (location: LocationData | null, radius?: number) => void
  currentLocation?: LocationData | null
  radius?: number
  className?: string
}

export function LocationSearch({ 
  onLocationChange, 
  currentLocation, 
  radius = 10,
  className = ""
}: LocationSearchProps) {
  const [location, setLocation] = useState<LocationData | null>(currentLocation || null)
  const [searchRadius, setSearchRadius] = useState(radius)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null)
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [manualLocation, setManualLocation] = useState("")

  // Check location permission on mount
  useEffect(() => {
    checkLocationPermission().then(setPermissionState)
  }, [])

  // Try to get cached location on mount
  useEffect(() => {
    if (!location && permissionState === 'granted') {
      getUserLocationWithCache().then(locationData => {
        if (!locationData.error) {
          setLocation(locationData)
          onLocationChange(locationData, searchRadius)
        }
      })
    }
  }, [permissionState, onLocationChange, searchRadius, location])

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true)
    
    try {
      const locationData = await getCurrentLocation()
      
      if (locationData.error) {
        // Show error but don't clear existing location
        console.error('Location error:', locationData.error)
      } else {
        setLocation(locationData)
        onLocationChange(locationData, searchRadius)
        // Cache the location
        localStorage.setItem('user_location', JSON.stringify(locationData))
        localStorage.setItem('user_location_timestamp', Date.now().toString())
      }
    } catch (error) {
      console.error('Error getting location:', error)
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleClearLocation = () => {
    setLocation(null)
    clearLocationCache()
    onLocationChange(null)
  }

  const handleRadiusChange = (newRadius: string) => {
    const radiusValue = parseInt(newRadius)
    setSearchRadius(radiusValue)
    if (location) {
      onLocationChange(location, radiusValue)
    }
  }

  const handleManualLocationSubmit = () => {
    if (manualLocation.trim()) {
      // For demo purposes, create a mock location
      // In production, you'd geocode the address
      const mockLocation: LocationData = {
        coordinates: { latitude: 0, longitude: 0 },
        address: manualLocation.trim()
      }
      setLocation(mockLocation)
      onLocationChange(mockLocation, searchRadius)
      setShowLocationInput(false)
      setManualLocation("")
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Status */}
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Location-based search</span>
        {location && !location.error && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )}
      </div>

      {/* Current Location Display */}
      {location && !location.error ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-800">
                {location.address || 'Current location detected'}
              </div>
              <div className="text-xs text-green-600">
                Searching within {searchRadius}km radius
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearLocation}
            className="text-green-700 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Get Location Button */}
          <Button
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="w-full"
          >
            <Navigation className={`h-4 w-4 mr-2 ${isGettingLocation ? 'animate-spin' : ''}`} />
            {isGettingLocation ? 'Getting location...' : 'Use my current location'}
          </Button>

          {/* Manual Location Input */}
          <div className="space-y-2">
            {!showLocationInput ? (
              <Button
                variant="ghost"
                onClick={() => setShowLocationInput(true)}
                className="w-full text-sm"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Enter location manually
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city or address..."
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSubmit()}
                />
                <Button onClick={handleManualLocationSubmit} size="sm">
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowLocationInput(false)
                    setManualLocation("")
                  }}
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {location?.error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {location.error}. You can still search without location or enter it manually.
          </AlertDescription>
        </Alert>
      )}

      {/* Search Radius Selector */}
      {location && !location.error && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Search radius:</span>
          <Select value={searchRadius.toString()} onValueChange={handleRadiusChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1km</SelectItem>
              <SelectItem value="2">2km</SelectItem>
              <SelectItem value="5">5km</SelectItem>
              <SelectItem value="10">10km</SelectItem>
              <SelectItem value="20">20km</SelectItem>
              <SelectItem value="50">50km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Permission State Info */}
      {permissionState === 'denied' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Location access is blocked. Please enable it in your browser settings for location-based search.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
