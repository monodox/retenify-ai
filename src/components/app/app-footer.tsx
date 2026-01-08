import Link from 'next/link'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

interface AppFooterProps {
  variant?: 'default' | 'minimal'
}

export function AppFooter({ variant = 'default' }: AppFooterProps) {
  if (variant === 'minimal') {
    return (
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2026 Retenify. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/legal/privacy"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/legal/cookies"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Image 
                src="/icons/icon-dark.png" 
                alt="Retenify" 
                width={24}
                height={24}
              />
              <span className="font-bold">Retenify</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Customer retention platform for growing businesses.<br />
              Keep customers engaged with powerful tools.<br />
              Drive growth through better retention strategies.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold mb-6">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get updates and insights delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Retenify. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/legal/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal/cookies"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}