import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

      const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token expired or invalid' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { isVerified: true }
  });

      await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ message: 'Email verified successfully' });
}
