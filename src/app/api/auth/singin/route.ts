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
  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  // 5️⃣ Set cookies
  const res = NextResponse.json({ success: true });
  res.cookies.set('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
  res.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });

  return res;
}
