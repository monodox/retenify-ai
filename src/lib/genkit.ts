import { configureGenkit } from '@genkit-ai/core'
import { googleAI } from '@genkit-ai/googleai'

// Configure Genkit with Google AI
export const ai = configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
})

// Dynamic import for generate function
export async function generate(options: any) {
  const { generate: genkitGenerate } = await import('@genkit-ai/ai')
  return genkitGenerate(options)
}