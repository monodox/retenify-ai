import { NextRequest, NextResponse } from 'next/server'
import { generate } from '@/lib/genkit'
import { getChat, addMessageToChat, deleteChat } from '@/lib/chat-storage'

// Configuration
const AI_MODEL = process.env.AI_MODEL || 'gemini-3-flash-preview'

// Error types for better error handling
interface APIError {
  code: string
  message: string
  details?: any
}

function createErrorResponse(error: APIError, status: number = 500) {
  return NextResponse.json({ error }, { status })
}

function handleGeminiError(error: any): APIError {
  console.error('Gemini API error:', error)
  
  if (error?.message?.includes('API_KEY_INVALID')) {
    return {
      code: 'INVALID_API_KEY',
      message: 'I\'m having trouble connecting to my AI service right now. Let me try to help you anyway!',
      details: 'The Google AI API key is invalid or missing.'
    }
  }
  
  if (error?.message?.includes('QUOTA_EXCEEDED')) {
    return {
      code: 'QUOTA_EXCEEDED',
      message: 'I\'m experiencing high demand right now. Please try again in a few minutes.',
      details: 'The API quota has been exceeded for this period.'
    }
  }
  
  if (error?.message?.includes('RATE_LIMIT_EXCEEDED')) {
    return {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'I need a moment to catch up. Please wait a few seconds and try again.',
      details: 'Rate limit exceeded for the AI service.'
    }
  }
  
  if (error?.message?.includes('SAFETY')) {
    return {
      code: 'CONTENT_FILTERED',
      message: 'I can\'t respond to that message. Could you try rephrasing it?',
      details: 'Content was blocked by safety filters.'
    }
  }
  
  return {
    code: 'AI_SERVICE_ERROR',
    message: 'I\'m having some technical difficulties. Let me try to help you in a different way.',
    details: error?.message || 'Unknown AI service error'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params

    if (!chatId || typeof chatId !== 'string') {
      return createErrorResponse({
        code: 'INVALID_CHAT_ID',
        message: 'Invalid chat ID provided.'
      }, 400)
    }

    const chat = getChat(chatId)

    if (!chat) {
      return createErrorResponse({
        code: 'CHAT_NOT_FOUND',
        message: 'Chat not found. It may have been deleted or never existed.'
      }, 404)
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Get chat error:', error)
    return createErrorResponse({
      code: 'INTERNAL_ERROR',
      message: 'Failed to retrieve chat. Please try again.'
    })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params
    
    if (!chatId || typeof chatId !== 'string') {
      return createErrorResponse({
        code: 'INVALID_CHAT_ID',
        message: 'Invalid chat ID provided.'
      }, 400)
    }

    const body = await request.json()
    const { message } = body

    // Validate input
    if (!message || typeof message !== 'string') {
      return createErrorResponse({
        code: 'INVALID_INPUT',
        message: 'Message is required and must be a string.'
      }, 400)
    }

    if (message.trim().length === 0) {
      return createErrorResponse({
        code: 'EMPTY_MESSAGE',
        message: 'Message cannot be empty.'
      }, 400)
    }

    if (message.length > 10000) {
      return createErrorResponse({
        code: 'MESSAGE_TOO_LONG',
        message: 'Message is too long. Please keep it under 10,000 characters.'
      }, 400)
    }

    const chat = getChat(chatId)
    if (!chat) {
      return createErrorResponse({
        code: 'CHAT_NOT_FOUND',
        message: 'Chat not found. It may have been deleted.'
      }, 404)
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      // Provide fallback response instead of error
      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm currently experiencing some technical difficulties with my AI service. However, I'm here to help! Could you please rephrase your question or let me know what specific information you're looking for about customer retention?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      addMessageToChat(chatId, fallbackMessage)

      return NextResponse.json({
        response: fallbackMessage.content,
        timestamp: new Date().toISOString(),
      })
    }

    // Add user message
    try {
      const userMessage = {
        id: Date.now().toString(),
        content: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      addMessageToChat(chatId, userMessage)
    } catch (error) {
      console.error('Error adding user message:', error)
      return createErrorResponse({
        code: 'MESSAGE_SAVE_ERROR',
        message: 'Failed to save your message. Please try again.'
      })
    }

    // Generate AI response with context
    let response
    try {
      const contextMessages = chat.messages.slice(-5).map((msg) => 
        `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n')

      response = await generate({
        model: AI_MODEL,
        prompt: `You are Retenify AI, a helpful assistant for customer retention.

        Previous context:
        ${contextMessages}

        Respond concisely, matching the user's communication style. Keep it brief and actionable.

        User message: "${message}"

        Brief response:`,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      })
    } catch (error) {
      const apiError = handleGeminiError(error)
      
      // Provide fallback response instead of error
      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        content: apiError.message + " I'm still here to help with customer retention strategies. What specific area would you like to discuss?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      addMessageToChat(chatId, fallbackMessage)

      return NextResponse.json({
        response: fallbackMessage.content,
        timestamp: new Date().toISOString(),
      })
    }

    // Add AI response
    try {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.text(),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      addMessageToChat(chatId, aiMessage)

      return NextResponse.json({
        response: response.text(),
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error adding AI message:', error)
      return createErrorResponse({
        code: 'MESSAGE_SAVE_ERROR',
        message: 'Failed to save AI response. Please try again.'
      })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return createErrorResponse({
        code: 'INVALID_JSON',
        message: 'Invalid request format.'
      }, 400)
    }
    
    return createErrorResponse({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.'
    })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params
    
    if (!chatId || typeof chatId !== 'string') {
      return createErrorResponse({
        code: 'INVALID_CHAT_ID',
        message: 'Invalid chat ID provided.'
      }, 400)
    }
    
    const deleted = deleteChat(chatId)
    
    if (!deleted) {
      return createErrorResponse({
        code: 'CHAT_NOT_FOUND',
        message: 'Chat not found. It may have already been deleted.'
      }, 404)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete chat error:', error)
    return createErrorResponse({
      code: 'INTERNAL_ERROR',
      message: 'Failed to delete chat. Please try again.'
    })
  }
}