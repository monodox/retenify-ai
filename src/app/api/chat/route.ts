import { NextRequest, NextResponse } from 'next/server'
import { generate } from '@/lib/genkit'
import { createChat, addMessageToChat, generateChatId, getChat } from '@/lib/chat-storage'

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
  
  // Check for specific error types
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
  
  // Generic error
  return {
    code: 'AI_SERVICE_ERROR',
    message: 'I\'m having some technical difficulties. Let me try to help you in a different way.',
    details: error?.message || 'Unknown AI service error'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, createNew, chatId } = body

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

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      // Handle missing API key case
      if (createNew) {
        const newChat = createChat(message.length > 50 ? message.substring(0, 50) + '...' : message)
        
        const userMessage = {
          id: Date.now().toString(),
          content: message,
          isUser: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        const fallbackMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm currently experiencing some technical difficulties with my AI service. However, I'm here to help! Could you please rephrase your question or let me know what specific information you're looking for about customer retention?",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        addMessageToChat(newChat.id, userMessage)
        addMessageToChat(newChat.id, fallbackMessage)

        return NextResponse.json({
          chatId: newChat.id,
          response: fallbackMessage.content,
          timestamp: new Date().toISOString(),
        })
      } else if (chatId) {
        // Continue existing chat
        const chat = getChat(chatId)
        if (chat) {
          const userMessage = {
            id: Date.now().toString(),
            content: message,
            isUser: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }

          const fallbackMessage = {
            id: (Date.now() + 1).toString(),
            content: "I'm still experiencing technical difficulties. Could you try rephrasing your question?",
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }

          addMessageToChat(chatId, userMessage)
          addMessageToChat(chatId, fallbackMessage)

          return NextResponse.json({
            chatId,
            response: fallbackMessage.content,
            timestamp: new Date().toISOString(),
          })
        }
      }
    }

    // Create new chat if requested
    if (createNew) {
      let newChat
      try {
        newChat = createChat(message.length > 50 ? message.substring(0, 50) + '...' : message)
      } catch (error) {
        console.error('Error creating chat:', error)
        return createErrorResponse({
          code: 'CHAT_CREATION_ERROR',
          message: 'Failed to create new chat. Please try again.'
        })
      }

      // Generate AI response
      let response
      try {
        response = await generate({
          model: AI_MODEL,
          prompt: `You are Retenify AI, a helpful assistant for customer retention. 

          Respond in a concise, direct style that matches the user's tone and message length. Keep responses short and actionable.

          User message: "${message}"

          Provide a brief, helpful response:`,
          config: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        })
      } catch (error) {
        const apiError = handleGeminiError(error)
        
        // Instead of returning error, provide a fallback response
        const fallbackMessage = {
          id: (Date.now() + 1).toString(),
          content: apiError.message + " I'm still here to help with customer retention strategies. What specific area would you like to discuss?",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        const userMessage = {
          id: Date.now().toString(),
          content: message,
          isUser: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        addMessageToChat(newChat.id, userMessage)
        addMessageToChat(newChat.id, fallbackMessage)

        return NextResponse.json({
          chatId: newChat.id,
          response: fallbackMessage.content,
          timestamp: new Date().toISOString(),
        })
      }

      // Add messages to the new chat
      try {
        const userMessage = {
          id: Date.now().toString(),
          content: message,
          isUser: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: response.text(),
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        addMessageToChat(newChat.id, userMessage)
        addMessageToChat(newChat.id, aiMessage)

        return NextResponse.json({
          chatId: newChat.id,
          response: response.text(),
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error adding messages to chat:', error)
        return createErrorResponse({
          code: 'MESSAGE_SAVE_ERROR',
          message: 'Failed to save conversation. Please try again.'
        })
      }
    }

    // Continue existing chat
    if (chatId) {
      const chat = getChat(chatId)
      if (!chat) {
        return createErrorResponse({
          code: 'CHAT_NOT_FOUND',
          message: 'Chat not found.'
        }, 404)
      }

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      addMessageToChat(chatId, userMessage)

      // Generate AI response with context
      try {
        const contextMessages = chat.messages.slice(-5).map((msg) => 
          `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')

        const response = await generate({
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

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: response.text(),
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        addMessageToChat(chatId, aiMessage)

        return NextResponse.json({
          chatId,
          response: response.text(),
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        const apiError = handleGeminiError(error)
        
        const fallbackMessage = {
          id: (Date.now() + 1).toString(),
          content: apiError.message + " I'm still here to help with customer retention strategies. What specific area would you like to discuss?",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        addMessageToChat(chatId, fallbackMessage)

        return NextResponse.json({
          chatId,
          response: fallbackMessage.content,
          timestamp: new Date().toISOString(),
        })
      }
    }

    // For backward compatibility - direct message without chat creation
    try {
      const response = await generate({
        model: AI_MODEL,
        prompt: `You are Retenify AI, a helpful assistant for customer retention.

        Respond in a concise, direct style that matches the user's tone and message length. Keep responses short and actionable.

        User message: "${message}"

        Provide a brief, helpful response:`,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      })

      return NextResponse.json({
        response: response.text(),
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      const apiError = handleGeminiError(error)
      
      // Provide fallback response instead of error
      const fallbackResponse = apiError.message + " I'm still here to help with customer retention strategies. What would you like to know?"
      
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('Unexpected error in chat API:', error)
    
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