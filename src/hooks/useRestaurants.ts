import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { restaurantAPI } from '@/lib/api'
import { AxiosError } from 'axios'
import type { RestaurantAPIParams, RestaurantsResponse, Restaurant } from '@/types'

// Query keys
export const RESTAURANT_QUERY_KEYS = {
  all: ['restaurants'] as const,
  infinite: (params?: Omit<RestaurantAPIParams, 'cursor' | 'page'>) => 
    ['restaurants', 'infinite', params] as const,
  byOwner: (ownerId: number) => ['restaurants', 'owner', ownerId] as const,
  byId: (id: number) => ['restaurants', 'detail', id] as const,
} as const

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

// Hook for infinite loading of restaurants
export function useInfiniteRestaurants(params?: Omit<RestaurantAPIParams, 'cursor' | 'page'>) {
  return useInfiniteQuery({
    queryKey: RESTAURANT_QUERY_KEYS.infinite(params),
    queryFn: async ({ pageParam }) => {
      const response = await restaurantAPI.getAll({
        ...params,
        cursor: pageParam,
        limit: 12, // Default page size
      })
      return response.data as RestaurantsResponse
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination?.nextCursor,
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

// Hook to get a single restaurant by ID
export function useRestaurant(id?: number) {
  return useQuery({
    queryKey: RESTAURANT_QUERY_KEYS.byId(id!),
    queryFn: async () => {
      if (!id) return null
      const response = await restaurantAPI.getById(id)
      return response.data.restaurant as Restaurant
    },
    enabled: !!id,
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

// Hook to update a restaurant
export function useUpdateRestaurant() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: restaurantAPI.update,
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
      console.error('Update restaurant error:', error.response?.data)
    },
  })
}

