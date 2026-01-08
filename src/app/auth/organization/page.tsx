'use client'

import { useState } from 'react'
import { Building2, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create')
  const [formData, setFormData] = useState({
    orgName: '',
    orgDescription: '',
    inviteCode: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage('Please log in first')
      setLoading(false)
      return
    }

    // Create organization in database
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: formData.orgName,
        description: formData.orgDescription,
        owner_id: user.id
      })
      .select()
      .single()

    if (orgError) {
      setMessage(orgError.message)
    } else {
      // Update user profile with organization
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ organization_id: org.id })
        .eq('id', user.id)

      if (profileError) {
        setMessage(profileError.message)
      } else {
        router.push('/console')
      }
    }
    setLoading(false)
  }

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage('Please log in first')
      setLoading(false)
      return
    }

    // Find organization by invite code or ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .or(`id.eq.${formData.inviteCode},invite_code.eq.${formData.inviteCode}`)
      .single()

    if (orgError) {
      setMessage('Organization not found')
    } else {
      // Update user profile with organization
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ organization_id: org.id })
        .eq('id', user.id)

      if (profileError) {
        setMessage(profileError.message)
      } else {
        router.push('/console')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join or create an organization
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose how you&apos;d like to get started with your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Organization */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Create Organization
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Start a new organization and invite your team members to join.
              </p>
              
              <form className="space-y-4" onSubmit={handleCreateOrg}>
                <div>
                  <label htmlFor="org-name" className="sr-only">
                    Organization name
                  </label>
                  <input
                    id="org-name"
                    name="orgName"
                    type="text"
                    required
                    value={formData.orgName}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Organization name"
                  />
                </div>
                <div>
                  <label htmlFor="org-description" className="sr-only">
                    Description (optional)
                  </label>
                  <textarea
                    id="org-description"
                    name="orgDescription"
                    rows={3}
                    value={formData.orgDescription}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Description (optional)"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Organization'}
                </button>
              </form>
            </div>
          </div>

          {/* Join Organization */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Join Organization
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Enter an invitation code or organization ID to join an existing team.
              </p>
              
              <form className="space-y-4" onSubmit={handleJoinOrg}>
                <div>
                  <label htmlFor="invite-code" className="sr-only">
                    Invitation code or Organization ID
                  </label>
                  <input
                    id="invite-code"
                    name="inviteCode"
                    type="text"
                    required
                    value={formData.inviteCode}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Invitation code or Organization ID"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join Organization'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {message && (
          <div className="text-sm text-center text-red-600">
            {message}
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Want to set this up later?{' '}
            <Link href="/console" className="font-medium text-primary hover:text-primary/80">
              Skip for now
            </Link>
          </p>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Need help?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Organizations help you collaborate with your team</li>
              <li>You can create multiple organizations or join several</li>
              <li>Organization admins can manage members and permissions</li>
              <li>Contact support if you need assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}