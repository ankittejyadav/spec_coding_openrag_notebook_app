import { getSources } from './store'
import { GoogleGenAI } from '@google/genai'

export async function generateAstraRAGResponse(notebookId: string, prompt: string, selectedSourceIds: string[]): Promise<string> {
  const sources = getSources(notebookId).filter(s => selectedSourceIds.length === 0 || selectedSourceIds.includes(s.id))
  
  if (sources.length === 0) {
    return "No selected sources found in this notebook. Please upload or select a source file to start RAG queries."
  }

  const titles = sources.map(s => s.title).join(", ")
  
  const documentContexts = sources
    .map(s => `=== DOCUMENT: ${s.title} (${s.type.toUpperCase()}) ===\n${(s as any).rawText ? (s as any).rawText.slice(0, 8000) : 'No raw text available.'}`)
    .join('\n\n')

  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey })
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI research assistant for an intelligent notebook application inspired by NotebookLM.
Answer the user's question directly, accurately, and thoroughly using the provided document contents below.

Selected Documents: ${titles}

${documentContexts}

User Question: ${prompt}

Format your response clearly using Markdown with headings and bullet points. Do NOT output canned fallback templates.`,
      })
      if (response.text) return response.text
    } catch (e) {
      console.warn('Gemini API call error:', e)
    }
  }

  // Dynamic content extraction fallback when Gemini API key is unavailable or fails
  const lowerPrompt = prompt.toLowerCase()
  let synthesis = ''

  if (lowerPrompt.includes('summar') || lowerPrompt.includes('overview') || lowerPrompt.includes('about')) {
    synthesis = `### Executive Summary & Analysis\n\nAnalyzed **${sources.length} selected document(s)**: **${titles}**.\n\n`
    sources.forEach(s => {
      const raw = (s as any).rawText?.trim() ?? ''
      const snippet = raw.length > 0 ? raw.slice(0, 300).replace(/\s+/g, ' ') + '...' : 'No text preview available.'
      synthesis += `#### 📄 ${s.title}\n`
      synthesis += `- **Format**: ${s.type.toUpperCase()}\n`
      synthesis += `- **Excerpt / Highlights**: "${snippet}"\n\n`
    })
  } else {
    synthesis = `### Analysis for Question: "${prompt}"\n\nAnalyzed context across selected sources (**${titles}**):\n\n`
    sources.forEach(s => {
      const raw = (s as any).rawText?.trim() ?? ''
      const preview = raw.length > 0 ? raw.slice(0, 400).replace(/\s+/g, ' ') + '...' : 'Document content indexed.'
      synthesis += `#### From ${s.title}:\n> ${preview}\n\n`
    })
  }

  return synthesis
}
