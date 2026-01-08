import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader variant="auth" showAuth={false} />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter variant="default" />
    </div>
  )
}