import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { restaurantAPI } from '@/lib/api'
import { AxiosError } from 'axios'

// Query keys
export const RESTAURANT_QUERY_KEYS = {
  all: ['restaurants'] as const,
  byOwner: (ownerId: number) => ['restaurants', 'owner', ownerId] as const,
} as const

// Types
export interface Restaurant {
  id: number
  name: string
  cuisine: string
  description?: string
  location: string
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
  offers: Offer[]
  createdAt: string
  updatedAt: string
}

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
  createdAt: string
  updatedAt: string
}

// Hook to get all restaurants
export function useRestaurants() {
  return useQuery({
    queryKey: RESTAURANT_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await restaurantAPI.getAll()
      return response.data.restaurants as Restaurant[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to get restaurants by owner
export function useRestaurantsByOwner(ownerId?: number) {
  return useQuery({
    queryKey: RESTAURANT_QUERY_KEYS.byOwner(ownerId!),
    queryFn: async () => {
      if (!ownerId) return []
      const response = await restaurantAPI.getByOwner(ownerId)
      return response.data.restaurants as Restaurant[]
    },
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to create a restaurant
export function useCreateRestaurant() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: restaurantAPI.create,
    onSuccess: (response, variables) => {
      // Invalidate and refetch restaurant queries
      queryClient.invalidateQueries({ queryKey: RESTAURANT_QUERY_KEYS.all })
      
      // If we know the owner ID, invalidate their specific query too
      const restaurant = response.data.restaurant as Restaurant
      if (restaurant?.ownerId) {
        queryClient.invalidateQueries({ 
          queryKey: RESTAURANT_QUERY_KEYS.byOwner(restaurant.ownerId) 
        })
      }
    },
    onError: (error: AxiosError) => {
      console.error('Create restaurant error:', error.response?.data)
    },
  })
}

