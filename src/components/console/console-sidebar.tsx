'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Bot,
  Brain,
  Library,
  Settings,
  HelpCircle,
  LogOut,
  ChevronUp,
  MessageSquare,
  Loader2
} from 'lucide-react'

interface User {
  name: string
  email: string
  avatar?: string
}

interface RecentChat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
}

interface ConsoleSidebarProps {
  className?: string
  user?: User
  isCollapsed?: boolean
}

export function ConsoleSidebar({ className, user, isCollapsed = false }: ConsoleSidebarProps) {
  const pathname = usePathname()
  const [recentChats, setRecentChats] = useState<RecentChat[]>([])
  const [isLoadingChats, setIsLoadingChats] = useState(true)

  useEffect(() => {
    loadRecentChats()
    
    // Refresh recent chats every 5 seconds to show new chats
    const interval = setInterval(loadRecentChats, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Also refresh when pathname changes (user navigates)
  useEffect(() => {
    loadRecentChats()
  }, [pathname])

  const loadRecentChats = async () => {
    try {
      setIsLoadingChats(true)
      const response = await fetch('/api/chats', {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRecentChats(data.chats?.slice(0, 5) || []) // Show only 5 most recent
      }
    } catch (error) {
      console.error('Error loading recent chats:', error)
    } finally {
      setIsLoadingChats(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={cn(
      'flex h-full flex-col bg-background border-r transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/console/chat" className="flex items-center space-x-2">
          <Image 
            src="/icons/icon-dark.png" 
            alt="Retenify" 
            width={24}
            height={24}
            className="flex-shrink-0"
          />
          {!isCollapsed && <span className="font-bold">Retenify</span>}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col min-h-0">
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {/* New Chat */}
          <Button className={cn("w-full justify-start mb-4", isCollapsed && "px-2")} asChild>
            <Link href="/console/chat?new=true">
              <Plus className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && "New Chat"}
            </Link>
          </Button>

          {/* Main Navigation */}
          <div className="space-y-1">
            <Button
              variant={pathname === '/console/agents' ? 'secondary' : 'ghost'}
              className={cn("w-full justify-start", isCollapsed && "px-2")}
              asChild
            >
              <Link href="/console/agents">
                <Bot className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Agents"}
              </Link>
            </Button>
            
            <Button
              variant={pathname === '/console/knowledge' ? 'secondary' : 'ghost'}
              className={cn("w-full justify-start", isCollapsed && "px-2")}
              asChild
            >
              <Link href="/console/knowledge">
                <Brain className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Knowledge"}
              </Link>
            </Button>
            
            <Button
              variant={pathname === '/console/library' ? 'secondary' : 'ghost'}
              className={cn("w-full justify-start", isCollapsed && "px-2")}
              asChild
            >
              <Link href="/console/library">
                <Library className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Library"}
              </Link>
            </Button>
          </div>

          {/* Recent Chats - Only show when not collapsed */}
          {!isCollapsed && (
            <div className="pt-6">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Recent Chats
              </h4>
              
              {/* Hide loading state - just show empty space */}
              {isLoadingChats ? null : recentChats.length > 0 ? (
                <div className="space-y-1">
                  {recentChats.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/console/chat/${chat.id}`}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors",
                        pathname === `/console/chat/${chat.id}` && "bg-muted"
                      )}
                    >
                      <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{chat.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(chat.updatedAt)} • {chat.messageCount} msgs
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-2 py-4 text-center">
                  <MessageSquare className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No recent chats</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start a conversation to see your chat history
                  </p>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Profile Bar */}
      {user && (
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(
                "w-full p-2 h-auto",
                isCollapsed ? "justify-center" : "justify-between"
              )}>
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                </div>
                {!isCollapsed && <ChevronUp className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/console/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/console/help" className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}