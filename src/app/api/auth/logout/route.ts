export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

export async function POST() {
  const isProduction = process.env.NODE_ENV === 'production'
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear auth cookies
  res.cookies.set('access_token', '', { 
    httpOnly: true, 
    secure: isProduction, 
    sameSite: 'lax', 
    path: '/', 
    expires: new Date(0) 
  });
  
  res.cookies.set('refresh_token', '', { 
    httpOnly: true, 
    secure: isProduction, 
    sameSite: 'lax', 
    path: '/', 
    expires: new Date(0) 
  });

  return res;
}
