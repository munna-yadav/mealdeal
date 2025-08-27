import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { verifyToken } from '@/lib/auth'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication using cookies
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(accessToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const { subject, content, htmlContent } = await request.json()

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    // Create newsletter record
    const newsletter = await prisma.newsletter.create({
      data: {
        subject,
        content,
        htmlContent,
        createdBy: payload.userId
      }
    })

    // Get all active subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: { isActive: true },
      select: { email: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.APP_URL || 'http://localhost:3000'

    // Send emails in batches to avoid rate limits
    const BATCH_SIZE = 50
    let sentCount = 0
    
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE)
      
      const emailPromises = batch.map(async (subscriber) => {
        const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
        
        // Create email HTML with unsubscribe link
        const emailHtml = htmlContent || `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="margin: 20px 0;">
              ${content.split('\n').map((paragraph: string) => `<p style="margin: 10px 0;">${paragraph}</p>`).join('')}
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <div style="font-size: 12px; color: #666; text-align: center;">
              <p>You're receiving this because you subscribed to MealDeal newsletter.</p>
              <p>
                <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">
                  Unsubscribe from these emails
                </a>
              </p>
              <p>© ${new Date().getFullYear()} MealDeal. All rights reserved.</p>
            </div>
          </div>
        `

        try {
          await resend.emails.send({
            from: 'MealDeal <newsletter@devmunna.xyz>',
            to: subscriber.email,
            subject,
            html: emailHtml,
            text: content + `\n\nUnsubscribe: ${unsubscribeUrl}`,
          })
          
          return { success: true, email: subscriber.email }
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error)
          return { success: false, email: subscriber.email, error }
        }
      })

      const results = await Promise.allSettled(emailPromises)
      sentCount += results.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Update newsletter with sent info
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        sentAt: new Date(),
        sentCount
      }
    })

    return NextResponse.json({
      message: `Newsletter sent successfully to ${sentCount} out of ${subscribers.length} subscribers`,
      newsletterId: newsletter.id,
      sentCount,
      totalSubscribers: subscribers.length
    })

  } catch (error) {
    console.error('Newsletter send error:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}

// Get newsletter statistics
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication using cookies
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(accessToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const [totalSubscribers, activeSubscribers, totalNewsletters, recentNewsletters] = await Promise.all([
      prisma.newsletterSubscription.count(),
      prisma.newsletterSubscription.count({ where: { isActive: true } }),
      prisma.newsletter.count(),
      prisma.newsletter.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          subject: true,
          sentAt: true,
          sentCount: true,
          createdAt: true
        }
      })
    ])

    return NextResponse.json({
      totalSubscribers,
      activeSubscribers,
      totalNewsletters,
      recentNewsletters
    })

  } catch (error) {
    console.error('Newsletter stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter statistics' },
      { status: 500 }
    )
  }
}
