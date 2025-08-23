import { NextRequest, NextResponse } from 'next/server'


import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const protectedPaths = ['/profile', '/restaurant/add', '/offer/add']

// Routes that should redirect to home if user is already authenticated
const authPaths = ['/auth/signin', '/auth/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from the request
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if current path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // Check if current path is an auth page
  const isAuthPath = authPaths.includes(pathname)

  if (isProtectedPath) {
    if (!token) {
      // Redirect to sign in if accessing protected route without token
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // TODO: Add token verification here if needed
    // For now, we trust the token exists and let the pages handle verification
  }

  if (isAuthPath && token) {
    // Redirect to home if already authenticated and trying to access auth pages
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Run middleware on paths that need authentication or auth redirects
     */
    '/profile/:path*',
    '/restaurant/add',
    '/offer/add',
    '/auth/signin',
    '/auth/signup',
  ],
}
