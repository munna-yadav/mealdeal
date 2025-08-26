/**
 * Centralized type definitions for MealDeal application
 * This file contains all types used across the application for better organization and maintainability
 */

// =============================================================================
// Auth & User Types
// =============================================================================

export interface User {
  id: number
  name: string
  email: string
  isVerified: boolean
  createdAt: string
}

export interface JWTPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}

// =============================================================================
// Geolocation Types
// =============================================================================

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

// =============================================================================
// Restaurant Types
// =============================================================================

export interface Restaurant {
  id: number
  name: string
  cuisine: string
  description?: string
  location: string
  latitude?: number
  longitude?: number
  phone?: string
  hours?: string
  rating: number
  reviewCount: number
  image?: string
  ownerId: number
  owner: {
    id: number
    name: string
    email: string
  }
  offers: Array<{
    id: number
    title: string
    isActive: boolean
    expiresAt: string
  }>
  distance?: number
  createdAt: string
  updatedAt: string
}

export interface RestaurantCreateData {
  name: string
  cuisine: string
  description?: string
  location: string
  latitude?: number
  longitude?: number
  phone?: string
  hours?: string
  image?: string
}

export interface RestaurantUpdateData extends RestaurantCreateData {
  id: number
}

export interface RestaurantSimple {
  id: number
  name: string
  cuisine: string
  location: string
}

// =============================================================================
// Offer Types
// =============================================================================

export interface Offer {
  id: number
  title: string
  description?: string
  originalPrice: number
  discountedPrice: number
  discount: number
  terms?: string
  expiresAt: string
  isActive: boolean
  restaurantId: number
  restaurant: {
    id: number
    name: string
    cuisine: string
    location: string
    latitude?: number
    longitude?: number
    rating: number
    image?: string
  }
  distance?: number | null
  createdAt: string
  updatedAt: string
}

export interface OfferCreateData {
  title: string
  description?: string
  originalPrice: string
  discountedPrice: string
  discount: string
  terms?: string
  expiresAt: string
  restaurantId: string
}

// =============================================================================
// Deal Types
// =============================================================================

export interface ClaimedDeal {
  id: number
  userId: number
  offerId: number
  redemptionCode: string
  claimedAt: string
  redeemedAt?: string
  status: ClaimStatus
  notes?: string
  offer: Offer
}

export interface DealCardProps {
  id: string
  title: string
  restaurant: {
    name: string
    rating: number
    location: string
  }
  discount: number
  originalPrice: number
  discountedPrice: number
  image: string
  expiresIn: string
  cuisine: string
  isFavorite?: boolean
}

// =============================================================================
// Reservation Types
// =============================================================================

export interface Reservation {
  id: number
  userId: number
  restaurantId: number
  date: string
  time: string
  partySize: number
  specialRequests?: string
  status: ReservationStatus
  phoneNumber?: string
  email?: string
  createdAt: string
  updatedAt: string
  user?: User
  restaurant?: Restaurant
}

export interface ReservationCreateData {
  restaurantId: number
  date: string
  time: string
  partySize: number
  specialRequests?: string
  phoneNumber?: string
  email?: string
}

// =============================================================================
// Search & Filter Types
// =============================================================================

export interface SearchFilters {
  search: string
  cuisine: string
  location: string
  discount: string
  sortBy: string
  userLocation?: LocationData | null
  radius?: number
}

export interface LocationFilters {
  userLocation?: LocationData | null
  radius?: number
}

export interface AvailableFilters {
  cuisines?: string[]
  locations?: string[]
}

export interface AdvancedSearchProps {
  onSearchChange: (filters: SearchFilters & LocationFilters) => void
  availableFilters?: AvailableFilters
  searchType?: 'restaurants' | 'deals'
  placeholder?: string
  initialFilters?: Partial<SearchFilters>
  showLocationSearch?: boolean
  className?: string
}

// =============================================================================
// API Types
// =============================================================================

export interface RestaurantAPIParams {
  search?: string
  cuisine?: string
  location?: string
  lat?: number
  lng?: number
  radius?: number
  sortBy?: string
  ownerId?: number
}

export interface OfferAPIParams {
  activeOnly?: boolean
  search?: string
  cuisine?: string
  location?: string
  discount?: string
  lat?: number
  lng?: number
  radius?: number
  sortBy?: string
  restaurantId?: number
}

export interface ReservationAPIParams {
  restaurantId?: number
  status?: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

// =============================================================================
// Enum Types (matching Prisma schema)
// =============================================================================

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum ClaimStatus {
  CLAIMED = 'CLAIMED',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED'
}

// =============================================================================
// API Response Types
// =============================================================================

export interface APIResponse<T = unknown> {
  data: T
  message?: string
}

export interface RestaurantsResponse {
  restaurants: Restaurant[]
  filters: AvailableFilters
  count: number
}

export interface OffersResponse {
  offers: Offer[]
  filters: AvailableFilters
  count: number
}

export interface ClaimedDealsResponse {
  claimedDeals: ClaimedDeal[]
}

export interface ClaimDealResponse {
  message: string
  claimedDeal: {
    id: number
    redemptionCode: string
    claimedAt: string
    status: ClaimStatus
    offer: {
      id: number
      title: string
      discount: number
      originalPrice: number
      discountedPrice: number
      expiresAt: string
      restaurant: {
        id: number
        name: string
        location: string
        phone?: string
      }
    }
  }
}

// =============================================================================
// Utility Types
// =============================================================================

export type SortOption = {
  value: string
  label: string
}

export type WithDistance<T> = T & { distance?: number }

// =============================================================================
// Component Props Types
// =============================================================================

export interface LocationSearchProps {
  onLocationChange: (userLocation: LocationData | null, radius?: number) => void
  currentLocation?: LocationData | null
  radius?: number
  className?: string
}

export interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantId: number
  restaurantName: string
}

export interface RestaurantCardProps {
  id: string
  name: string
  cuisine: string
  rating: number
  reviewCount: number
  location: string
  deliveryTime: string
  image: string
  dealCount: number
  minDiscount: number
}

// =============================================================================
// Error Types
// =============================================================================

export interface APIError {
  error: string
  status?: number
}

export interface ValidationError {
  field: string
  message: string
}
