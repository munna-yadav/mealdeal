"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, Clock, Users } from "lucide-react"
import { reservationsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { ReservationModalProps } from "@/types"

export function ReservationModal({ isOpen, onClose, restaurantId, restaurantName }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: '',
    specialRequests: '',
    phoneNumber: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  // Generate time slots
  const timeSlots = []
  for (let hour = 11; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      timeSlots.push({ value: timeString, label: displayTime })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time || !formData.partySize) {
      toast({
        title: "Missing information",
        description: "Please fill in date, time, and party size",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await reservationsAPI.create({
        restaurantId,
        date: formData.date,
        time: formData.time,
        partySize: parseInt(formData.partySize),
        specialRequests: formData.specialRequests || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        email: formData.email || undefined
      })

      toast({
        title: "Reservation submitted! 🎉",
        description: `Your reservation request for ${restaurantName} has been sent.`
      })

      // Reset form and close modal
      setFormData({
        date: '',
        time: '',
        partySize: '',
        specialRequests: '',
        phoneNumber: '',
        email: ''
      })
      onClose()
    } catch (error: unknown) {
      toast({
        title: "Failed to make reservation",
        description: (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Make a Reservation
          </DialogTitle>
          <DialogDescription>
            Reserve a table at {restaurantName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="partySize">Party Size *</Label>
            <Select value={formData.partySize} onValueChange={(value) => handleInputChange('partySize', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Number of guests" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {size} {size === 1 ? 'person' : 'people'}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requests">Special Requests</Label>
            <Textarea
              id="requests"
              placeholder="Any dietary restrictions, seating preferences, or special occasions..."
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Make Reservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

