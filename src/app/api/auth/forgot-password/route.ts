import { NextRequest, NextResponse } from 'next/server';
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';
// import { sendEmail } from '@/utils/sendEmail'; // Using custom sendResetEmail function below

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        message: 'If an account with that email exists, we sent a password reset link.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing reset tokens for this user
    try {
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });
    } catch (error) {
      console.log('Failed to delete existing tokens:', error);
      // Continue with token creation even if deletion fails
    }

    // Create new reset token
    try {
      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.id,
          expiresAt: resetTokenExpiry,
        },
      });
    } catch (error) {
      console.error('Failed to create reset token:', error);
      return NextResponse.json(
        { error: 'Failed to generate reset token' },
        { status: 500 }
      );
    }

    // Send reset email
    const baseUrl = process.env.NEXTAUTH_URL || 'https://mealdeal-dun.vercel.app';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;
    
    try {
      await sendResetEmail(user.email, user.name, resetUrl);
    } catch (emailError) {
      console.log('Failed to send reset email:', emailError);
      // Don't expose email sending errors to the user
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we sent a password reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Email sending function (you can customize this based on your email service)
async function sendResetEmail(email: string, name: string, resetUrl: string) {
  
  const emailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your MealDeal Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽️ MealDeal Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We received a request to reset your MealDeal password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This link will expire in 1 hour for security reasons</li>
              <li>You can only use this link once</li>
              <li>If you need a new link, visit the forgot password page again</li>
            </ul>
          </div>
          <div class="footer">
            <p>This email was sent by MealDeal. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: 'mealdeal@devmunna.xyz',
    to: email,
    subject: 'Reset Your MealDeal Password',
    html: emailContent,
  });
}
