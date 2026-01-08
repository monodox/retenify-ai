'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Cookie } from 'lucide-react'
import Link from 'next/link'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Small delay to ensure proper hydration
    const timer = setTimeout(() => {
      try {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
          setIsVisible(true)
        }
      } catch (error) {
        console.warn('Failed to check cookie consent:', error)
        setIsVisible(true) // Show banner if localStorage fails
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted) return null

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie-consent', 'accepted')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      setIsVisible(false)
      
      // Enable analytics and other tracking
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cookieConsentAccepted'))
      }
    } catch (error) {
      console.warn('Failed to save cookie consent:', error)
      setIsVisible(false)
    }
  }

  const handleDecline = () => {
    try {
      localStorage.setItem('cookie-consent', 'declined')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      setIsVisible(false)
      
      // Disable analytics and tracking
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cookieConsentDeclined'))
      }
    } catch (error) {
      console.warn('Failed to save cookie consent:', error)
      setIsVisible(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-2">We use cookies</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                We use cookies to enhance your experience and analyze site usage. 
                By continuing, you agree to our{' '}
                <Link href="/legal/terms" className="underline hover:no-underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="underline hover:no-underline">
                  Privacy Policy
                </Link>.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAccept}
                  size="sm"
                  className="flex-1"
                >
                  Accept
                </Button>
                <Button 
                  onClick={handleDecline}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Decline
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}