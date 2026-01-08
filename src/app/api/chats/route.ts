import { NextRequest, NextResponse } from 'next/server'
import { getAllChats, createChat } from '@/lib/chat-storage'

export async function GET() {
  try {
    const allChats = getAllChats()
    const chatList = allChats.map(chat => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length
    }))

    console.log('Returning chats:', chatList.length, 'chats')
    console.log('Chat details:', chatList)

    return NextResponse.json({ chats: chatList })
  } catch (error) {
    console.error('Get chats error:', error)
    return NextResponse.json(
      { error: 'Failed to get chats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()
    const newChat = createChat(title)

    return NextResponse.json(newChat, { status: 201 })
  } catch (error) {
    console.error('Create chat error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    )
  }
}