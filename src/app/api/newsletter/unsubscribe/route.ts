import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find and deactivate subscription
    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Email not found in newsletter subscriptions' },
        { status: 404 }
      )
    }

    if (!subscription.isActive) {
      return NextResponse.json(
        { message: 'Email is already unsubscribed' }
      )
    }

    await prisma.newsletterSubscription.update({
      where: { email },
      data: { isActive: false }
    })

    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter'
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    )
  }
}

// Handle unsubscribe via GET request (for email links)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return new NextResponse(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Invalid Request</h2>
            <p>Email parameter is required for unsubscription.</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 400
      })
    }

    // Find and deactivate subscription
    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email }
    })

    if (!subscription) {
      return new NextResponse(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Email Not Found</h2>
            <p>This email address was not found in our newsletter subscriptions.</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 404
      })
    }

    if (!subscription.isActive) {
      return new NextResponse(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Already Unsubscribed</h2>
            <p>This email address is already unsubscribed from our newsletter.</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    await prisma.newsletterSubscription.update({
      where: { email },
      data: { isActive: false }
    })

    return new NextResponse(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Successfully Unsubscribed</h2>
          <p>You have been successfully unsubscribed from the MealDeal newsletter.</p>
          <p>We're sorry to see you go! You can always subscribe again if you change your mind.</p>
          <a href="/" style="color: #007bff; text-decoration: none;">← Back to MealDeal</a>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return new NextResponse(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Error</h2>
          <p>Failed to unsubscribe from newsletter. Please try again later.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    })
  }
}

