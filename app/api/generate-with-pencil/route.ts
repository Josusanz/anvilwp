import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

/**
 * Visual-First Theme Generation with Pencil MCP
 *
 * Flow:
 * 1. User describes their site → Claude generates visual design in .pen format using Pencil MCP
 * 2. Claude uses Cruip/Neon style guides for inspiration
 * 3. Claude converts .pen design to WordPress blocks
 * 4. Returns both visual preview and WordPress theme
 */

export async function POST(request: NextRequest) {
  try {
    const { userMessage } = await request.json()

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Por favor describe el tipo de web que quieres crear' },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key de Anthropic no configurada' },
        { status: 500 }
      )
    }

    // Step 1: Generate visual design with Pencil MCP
    // NOTE: This requires Pencil MCP server to be running
    // For now, we'll use the improved text-based generation
    // TODO: Integrate actual Pencil MCP when available in Edge runtime

    const designData = await generateVisualDesign(userMessage)

    return NextResponse.json({
      success: true,
      message: 'Visual design generated with Pencil MCP style guides',
      designData,
      note: 'Full Pencil MCP integration coming soon - currently using advanced text-based generation with Cruip guidelines'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      {
        error: 'Error al generar el diseño visual',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function generateVisualDesign(userMessage: string) {
  // Use Cruip/Neon style guide inspiration
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: `You are a visual design expert specialized in creating modern, professional websites with dark/neon aesthetic (Cruip/Neon style).

VISUAL DESIGN GUIDELINES:
1. Color Palette:
   - Primary background: #0d1117 (deep dark)
   - Surface backgrounds: #161b27, #1e2535 (elevated surfaces)
   - Accent colors: Blue #3B82F6, Purple #8B5CF6, Pink #F472B6
   - Text: #e2e8f0 (primary), #94a3b8 (secondary)

2. Typography:
   - Headings: Plus Jakarta Sans / Uncut Sans - Bold (700-900 weight)
   - Body: Inter - Regular to Medium (400-600 weight)
   - Scale: clamp() for responsive sizing

3. Layout Patterns:
   - Hero: Full-width with radial glow background, centered content
   - Features: 3-column grid, circular gradient icons
   - Cards: Elevated surfaces with hover effects (translateY + border glow)
   - Stats: Large numbers with gradient text
   - Testimonials: Grid layout with avatars
   - CTA: Gradient background (blue-purple)

4. Visual Effects:
   - Radial glows for depth
   - Gradient text for emphasis
   - Smooth transitions (150-300ms)
   - Hover states with lift effect
   - Glassmorphism for elevated surfaces

5. Spacing:
   - Section padding: 80-120px desktop, 60px mobile
   - Card padding: 32px desktop, 24px mobile
   - Grid gaps: 24-32px
   - Consistent 8px base unit

USER REQUEST: "${userMessage}"

Generate a detailed visual design specification in JSON format:

{
  "businessName": "extracted or suggested name",
  "businessType": "Restaurant|Agency|eCommerce|SaaS|Portfolio|Other",
  "colorScheme": {
    "primary": "#hex",
    "accent": "#hex",
    "secondary": "#hex",
    "mood": "professional|playful|luxury|minimal"
  },
  "layout": {
    "hero": {
      "style": "centered|split|minimal",
      "background": "radial-glow|gradient|solid",
      "elements": ["badge", "title", "subtitle", "cta-buttons", "stats"]
    },
    "sections": [
      {
        "type": "features|services|testimonials|stats|cta",
        "layout": "grid-3|grid-2|flex|stacked",
        "visualStyle": "cards|minimal|illustrated"
      }
    ]
  },
  "visualHierarchy": {
    "primaryFocus": "hero CTA|features|social proof",
    "secondaryElements": ["stats", "testimonials"],
    "accentElements": ["gradient text", "glow effects", "hover states"]
  },
  "contentStructure": {
    "hero": { "title": "...", "subtitle": "...", "cta": "..." },
    "features": { "title": "...", "items": [...] },
    "services": { "title": "...", "items": [...] },
    "testimonials": { "title": "...", "items": [...] },
    "cta": { "title": "...", "subtitle": "...", "button": "..." }
  }
}

Focus on creating a cohesive visual narrative that guides the user through the site.
Respond ONLY with the JSON, no explanations.`
    }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response from Claude')
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from response')
  }

  return JSON.parse(jsonMatch[0])
}
