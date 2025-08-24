import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authAPI, type User } from '@/lib/api'
import { AxiosError } from 'axios'

// Query keys
export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'] as const,
} as const

// Custom hook for getting current user
export function useUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: async () => {
      try {
        const response = await authAPI.me()
        return response.data.user as User
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          // Not authenticated - return null instead of throwing
          return null
        }
        throw error
      }
    },
    retry: (failureCount, error) => {
      // Don't retry 401 errors
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

// Custom hook for signing in
export function useSignin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authAPI.signin,
    onSuccess: (response) => {
      // Fetch user data after successful signin
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me })
    },
    onError: (error: AxiosError) => {
      console.error('Signin error:', error.response?.data)
    },
  })
}

// Custom hook for signing up
export function useSignup() {
  return useMutation({
    mutationFn: authAPI.signup,
    onError: (error: AxiosError) => {
      console.error('Signup error:', error.response?.data)
    },
  })
}

// Custom hook for logging out
export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Clear all cached data after logout
      queryClient.clear()
      // Or specifically clear user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, null)
    },
    onError: (error: AxiosError) => {
      console.error('Logout error:', error.response?.data)
      // Even if logout fails on server, clear local data
      queryClient.clear()
    },
  })
}

// Custom hook for email verification
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authAPI.verify(token),
    onError: (error: AxiosError) => {
      console.error('Email verification error:', error.response?.data)
    },
  })
}

// Main auth hook that combines everything
export function useAuth() {
  const { data: user, isLoading, error, refetch } = useUser()
  const signinMutation = useSignin()
  const logoutMutation = useLogout()
  
  const signin = async (credentials: { email: string; password: string }) => {
    const result = await signinMutation.mutateAsync(credentials)
    // Refetch user data after signin
    await refetch()
    return result
  }
  
  const logout = async () => {
    await logoutMutation.mutateAsync()
  }
  
  return {
    // User data
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    
    // Auth actions
    signin,
    logout,
    refetch,
    
    // Mutation states
    isSigningIn: signinMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    signinError: signinMutation.error,
    logoutError: logoutMutation.error,
  }
}




