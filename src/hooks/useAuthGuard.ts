import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to protect routes that require authentication
 * Redirects to sign in page if user is not authenticated
 */
export function useAuthGuard(redirectTo: string = '/auth/signin') {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated' && !!session

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  // Map NextAuth session to user format
  const user = session?.user ? {
    id: parseInt(session.user.id || '0'),
    name: session.user.name || '',
    email: session.user.email || '',
    isVerified: session.user.isVerified || false,
    createdAt: new Date().toISOString(), // NextAuth doesn't provide this, so we use current date
  } : null

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized: isAuthenticated && !!session
  }
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useGuestGuard(redirectTo: string = '/') {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated' && !!session

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
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated' && !!session

  // Map NextAuth session to user format
  const user = session?.user ? {
    id: parseInt(session.user.id || '0'),
    name: session.user.name || '',
    email: session.user.email || '',
    isVerified: session.user.isVerified || false,
    createdAt: new Date().toISOString(),
  } : null

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













