import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // 1️⃣ Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 2️⃣ Check if verified
  if (!user.isVerified) {
    return NextResponse.json({ error: 'Please verify your email before logging in' }, { status: 403 });
  }

  // 3️⃣ Validate password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 4️⃣ Create tokens
  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

  // 5️⃣ Set cookies
  const isProduction = process.env.NODE_ENV === 'production'
  const res = NextResponse.json({ success: true });
  res.cookies.set('access_token', accessToken, { 
    httpOnly: true, 
    secure: isProduction, 
    sameSite: 'lax', 
    path: '/',
    maxAge: 60 * 15 // 15 minutes
  });
  res.cookies.set('refresh_token', refreshToken, { 
    httpOnly: true, 
    secure: isProduction, 
    sameSite: 'lax', 
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return res;
}
