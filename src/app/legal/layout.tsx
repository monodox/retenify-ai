import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'

interface LegalLayoutProps {
  children: React.ReactNode
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader variant="legal" showAuth={true} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <AppFooter variant="default" />
    </div>
  )
}