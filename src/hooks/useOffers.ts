import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { offerAPI } from '@/lib/api'
import { AxiosError } from 'axios'
import type { OfferAPIParams, OffersResponse, Offer, Restaurant } from '@/types'

// Query keys
export const OFFER_QUERY_KEYS = {
  all: (activeOnly = false) => ['offers', { activeOnly }] as const,
  infinite: (params?: Omit<OfferAPIParams, 'cursor' | 'page'>) => 
    ['offers', 'infinite', params] as const,
  byRestaurant: (restaurantId: number, activeOnly = false) => 
    ['offers', 'restaurant', restaurantId, { activeOnly }] as const,
} as const

// Extended offer type with restaurant info
export interface OfferWithRestaurant extends Omit<Offer, 'restaurantId'> {
  restaurant: Pick<Restaurant, 'id' | 'name' | 'cuisine' | 'location' | 'rating' | 'image'>
}

// Hook to get all offers
export function useOffers(activeOnly = true) {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.all(activeOnly),
    queryFn: async () => {
      const response = await offerAPI.getAll({ activeOnly })
      return response.data.offers as OfferWithRestaurant[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for infinite loading of offers
export function useInfiniteOffers(params?: Omit<OfferAPIParams, 'cursor' | 'page'>) {
  return useInfiniteQuery({
    queryKey: OFFER_QUERY_KEYS.infinite(params),
    queryFn: async ({ pageParam }) => {
      const response = await offerAPI.getAll({
        ...params,
        cursor: pageParam,
        limit: 12, // Default page size
      })
      return response.data as OffersResponse
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination?.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to get offers by restaurant
export function useOffersByRestaurant(restaurantId?: number, activeOnly = true) {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.byRestaurant(restaurantId!, activeOnly),
    queryFn: async () => {
      if (!restaurantId) return []
      const response = await offerAPI.getByRestaurant(restaurantId, activeOnly)
      return response.data.offers as OfferWithRestaurant[]
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to create an offer
export function useCreateOffer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: offerAPI.create,
    onSuccess: (response, variables) => {
      // Invalidate and refetch offer queries
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      
      // If we know the restaurant ID, invalidate its specific query too
      const offer = response.data.offer
      if (offer?.restaurantId) {
        queryClient.invalidateQueries({ 
          queryKey: OFFER_QUERY_KEYS.byRestaurant(offer.restaurantId, true) 
        })
        queryClient.invalidateQueries({ 
          queryKey: OFFER_QUERY_KEYS.byRestaurant(offer.restaurantId, false) 
        })
      }
    },
    onError: (error: AxiosError) => {
      console.error('Create offer error:', error.response?.data)
    },
  })
}

