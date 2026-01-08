import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { CookieConsent } from '@/components/ui/cookie-consent'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: 'Retenify AI',
  description: 'Autonomous business, revenue, and market intelligence platform that helps companies understand what is happening in their business, why it is happening, and what to do next.',
  icons: {
    icon: '/icons/favicon.png',
    shortcut: '/icons/favicon.png',
    apple: '/icons/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} font-mono`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}