import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'
import crypto from 'crypto';
import { sendVerificationEmail } from '@/utils/sendEmail';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name }
  });

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.VerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
    }
  });

  await sendVerificationEmail(user.email, token);

  return NextResponse.json({ message: 'Check your email for verification link' });
}
