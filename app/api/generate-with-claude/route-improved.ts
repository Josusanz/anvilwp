import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const DESIGN_SYSTEM_PROMPT = `Eres un diseñador web experto especializado en crear sitios profesionales con estética dark/neon (estilo Cruip/Neon).
Tienes experiencia en copywriting persuasivo y diseño de UI/UX moderna.

DESIGN GUIDELINES - CRITICAL:
- Aesthetic: Dark backgrounds (#0d1117, #161b27) con accent colors brillantes (blue #3B82F6, purple #8B5CF6)
- Typography: Headings grandes y bold, body text legible con buena jerarquía
- Components: Cards con hover effects, icons circulares con gradientes, CTAs con gradients
- Spacing: Generoso white space, secciones bien separadas (80-120px)
- Visual effects: Radial glows, gradient text, glassmorphism, smooth transitions

CONTENT GUIDELINES - CRITICAL:
- Headlines: Específicos, orientados a beneficios, NO genéricos como "Bienvenido"
- Descriptions: Concretas y persuasivas, evitar jerga
- CTAs: Accionables y claros ("Solicita tu demo gratis", no solo "Ver más")
- Testimonials: Específicos con nombres completos y empresas reales
- Stats: Números impresionantes pero creíbles (500+ proyectos, no 10M users para pequeña empresa)

IMPORTANTE - Estructura según tipo de negocio:
- Restaurante: Hero + Specialties + About + Testimonials + Location + CTA
- Agencia Digital: Hero + Services + Portfolio + Team + Testimonials + CTA
- eCommerce: Hero + Categories/Products + Benefits + Testimonials + CTA
- SaaS: Hero + Features + How it works + Pricing + Testimonials + CTA
- Médico/Clínica: Hero + Services + About + Team + Testimonials + Contact
- Legal: Hero + Practice areas + About + Team + Testimonials + Contact
- Blog/Portfolio: Hero + Featured content + About + Services + CTA`

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

    // Use Claude to generate theme content with improved prompt
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192, // Aumentado para generar más contenido
      messages: [{
        role: 'user',
        content: `${DESIGN_SYSTEM_PROMPT}

El usuario quiere: "${userMessage}"

Genera un objeto JSON con esta estructura EXACTA (sin markdown, solo JSON puro):

{
  "businessName": "Nombre del negocio extraído o sugerido",
  "businessType": "Restaurant|Agency|eCommerce|Blog|SaaS|Portfolio|Medical|Legal|Education|Otro",
  "tagline": "Un tagline pegadizo máx 80 caracteres",
  "description": "Meta description SEO 160 caracteres",

  "hero": {
    "badge": "texto opcional del badge (ej: Nuevo, Top Rated)",
    "title": "Título principal 40-60 caracteres",
    "titleAccent": "palabra o frase corta para gradient highlight",
    "subtitle": "Subtítulo descriptivo 100-140 caracteres",
    "cta": {
      "primary": "texto botón principal",
      "secondary": "texto botón secundario opcional"
    }
  },

  "features": {
    "title": "Por qué elegirnos" o similar,
    "subtitle": "opcional",
    "items": [
      {
        "icon": "emoji apropiado 🚀⚡💎🔒🌍👥✨💡📈🎯",
        "title": "Beneficio específico",
        "description": "Explicación concreta 80-120 caracteres"
      }
    ]
  },

  "services": {
    "title": "Nuestros servicios" o similar,
    "items": [
      {
        "icon": "emoji",
        "title": "Nombre del servicio",
        "description": "Qué incluye, 80-120 caracteres"
      }
    ]
  },

  "stats": [
    { "value": "500+", "label": "Proyectos completados" },
    { "value": "98%", "label": "Clientes satisfechos" },
    { "value": "15 años", "label": "De experiencia" }
  ],

  "testimonials": {
    "title": "Lo que dicen nuestros clientes",
    "items": [
      {
        "quote": "Testimonial específico y creíble 140-180 caracteres",
        "author": "Nombre Apellido",
        "role": "CEO o puesto",
        "company": "Empresa Real"
      }
    ]
  },

  "cta": {
    "title": "Call to action final 30-50 caracteres",
    "subtitle": "Razón para actuar ahora 80-120 caracteres",
    "button": "Texto del botón"
  },

  "colors": {
    "primary": "#color apropiado al industry",
    "accent": "#3B82F6 o variante",
    "secondary": "#8B5CF6 o variante"
  },

  "seo": {
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  }
}

REGLAS CRÍTICAS:
1. Contenido ESPECÍFICO al tipo de negocio, NO genérico
2. Mínimo 3 features, máximo 6
3. Mínimo 3 services (si aplica), máximo 6
4. Mínimo 3 testimonials, máximo 6
5. Siempre incluir 3 stats relevantes
6. CTAs accionables, no vagos
7. Names y companies en testimonials deben sonar reales
8. Responde SOLO con JSON, sin explicaciones ni markdown`
      }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Respuesta inesperada de Claude')
    }

    // Parse Claude's JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta')
    }

    const themeData = JSON.parse(jsonMatch[0])

    // Generate WordPress theme files
    const themeName = themeData.businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const themeSlug = `${themeName}-anvilwp`
    const functionPrefix = themeSlug.replace(/-/g, '_')

    // Generate theme files with ALL patterns
    const files = generateThemeFiles(themeSlug, functionPrefix, themeData)

    return NextResponse.json({
      success: true,
      themeName: themeSlug,
      themeData,
      files,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      {
        error: 'Error al generar el theme',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateThemeFiles(themeSlug: string, functionPrefix: string, data: any) {
  const files: Record<string, string> = {}

  // style.css
  files['style.css'] = `/*
Theme Name: ${data.businessName}
Theme URI: https://anvilwp.com
Author: AnvilWP
Author URI: https://anvilwp.com
Description: ${data.description || data.tagline}
Version: 1.0.0
Requires at least: 6.4
Tested up to: 6.9
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${themeSlug}
Tags: full-site-editing, block-patterns, custom-colors, dark-mode, ai-generated, anvilwp
*/`

  // theme.json
  files['theme.json'] = JSON.stringify({
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "settings": {
      "appearanceTools": true,
      "useRootPaddingAwareAlignments": true,
      "color": {
        "palette": [
          { "slug": "primary", "name": "Primary", "color": data.colors?.primary || "#0A1E3D" },
          { "slug": "accent", "name": "Accent", "color": data.colors?.accent || "#3B82F6" },
          { "slug": "secondary", "name": "Secondary", "color": data.colors?.secondary || "#8B5CF6" },
          { "slug": "background", "name": "Background", "color": "#0d1117" },
          { "slug": "surface", "name": "Surface", "color": "#161b27" },
          { "slug": "surface-elevated", "name": "Surface Elevated", "color": "#1e2535" },
          { "slug": "text", "name": "Text", "color": "#e2e8f0" },
          { "slug": "text-muted", "name": "Text Muted", "color": "#94a3b8" },
          { "slug": "success", "name": "Success", "color": "#10B981" },
          { "slug": "warning", "name": "Warning", "color": "#F59E0B" },
          { "slug": "error", "name": "Error", "color": "#EF4444" }
        ]
      },
      "typography": {
        "fontFamilies": [
          {
            "fontFamily": "'Plus Jakarta Sans', 'Uncut Sans', sans-serif",
            "slug": "heading",
            "name": "Heading"
          },
          {
            "fontFamily": "'Inter', sans-serif",
            "slug": "body",
            "name": "Body"
          }
        ],
        "fontSizes": [
          { "slug": "small", "size": "0.875rem", "name": "Small" },
          { "slug": "medium", "size": "1rem", "name": "Medium" },
          { "slug": "large", "size": "1.125rem", "name": "Large" },
          { "slug": "x-large", "size": "1.25rem", "name": "Extra Large" },
          { "slug": "xx-large", "size": "1.5rem", "name": "2X Large" },
          { "slug": "xxx-large", "size": "2.25rem", "name": "3X Large" },
          { "slug": "xxxx-large", "size": "3rem", "name": "4X Large" }
        ]
      },
      "layout": {
        "contentSize": "1200px",
        "wideSize": "1400px"
      },
      "spacing": {
        "spacingScale": {
          "steps": 0
        },
        "spacingSizes": [
          { "slug": "20", "size": "0.25rem", "name": "XX-Small" },
          { "slug": "30", "size": "0.5rem", "name": "X-Small" },
          { "slug": "40", "size": "1rem", "name": "Small" },
          { "slug": "50", "size": "1.5rem", "name": "Medium" },
          { "slug": "60", "size": "2rem", "name": "Large" },
          { "slug": "70", "size": "3rem", "name": "X-Large" },
          { "slug": "80", "size": "4rem", "name": "XX-Large" }
        ]
      }
    },
    "styles": {
      "color": {
        "background": "var(--wp--preset--color--background)",
        "text": "var(--wp--preset--color--text)"
      },
      "typography": {
        "fontFamily": "var(--wp--preset--font-family--body)",
        "lineHeight": "1.6"
      },
      "spacing": {
        "blockGap": "0px",
        "padding": {
          "left": "clamp(20px, 5vw, 80px)",
          "right": "clamp(20px, 5vw, 80px)"
        }
      },
      "elements": {
        "heading": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--heading)",
            "fontWeight": "700",
            "lineHeight": "1.2"
          }
        },
        "link": {
          "color": {
            "text": "var(--wp--preset--color--accent)"
          },
          ":hover": {
            "typography": {
              "textDecoration": "none"
            }
          }
        },
        "button": {
          "color": {
            "background": "var(--wp--preset--color--accent)",
            "text": "#ffffff"
          },
          "border": {
            "radius": "8px"
          },
          "typography": {
            "fontWeight": "600"
          }
        }
      }
    }
  }, null, 2)

  // functions.php with enhanced features
  files['functions.php'] = generateFunctionsPhp(functionPrefix, data)

  // Enhanced theme.css with advanced effects
  files['assets/css/theme.css'] = generateAdvancedCSS(data)

  // Generate all patterns
  files['patterns/hero.php'] = generateHeroPattern(themeSlug, data)
  files['patterns/features.php'] = generateFeaturesPattern(themeSlug, data)
  files['patterns/services.php'] = generateServicesPattern(themeSlug, data)
  files['patterns/stats.php'] = generateStatsPattern(themeSlug, data)
  files['patterns/testimonials.php'] = generateTestimonialsPattern(themeSlug, data)
  files['patterns/cta.php'] = generateCTAPattern(themeSlug, data)

  // Template parts
  files['parts/header.html'] = generateHeader(data)
  files['parts/footer.html'] = generateFooter(data)

  // Templates
  files['templates/index.html'] = generateIndexTemplate(themeSlug)
  files['templates/front-page.html'] = generateFrontPageTemplate(themeSlug)
  files['templates/page.html'] = generatePageTemplate()
  files['templates/single.html'] = generateSingleTemplate()

  return files
}

// Continue in next message with helper functions...
export default POST
