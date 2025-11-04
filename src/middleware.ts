import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication
const protectedPaths = ['/profile', '/restaurant/add', '/offer/add']

// Routes that should redirect to home if user is already authenticated
const authPaths = ['/auth/signin', '/auth/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get NextAuth session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Check if current path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // Check if current path is an auth page
  const isAuthPath = authPaths.includes(pathname)

  if (isProtectedPath) {
    if (!token) {
      // Redirect to sign in if accessing protected route without session
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
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
