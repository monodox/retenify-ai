// Chat storage with cache integration
// In production, you'd use a database like PostgreSQL, MongoDB, etc.

import { cache } from './cache'

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

// Global in-memory storage with cache backup
const chats = new Map<string, Chat>()

// Load chats from cache on initialization
function loadChatsFromCache() {
  const cachedChats = cache.getChatHistory('demo-user')
  if (cachedChats && Array.isArray(cachedChats)) {
    cachedChats.forEach((chat: Chat) => {
      chats.set(chat.id, chat)
    })
  }
}

// Save chats to cache
function saveChatsToCache() {
  const allChats = Array.from(chats.values())
  cache.setChatHistory('demo-user', allChats)
}

// Initialize cache loading
if (typeof window !== 'undefined') {
  loadChatsFromCache()
}

export function generateChatId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomStr}`
}

export function getAllChats(): Chat[] {
  return Array.from(chats.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getChat(chatId: string): Chat | undefined {
  return chats.get(chatId)
}

export function createChat(title: string = 'New Chat'): Chat {
  const chatId = generateChatId()
  const now = new Date().toISOString()
  
  const newChat: Chat = {
    id: chatId,
    title,
    messages: [],
    createdAt: now,
    updatedAt: now
  }

  chats.set(chatId, newChat)
  saveChatsToCache()
  
  // Track feature usage
  cache.trackFeatureUsage('chat-created')
  
  return newChat
}

export function updateChat(chatId: string, updates: Partial<Chat>): Chat | null {
  const chat = chats.get(chatId)
  if (!chat) return null

  const updatedChat = {
    ...chat,
    ...updates,
    updatedAt: new Date().toISOString()
  }

  chats.set(chatId, updatedChat)
  saveChatsToCache()
  return updatedChat
}

export function deleteChat(chatId: string): boolean {
  const deleted = chats.delete(chatId)
  if (deleted) {
    saveChatsToCache()
    cache.trackFeatureUsage('chat-deleted')
  }
  return deleted
}

export function addMessageToChat(chatId: string, message: Message): Chat | null {
  const chat = chats.get(chatId)
  if (!chat) return null

  chat.messages.push(message)
  chat.updatedAt = new Date().toISOString()
  
  // Update title if it's the first user message and title is still default
  if (message.isUser && (chat.title === 'New Chat' || chat.messages.filter(m => m.isUser).length === 1)) {
    chat.title = message.content.length > 50 
      ? message.content.substring(0, 50) + '...' 
      : message.content
  }

  chats.set(chatId, chat)
  saveChatsToCache()
  
  // Track message activity
  cache.trackFeatureUsage(message.isUser ? 'user-message-sent' : 'ai-response-received')
  
  return chat
}