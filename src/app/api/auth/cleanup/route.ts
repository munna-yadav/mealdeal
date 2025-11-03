import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint should be called by a CRON job to clean up expired tokens
export async function POST(_req: NextRequest) {
  try {
    // Delete expired verification tokens
    const deletedVerificationTokens = await prisma.verificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Delete expired password reset tokens
    const deletedResetTokens = await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      deletedVerificationTokens: deletedVerificationTokens.count,
      deletedResetTokens: deletedResetTokens.count,
    });
  } catch (error) {
    console.error('Token cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to clean up expired tokens' },
      { status: 500 }
    );
  }
}
