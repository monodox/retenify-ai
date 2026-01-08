'use client'

import { Button } from '@/components/ui/button'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface ConsoleHeaderProps {
  onMenuClick?: () => void
  onSidebarToggle?: () => void
  isSidebarCollapsed?: boolean
}

export function ConsoleHeader({ onMenuClick, onSidebarToggle, isSidebarCollapsed }: ConsoleHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 hidden md:flex"
          onClick={onSidebarToggle}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Empty space to maintain header structure */}
        <div className="flex-1" />
      </div>
    </header>
  )
}