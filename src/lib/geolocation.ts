/**
 * Geolocation utilities for location-based search and distance calculations
 */

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface LocationData {
  coordinates: Coordinates
  address?: string
  city?: string
  error?: string
}

export interface GeolocationError {
  code: number
  message: string
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude)
  const dLon = toRadians(coord2.longitude - coord1.longitude)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Get user's current location using the Geolocation API
 * @param options Geolocation options
 * @returns Promise with location data or error
 */
export function getCurrentLocation(options?: PositionOptions): Promise<LocationData> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        coordinates: { latitude: 0, longitude: 0 },
        error: 'Geolocation is not supported by this browser'
      })
      return
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred'
            break
        }

        resolve({
          coordinates: { latitude: 0, longitude: 0 },
          error: errorMessage
        })
      },
      defaultOptions
    )
  })
}

/**
 * Check if geolocation permission is granted
 */
export async function checkLocationPermission(): Promise<PermissionState | null> {
  if (!navigator.permissions) {
    return null
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' })
    return permission.state
  } catch (error) {
    return null
  }
}

/**
 * Reverse geocoding to get address from coordinates
 * This uses a simple approximation for demo purposes
 * In production, you'd use a service like Google Maps API or OpenStreetMap
 */
export async function reverseGeocode(coordinates: Coordinates): Promise<string> {
  try {
    // For demo purposes, return a mock address
    // In production, integrate with a geocoding service
    const { latitude, longitude } = coordinates
    return `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
  } catch (error) {
    return 'Unknown location'
  }
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance}km`
}

/**
 * Sort locations by distance from a reference point
 */
export function sortByDistance<T extends { latitude?: number; longitude?: number }>(
  locations: T[],
  referencePoint: Coordinates
): (T & { distance?: number })[] {
  return locations
    .map(location => {
      if (location.latitude && location.longitude) {
        const distance = calculateDistance(referencePoint, {
          latitude: location.latitude,
          longitude: location.longitude
        })
        return { ...location, distance }
      }
      return { ...location, distance: undefined }
    })
    .sort((a, b) => {
      if (a.distance === undefined && b.distance === undefined) return 0
      if (a.distance === undefined) return 1
      if (b.distance === undefined) return -1
      return a.distance - b.distance
    })
}

/**
 * Filter locations within a certain radius
 */
export function filterByRadius<T extends { latitude?: number; longitude?: number }>(
  locations: T[],
  center: Coordinates,
  radiusKm: number
): T[] {
  return locations.filter(location => {
    if (!location.latitude || !location.longitude) return false
    
    const distance = calculateDistance(center, {
      latitude: location.latitude,
      longitude: location.longitude
    })
    
    return distance <= radiusKm
  })
}

/**
 * Get user's location and store it in localStorage for future use
 */
export async function getUserLocationWithCache(): Promise<LocationData> {
  // Check if we have cached location (less than 1 hour old)
  const cachedLocation = localStorage.getItem('user_location')
  const cachedTimestamp = localStorage.getItem('user_location_timestamp')
  
  if (cachedLocation && cachedTimestamp) {
    const timestamp = parseInt(cachedTimestamp)
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    
    if (now - timestamp < oneHour) {
      try {
        return JSON.parse(cachedLocation)
      } catch (error) {
        // Invalid cached data, proceed to get fresh location
      }
    }
  }

  // Get fresh location
  const location = await getCurrentLocation()
  
  if (!location.error) {
    // Cache the location
    localStorage.setItem('user_location', JSON.stringify(location))
    localStorage.setItem('user_location_timestamp', Date.now().toString())
  }
  
  return location
}

/**
 * Clear cached user location
 */
export function clearLocationCache(): void {
  localStorage.removeItem('user_location')
  localStorage.removeItem('user_location_timestamp')
}
