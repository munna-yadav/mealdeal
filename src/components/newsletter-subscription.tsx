'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface NewsletterSubscriptionProps {
  className?: string
  defaultEmail?: string
  compact?: boolean
}

export function NewsletterSubscription({ 
  className, 
  defaultEmail,
  compact = false
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState(defaultEmail || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed to newsletter!')
        if (!defaultEmail) {
          setEmail('')
        }
      } else {
        if (response.status === 409) {
          toast.error(data.error || 'Email is already subscribed')
        } else {
          toast.error(data.error || 'Failed to subscribe to newsletter')
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (compact) {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Get notified about exclusive deals and offers. Unsubscribe anytime.
        </p>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Stay Updated with Great Deals!</CardTitle>
        <CardDescription>
          Subscribe to our newsletter and never miss out on exclusive restaurant deals and offers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            By subscribing, you agree to receive email communications from MealDeal. 
            You can unsubscribe at any time using the link in our emails.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

