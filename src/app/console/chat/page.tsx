'use client'

import { Suspense } from 'react'
import { ChatPageContent } from './chat-content'

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  )
}