import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to protect routes that require authentication
 * Redirects to sign in page if user is not authenticated
 */
export function useAuthGuard(redirectTo: string = '/auth/signin') {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized: isAuthenticated && !!user
  }
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useGuestGuard(redirectTo: string = '/') {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  return {
    isLoading,
    isAuthenticated,
    canAccess: !isLoading && !isAuthenticated
  }
}

/**
 * Hook for conditionally rendering content based on auth state
 */
export function useAuthState() {
  const { user, isLoading, isAuthenticated } = useAuth()

  return {
    user,
    isLoading,
    isAuthenticated,
    isGuest: !isLoading && !isAuthenticated,
    // Helper functions for conditional rendering
    when: {
      authenticated: (component: React.ReactNode) => isAuthenticated ? component : null,
      guest: (component: React.ReactNode) => !isAuthenticated && !isLoading ? component : null,
      loading: (component: React.ReactNode) => isLoading ? component : null,
    }
  }
}








