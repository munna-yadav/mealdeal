import { NextRequest, NextResponse } from 'next/server'


import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const protectedPaths = ['/profile']

// Routes that should redirect to home if user is already authenticated
const authPaths = ['/auth/signin', '/auth/signup']

export function middleware(request: NextRequest) {
  // Temporarily disable all middleware logic to debug auth issues
  console.log('Middleware disabled for debugging. Path:', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Temporarily disable middleware to debug auth issues
     * Only run on specific paths that we know need protection
     */
    '/profile/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
}
