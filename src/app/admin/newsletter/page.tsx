'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

interface Newsletter {
  id: number
  subject: string
  sentAt: string | null
  sentCount: number
  createdAt: string
}

interface NewsletterStats {
  totalSubscribers: number
  activeSubscribers: number
  totalNewsletters: number
  recentNewsletters: Newsletter[]
}

export default function NewsletterAdminPage() {
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState<NewsletterStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth/signin'
    }
  }, [user, isLoading])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/newsletter/send', {
        credentials: 'include' // Include cookies
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject || !content) {
      toast.error('Please fill in both subject and content')
      return
    }

    if (!stats?.activeSubscribers) {
      toast.error('No active subscribers found')
      return
    }

    const confirmed = confirm(
      `Are you sure you want to send this newsletter to ${stats.activeSubscribers} subscribers?`
    )
    
    if (!confirmed) return

    setIsSending(true)

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({
          subject,
          content,
          htmlContent: htmlContent || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Newsletter sent successfully!')
        setSubject('')
        setContent('')
        setHtmlContent('')
        fetchStats() // Refresh stats
      } else {
        toast.error(data.error || 'Failed to send newsletter')
      }
    } catch (error) {
      console.error('Newsletter send error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading || isLoadingStats) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Newsletter Management</h1>
        <p className="text-muted-foreground">
          Send newsletters and manage your email subscribers
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeSubscribers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Newsletters Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNewsletters}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.totalSubscribers - stats.activeSubscribers}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Newsletter Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Newsletter</CardTitle>
            <CardDescription>
              Create and send a newsletter to all active subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Newsletter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={isSending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (Plain Text)</Label>
                <Textarea
                  id="content"
                  placeholder="Newsletter content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={isSending}
                  rows={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="htmlContent">HTML Content (Optional)</Label>
                <Textarea
                  id="htmlContent"
                  placeholder="HTML version of your newsletter (optional)..."
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  disabled={isSending}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  If provided, this will be used as the HTML version. Otherwise, plain text will be converted to HTML.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSending || !stats?.activeSubscribers}
              >
                {isSending ? 'Sending...' : `Send Newsletter to ${stats?.activeSubscribers || 0} Subscribers`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Newsletters */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Newsletters</CardTitle>
            <CardDescription>
              Your recently sent newsletters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentNewsletters.length ? (
              <div className="space-y-4">
                {stats.recentNewsletters.map((newsletter) => (
                  <div key={newsletter.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{newsletter.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(newsletter.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={newsletter.sentAt ? "default" : "secondary"}
                        >
                          {newsletter.sentAt ? "Sent" : "Draft"}
                        </Badge>
                        {newsletter.sentAt && (
                          <span className="text-xs text-muted-foreground">
                            {newsletter.sentCount} recipients
                          </span>
                        )}
                      </div>
                    </div>
                    {newsletter.sentAt && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Sent: {new Date(newsletter.sentAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No newsletters sent yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
