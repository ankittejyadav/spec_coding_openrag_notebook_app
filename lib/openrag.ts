import { OpenRAGClient } from 'openrag-sdk'

export const openrag = new OpenRAGClient({
  apiKey: process.env.OPENRAG_API_KEY || 'dummy_key',
  baseUrl: process.env.OPENRAG_URL ?? 'http://localhost:3000',
  timeout: 600_000,
})
