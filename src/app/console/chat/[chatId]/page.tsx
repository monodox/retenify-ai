'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Send, 
  Bot,
  User,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface APIError {
  code: string
  message: string
  details?: string
}

export default function ChatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.chatId as string
  
  const [chat, setChat] = useState<Chat | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingChat, setIsLoadingChat] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setIsLoadingChat(true)
        const response = await fetch(`/api/chat/${chatId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/console/chat')
            return
          }
          throw new Error('Failed to load chat')
        }

        const chatData = await response.json()
        setChat(chatData)
      } catch (error) {
        console.error('Error loading chat:', error)
        router.push('/console/chat')
      } finally {
        setIsLoadingChat(false)
      }
    }
    
    loadChatData()
  }, [chatId, router])



  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !chat) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedChat = {
      ...chat,
      messages: [...chat.messages, userMessage],
      updatedAt: new Date().toISOString()
    }
    setChat(updatedChat)
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue.trim() }),
      })

      const data = await response.json()
      
      // Always add the response, even if it's a fallback message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiMessage],
        updatedAt: new Date().toISOString()
      } : null)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add a generic error message to the chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I\'m having trouble connecting right now. Could you try sending your message again?',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMessage],
        updatedAt: new Date().toISOString()
      } : null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isLoadingChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Chat not found</p>
          <Button asChild>
            <Link href="/console/chat">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chat
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/console/chat">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-medium">{chat.title}</h1>
            <p className="text-xs text-muted-foreground">
              Created {new Date(chat.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>
                  {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={`px-4 py-2 rounded-lg ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Thinking animation - improved */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-xs lg:max-w-md">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="px-4 py-2 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="min-h-[40px] resize-none"
              maxLength={10000}
            />
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line • {inputValue.length}/10,000
        </p>
      </div>
    </div>
  )
}