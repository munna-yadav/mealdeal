import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || 'https://mealdeal-dun.vercel.app';
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;
  
  await resend.emails.send({
    from: 'mealdeal@devmunna.xyz',
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
  });
}
