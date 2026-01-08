'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          router.push('/console')
        }
      }
    )

    // Get email from URL params or session
    const getEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    }
    getEmail()

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleResendEmail = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Verification email sent! Check your inbox.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent a verification link to {email && <span className="font-medium">{email}</span>}. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Email sent successfully
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Check your email and click the verification link. If you don&apos;t see the email, check your spam folder.
                </p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`text-sm text-center ${message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={loading || !email}
            className="group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {loading ? 'Sending...' : 'Resend verification email'}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already verified?{' '}
              <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Wrong email?{' '}
              <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/80">
                Sign up again
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Didn&apos;t receive the email?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes for the email to arrive</li>
              <li>Try resending the verification email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}