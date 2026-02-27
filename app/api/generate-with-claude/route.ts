import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { userMessage } = await request.json()

    if (!userMessage || !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    // Use Claude to generate theme content
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Eres un experto diseñador web y copywriter. El usuario quiere crear una web WordPress y te dice: "${userMessage}"

Genera un objeto JSON con la siguiente estructura (sin markdown, solo JSON puro):

{
  "businessName": "Nombre del negocio extraído o sugerido",
  "businessType": "Restaurante|Agencia|eCommerce|Blog|SaaS|Portfolio|Otro",
  "tagline": "Un tagline pegadizo y profesional",
  "hero": {
    "title": "Título principal (máx 60 caracteres)",
    "subtitle": "Subtítulo descriptivo (máx 120 caracteres)",
    "cta": "Texto del botón principal",
    "badge": "Texto del badge opcional (ej: Nuevo, Oferta, etc)"
  },
  "sections": [
    {
      "type": "services|features|stats|testimonials|cta|contact",
      "title": "Título de la sección",
      "items": [
        {
          "title": "Título del item",
          "description": "Descripción breve",
          "icon": "emoji apropiado"
        }
      ]
    }
  ],
  "colors": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor"
  }
}

IMPORTANTE:
- Genera contenido REAL y específico para el tipo de negocio
- Los textos deben ser persuasivos y profesionales
- Incluye 3-6 servicios/features relevantes
- Si mencionan nombre específico, úsalo
- Si no, sugiere uno apropiado
- Responde SOLO con el JSON, sin explicaciones`
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

    const themeSlug = `${themeName}-wp`
    const functionPrefix = themeSlug.replace(/-/g, '_')

    // Generate theme files
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
Description: ${data.tagline}
Version: 1.0.0
License: GNU General Public License v2 or later
Text Domain: ${themeSlug}
Tags: full-site-editing, block-patterns, custom-colors, ai-generated
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
          { "slug": "primary", "name": "Primary", "color": data.colors.primary || "#0A1E3D" },
          { "slug": "secondary", "name": "Secondary", "color": data.colors.secondary || "#1B3A6B" },
          { "slug": "accent", "name": "Accent", "color": data.colors.accent || "#3B82F6" },
          { "slug": "background", "name": "Background", "color": "#0d1117" },
          { "slug": "surface", "name": "Surface", "color": "#161b27" },
          { "slug": "text", "name": "Text", "color": "#e2e8f0" }
        ]
      },
      "typography": {
        "fontFamilies": [
          { "fontFamily": "'Plus Jakarta Sans', sans-serif", "slug": "heading", "name": "Heading" },
          { "fontFamily": "'Inter', sans-serif", "slug": "body", "name": "Body" }
        ]
      },
      "layout": {
        "contentSize": "1200px",
        "wideSize": "1400px"
      }
    },
    "styles": {
      "color": {
        "background": "var(--wp--preset--color--background)",
        "text": "var(--wp--preset--color--text)"
      },
      "typography": {
        "fontFamily": "var(--wp--preset--font-family--body)"
      },
      "spacing": {
        "blockGap": "0px",
        "padding": {
          "left": "clamp(20px, 5vw, 80px)",
          "right": "clamp(20px, 5vw, 80px)"
        }
      }
    }
  }, null, 2)

  // functions.php
  files['functions.php'] = `<?php
// Enqueue styles and scripts
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('${functionPrefix}-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;900&family=Inter:wght@300;400;500&display=swap',
        [], null
    );
    wp_enqueue_style('${functionPrefix}-theme',
        get_template_directory_uri() . '/assets/css/theme.css',
        [], '1.0.0'
    );
});

// Register pattern category
add_action('init', function() {
    register_block_pattern_category('${themeSlug}', ['label' => '${data.businessName}']);
});`

  // assets/css/theme.css
  files['assets/css/theme.css'] = `/* ${data.businessName} Theme Styles */
:root {
    --c-primary: ${data.colors.primary || '#0A1E3D'};
    --c-secondary: ${data.colors.secondary || '#1B3A6B'};
    --c-accent: ${data.colors.accent || '#3B82F6'};
    --c-bg: #0d1117;
    --c-surface: #161b27;
    --c-text: #e2e8f0;
    --c-muted: #94a3b8;
}

body {
    background: var(--c-bg);
    color: var(--c-text);
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
}

.hero-section {
    padding-top: 120px;
    padding-bottom: 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 40%, transparent 70%);
    z-index: 0;
    pointer-events: none;
}

.gradient-text {
    background: linear-gradient(135deg, var(--c-accent), #8B5CF6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.card {
    background: var(--c-surface);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 32px;
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    border-color: rgba(59,130,246,0.3);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.section-padding {
    padding-top: 80px;
    padding-bottom: 80px;
}

@media (max-width: 900px) {
    .hero-section {
        padding-top: 80px;
        padding-bottom: 60px;
    }
    .section-padding {
        padding-top: 60px;
        padding-bottom: 60px;
    }
}`

  // templates/index.html
  files['templates/index.html'] = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:pattern {"slug":"${themeSlug}/hero"} /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`

  // parts/header.html
  files['parts/header.html'] = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"24px","bottom":"24px"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:24px;padding-bottom:24px">
<!-- wp:site-title {"level":3} /-->
</div>
<!-- /wp:group -->`

  // parts/footer.html
  files['parts/footer.html'] = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:40px;padding-bottom:40px">
<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size">© 2026 ${data.businessName}. Powered by <a href="https://anvilwp.com">AnvilWP</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`

  // patterns/hero.php
  files['patterns/hero.php'] = `<?php
/**
 * Title: Hero Principal
 * Slug: ${themeSlug}/hero
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"hero-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull hero-section">

<!-- wp:group {"layout":{"type":"constrained","contentSize":"760px"}} -->
<div class="wp-block-group">

${data.hero.badge ? `<!-- wp:paragraph {"align":"center","style":{"elements":{"link":{"color":{"text":"var:preset|color|accent"}}}},"backgroundColor":"surface","fontSize":"small"} -->
<p class="has-text-align-center has-surface-background-color has-background has-link-color has-small-font-size" style="padding:8px 16px;border-radius:50px;border:1px solid rgba(255,255,255,0.1);display:inline-block">✨ ${data.hero.badge}</p>
<!-- /wp:paragraph -->` : ''}

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2.5rem,5vw,4rem)"}}} -->
<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(2.5rem,5vw,4rem)">${data.hero.title}<br><em class="gradient-text">${data.tagline}</em></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--c-muted)"},"typography":{"fontSize":"1.25rem"}}} -->
<p class="has-text-align-center" style="color:var(--c-muted);font-size:1.25rem">${data.hero.subtitle}</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button {"backgroundColor":"accent","style":{"border":{"radius":"8px"}}} -->
<div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-background wp-element-button" style="border-radius:8px">${data.hero.cta}</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`

  return files
}
