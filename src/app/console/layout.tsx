'use client'

import { useState, useEffect } from 'react'
import { ConsoleSidebar } from '@/components/console/console-sidebar'
import { ConsoleHeader } from '@/components/console/console-header'
import { cn } from '@/lib/utils'
import { cache } from '@/lib/cache'

interface User {
  name: string
  email: string
  organization?: string
  avatar?: string
}

interface ConsoleLayoutProps {
  children: React.ReactNode
}

export default function ConsoleLayout({ 
  children
}: ConsoleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Load sidebar state from cache on mount
  useEffect(() => {
    const cachedSidebarState = cache.getSidebarState()
    if (cachedSidebarState !== null) {
      setSidebarCollapsed(cachedSidebarState)
    }
  }, [])

  // Mock user data for demo purposes
  // In production, this would come from authentication context
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: undefined
  }

  const toggleSidebar = () => {
    const newCollapsedState = !sidebarCollapsed
    setSidebarCollapsed(newCollapsedState)
    
    // Save to cache
    cache.setSidebarState(newCollapsedState)
    
    // Track feature usage
    cache.trackFeatureUsage('sidebar-toggle')
  }

  // Track page view
  useEffect(() => {
    cache.trackPageView('console')
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className={cn(
        "hidden md:flex md:flex-col transition-all duration-300",
        sidebarCollapsed ? "md:w-16" : "md:w-64"
      )}>
        <ConsoleSidebar user={mockUser} isCollapsed={sidebarCollapsed} />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64">
            <ConsoleSidebar user={mockUser} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ConsoleHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSidebarToggle={toggleSidebar}
          isSidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  )
}