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

    // IMPROVED: Better prompt with explicit structure
    let message
    try {
      message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `ERES UN EXPERTO EN CREAR WEBSITES PREMIUM COMPLETOS.

Usuario solicita: "${userMessage}"

GENERA UN JSON COMPLETO CON **TODAS** LAS SECCIONES. Usa este template exacto y completa CADA campo:

\`\`\`json
{
  "businessName": "Nombre extraído o sugerido",
  "businessType": "tipo relevante",
  "tagline": "Frase memorable",
  "description": "Meta description 160 chars",
  "hero": {
    "badge": "✨ Badge llamativo",
    "title": "Título impactante",
    "subtitle": "Subtítulo que vende",
    "cta": "Botón acción"
  },
  "features": {
    "title": "Por qué elegirnos",
    "items": [
      {"icon": "🚀", "title": "Feature 1", "description": "Beneficio específico y convincente"},
      {"icon": "⚡", "title": "Feature 2", "description": "Beneficio específico y convincente"},
      {"icon": "💎", "title": "Feature 3", "description": "Beneficio específico y convincente"},
      {"icon": "🎯", "title": "Feature 4", "description": "Beneficio específico y convincente"}
    ]
  },
  "services": {
    "title": "Nuestros servicios",
    "items": [
      {"icon": "🔥", "title": "Servicio Premium 1", "description": "Descripción detallada del servicio"},
      {"icon": "✨", "title": "Servicio Premium 2", "description": "Descripción detallada del servicio"},
      {"icon": "💼", "title": "Servicio Premium 3", "description": "Descripción detallada del servicio"},
      {"icon": "🎨", "title": "Servicio Premium 4", "description": "Descripción detallada del servicio"}
    ]
  },
  "stats": [
    {"value": "500+", "label": "Clientes satisfechos"},
    {"value": "98%", "label": "Tasa de éxito"},
    {"value": "15 años", "label": "Experiencia"}
  ],
  "testimonials": {
    "title": "Lo que dicen nuestros clientes",
    "items": [
      {"quote": "Testimonio convincente y específico sobre resultados reales", "author": "Nombre Apellido", "role": "CEO", "company": "Empresa Real"},
      {"quote": "Otro testimonio detallado sobre experiencia positiva", "author": "Nombre Apellido", "role": "Director", "company": "Otra Empresa"},
      {"quote": "Testimonio sobre transformación lograda", "author": "Nombre Apellido", "role": "Fundador", "company": "Startup XYZ"},
      {"quote": "Testimonio sobre calidad del servicio", "author": "Nombre Apellido", "role": "Manager", "company": "Corp ABC"}
    ]
  },
  "cta": {
    "title": "¿Listo para transformar tu negocio?",
    "subtitle": "Contáctanos hoy y descubre cómo podemos ayudarte",
    "button": "Comenzar ahora"
  },
  "colors": {
    "primary": "#0A1E3D",
    "accent": "#3B82F6",
    "secondary": "#8B5CF6"
  }
}
\`\`\`

REGLAS OBLIGATORIAS:
✓ DEBES incluir MÍNIMO 4 features (usa emojis relevantes)
✓ DEBES incluir MÍNIMO 4 services (contenido específico)
✓ DEBES incluir EXACTAMENTE 3 stats relevantes
✓ DEBES incluir MÍNIMO 4 testimonials creíbles
✓ DEBES incluir sección CTA completa
✓ Contenido en español, profesional, específico al negocio
✓ NO uses placeholder text, genera contenido REAL

RESPONDE SOLO CON EL JSON (sin \`\`\`json, sin markdown, solo el objeto)`
        }],
      })
    } catch (apiError) {
      console.error('Anthropic API error:', apiError)
      throw new Error(`Error llamando a la API de Claude: ${apiError instanceof Error ? apiError.message : 'Unknown API error'}`)
    }

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Respuesta inesperada de Claude')
    }

    // Better error logging
    console.log('Claude response:', content.text.substring(0, 500))

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Failed to extract JSON. Response was:', content.text)
      throw new Error(`No se pudo extraer JSON de la respuesta. Respuesta: ${content.text.substring(0, 200)}`)
    }

    let themeData
    try {
      themeData = JSON.parse(jsonMatch[0])

      // CRITICAL DEBUG: Log what we got
      console.log('=== THEME DATA GENERATED ===')
      console.log('Business Name:', themeData.businessName)
      console.log('Has features?', !!themeData.features?.items?.length, 'Count:', themeData.features?.items?.length || 0)
      console.log('Has services?', !!themeData.services?.items?.length, 'Count:', themeData.services?.items?.length || 0)
      console.log('Has stats?', !!themeData.stats?.length, 'Count:', themeData.stats?.length || 0)
      console.log('Has testimonials?', !!themeData.testimonials?.items?.length, 'Count:', themeData.testimonials?.items?.length || 0)
      console.log('Has CTA?', !!themeData.cta)
      console.log('Full data:', JSON.stringify(themeData, null, 2))

    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Attempted to parse:', jsonMatch[0].substring(0, 500))
      throw new Error(`Error al parsear JSON: ${parseError instanceof Error ? parseError.message : 'Unknown'}. Contenido: ${jsonMatch[0].substring(0, 200)}`)
    }

    const themeName = themeData.businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const themeSlug = `${themeName}-wp`
    const functionPrefix = themeSlug.replace(/-/g, '_')

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
Description: ${data.description || data.tagline}
Version: 1.0.0
License: GNU General Public License v2 or later
Text Domain: ${themeSlug}
Tags: full-site-editing, block-patterns, custom-colors, ai-generated, anvilwp
*/`

  // theme.json (same as before)
  files['theme.json'] = JSON.stringify({
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "settings": {
      "appearanceTools": true,
      "useRootPaddingAwareAlignments": true,
      "color": {
        "palette": [
          { "slug": "primary", "name": "Primary", "color": data.colors.primary || "#0A1E3D" },
          { "slug": "accent", "name": "Accent", "color": data.colors.accent || "#3B82F6" },
          { "slug": "secondary", "name": "Secondary", "color": data.colors.secondary || "#8B5CF6" },
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

  // functions.php (same as before)
  files['functions.php'] = `<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('${functionPrefix}-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap',
        [], null
    );
    wp_enqueue_style('${functionPrefix}-theme',
        get_template_directory_uri() . '/assets/css/theme.css',
        [], '1.0.0'
    );
});

add_action('init', function() {
    register_block_pattern_category('${themeSlug}', ['label' => '${data.businessName}']);
});`

  // Enhanced CSS
  files['assets/css/theme.css'] = generateCSS(data)

  // ALL PATTERNS
  console.log('=== GENERATING PATTERNS ===')
  files['patterns/hero.php'] = generateHeroPattern(themeSlug, data)
  console.log('✓ Hero pattern created')

  if (data.features?.items?.length) {
    console.log(`✓ Creating features pattern with ${data.features.items.length} items`)
    files['patterns/features.php'] = generateFeaturesPattern(themeSlug, data.features)
  } else {
    console.log('✗ NO features data, skipping pattern')
  }

  if (data.services?.items?.length) {
    console.log(`✓ Creating services pattern with ${data.services.items.length} items`)
    files['patterns/services.php'] = generateServicesPattern(themeSlug, data.services)
  } else {
    console.log('✗ NO services data, skipping pattern')
  }

  if (data.stats?.length) {
    console.log(`✓ Creating stats pattern with ${data.stats.length} items`)
    files['patterns/stats.php'] = generateStatsPattern(themeSlug, data.stats)
  } else {
    console.log('✗ NO stats data, skipping pattern')
  }

  if (data.testimonials?.items?.length) {
    console.log(`✓ Creating testimonials pattern with ${data.testimonials.items.length} items`)
    files['patterns/testimonials.php'] = generateTestimonialsPattern(themeSlug, data.testimonials)
  } else {
    console.log('✗ NO testimonials data, skipping pattern')
  }

  if (data.cta) {
    console.log('✓ Creating CTA pattern')
    files['patterns/cta.php'] = generateCTAPattern(themeSlug, data.cta)
  } else {
    console.log('✗ NO CTA data, skipping pattern')
  }

  // Template parts
  files['parts/header.html'] = generateHeader(data)
  files['parts/footer.html'] = generateFooter(data)

  // Templates
  files['templates/index.html'] = generateIndexTemplate(themeSlug)
  files['templates/front-page.html'] = generateFrontPageTemplate(themeSlug, data)

  return files
}

function generateCSS(data: any) {
  const primary = data.colors?.primary || '#0A1E3D'
  const accent = data.colors?.accent || '#3B82F6'
  const secondary = data.colors?.secondary || '#8B5CF6'

  return `/* ${data.businessName} Theme Styles - AnvilWP */
:root {
  --c-primary: ${primary};
  --c-accent: ${accent};
  --c-secondary: ${secondary};
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

/* Hero */
.hero-section {
  padding: 120px 40px 80px;
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
  background: linear-gradient(135deg, var(--c-accent), var(--c-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Cards */
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

/* Sections */
.section-padding {
  padding: 80px 0;
}

/* Stats */
.stat-value {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--c-accent), var(--c-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  color: var(--c-muted);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Testimonials */
.testimonial-card {
  background: var(--c-surface);
  border-radius: 12px;
  padding: 24px;
}

/* CTA */
.cta-section {
  background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-secondary) 100%);
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
}

/* Responsive */
@media (max-width: 900px) {
  .hero-section { padding: 80px 24px 60px; }
  .section-padding { padding: 60px 0; }
}

@media (max-width: 600px) {
  .hero-section { padding: 60px 20px 40px; }
  .section-padding { padding: 40px 0; }
  .card { padding: 24px; }
}`
}

function generateHeroPattern(themeSlug: string, data: any) {
  return `<?php
/**
 * Title: Hero Principal
 * Slug: ${themeSlug}/hero
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"hero-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull hero-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">

${data.hero?.badge ? `<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center" style="display:inline-block;padding:8px 16px;background:var(--c-surface);border:1px solid rgba(255,255,255,0.1);border-radius:50px;font-size:0.875rem">✨ ${data.hero.badge}</p>
<!-- /wp:paragraph -->

` : ''}<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2.5rem,5vw,5rem)"}}} -->
<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(2.5rem,5vw,5rem)">${data.hero?.title || data.businessName}<br><span class="gradient-text">${data.tagline}</span></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}}} -->
<p class="has-text-align-center" style="font-size:1.25rem;color:var(--c-muted)">${data.hero?.subtitle || ''}</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
<!-- wp:button {"backgroundColor":"accent"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-background wp-element-button">${data.hero?.cta || 'Comenzar'} →</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->`
}

function generateFeaturesPattern(themeSlug: string, features: any) {
  const items = features.items || []

  return `<?php
/**
 * Title: Features
 * Slug: ${themeSlug}/features
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"60px"}}}} -->
<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:60px">${features.title}</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">
${items.map((item: any) => `
<!-- wp:column -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<!-- wp:group {"className":"card","layout":{"type":"constrained"}} -->
<div class="wp-block-group card is-layout-constrained wp-block-group-is-layout-constrained" style="text-align:center">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"3rem"}}} -->
<p style="font-size:3rem;line-height:1;margin-bottom:16px">${item.icon}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"x-large"} -->
<h3 class="wp-block-heading has-x-large-font-size">${item.title}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="color:var(--c-muted)">${item.description}</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
`).join('')}
</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`
}

function generateServicesPattern(themeSlug: string, services: any) {
  const items = services.items || []

  return `<?php
/**
 * Title: Services
 * Slug: ${themeSlug}/services
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-surface-background-color has-background has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"60px"}}}} -->
<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:60px">${services.title}</h2>
<!-- /wp:heading -->

<!-- wp:columns {"className":"is-style-default"} -->
<div class="wp-block-columns is-style-default is-layout-flex wp-block-columns-is-layout-flex">
${items.map((item: any) => `
<!-- wp:column -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<!-- wp:group {"className":"card","layout":{"type":"constrained"}} -->
<div class="wp-block-group card is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"3rem"}}} -->
<p style="font-size:3rem;line-height:1;margin-bottom:16px">${item.icon}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">${item.title}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="color:var(--c-muted)">${item.description}</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
`).join('')}
</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`
}

function generateStatsPattern(themeSlug: string, stats: any[]) {
  return `<?php
/**
 * Title: Stats
 * Slug: ${themeSlug}/stats
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-around"}} -->
<div class="wp-block-group is-layout-flex wp-block-group-is-layout-flex" style="gap:48px">
${stats.map(stat => `
<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"0","bottom":"0"}}}} -->
<div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:0;padding-bottom:0;text-align:center">
<!-- wp:paragraph {"className":"stat-value"} -->
<p class="stat-value">${stat.value}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"stat-label"} -->
<p class="stat-label">${stat.label}</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
`).join('')}
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

function generateTestimonialsPattern(themeSlug: string, testimonials: any) {
  const items = testimonials.items || []

  return `<?php
/**
 * Title: Testimonials
 * Slug: ${themeSlug}/testimonials
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"60px"}}}} -->
<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:60px">${testimonials.title}</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">
${items.map((item: any) => `
<!-- wp:column -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<!-- wp:group {"className":"testimonial-card","layout":{"type":"constrained"}} -->
<div class="wp-block-group testimonial-card is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:paragraph -->
<p style="color:var(--c-muted);margin-bottom:16px">"${item.quote}"</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>${item.author}</strong><br><span style="color:var(--c-muted);font-size:0.875rem">${item.role}${item.company ? ` - ${item.company}` : ''}</span></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
`).join('')}
</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`
}

function generateCTAPattern(themeSlug: string, cta: any) {
  return `<?php
/**
 * Title: Call to Action
 * Slug: ${themeSlug}/cta
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:group {"className":"cta-section","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group cta-section is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:heading {"textAlign":"center","style":{"color":{"text":"#ffffff"}}} -->
<h2 class="wp-block-heading has-text-align-center" style="color:#ffffff">${cta.title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"rgba(255,255,255,0.9)"},"typography":{"fontSize":"1.125rem"}}} -->
<p class="has-text-align-center" style="color:rgba(255,255,255,0.9);font-size:1.125rem">${cta.subtitle}</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
<!-- wp:button {"style":{"color":{"background":"#ffffff","text":"var(--c-accent)"}}} -->
<div class="wp-block-button"><a class="wp-block-button__link has-background has-text-color wp-element-button" style="background-color:#ffffff;color:var(--c-accent)">${cta.button} →</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

function generateHeader(data: any) {
  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"24px","bottom":"24px"}},"position":{"type":"sticky","top":"0px"}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:24px;padding-bottom:24px">
<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group is-layout-flex wp-block-group-is-layout-flex">
<!-- wp:site-title {"level":3} /-->
<!-- wp:navigation /-->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->`
}

function generateFooter(data: any) {
  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"60px","bottom":"40px"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:60px;padding-bottom:40px">

<!-- wp:columns -->
<div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">

<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:40%">
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">${data.businessName}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="color:var(--c-muted)">${data.tagline || ''}</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->

<!-- wp:column {"width":"30%"} -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:30%">
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Enlaces</h4>
<!-- /wp:heading -->

<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","orientation":"vertical"}} /-->
</div>
<!-- /wp:column -->

<!-- wp:column {"width":"30%"} -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:30%">
<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Contacto</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="color:var(--c-muted)">info@example.com</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"40px","bottom":"20px"}}}} -->
<hr class="wp-block-separator has-alpha-channel-opacity" style="margin-top:40px;margin-bottom:20px"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size" style="color:var(--c-muted)">© ${new Date().getFullYear()} ${data.businessName}. Powered by <a href="https://anvilwp.com">AnvilWP</a></p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`
}

function generateIndexTemplate(themeSlug: string) {
  return `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:query-title {"type":"archive"} /-->
<!-- wp:query {"queryId":0,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-date /-->
<!-- wp:post-excerpt /-->
<!-- /wp:post-template -->
</div>
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
}

function generateFrontPageTemplate(themeSlug: string, data: any) {
  const patterns = []
  patterns.push(`<!-- wp:pattern {"slug":"${themeSlug}/hero"} /-->`)

  if (data.features?.items?.length) patterns.push(`<!-- wp:pattern {"slug":"${themeSlug}/features"} /-->`)
  if (data.services?.items?.length) patterns.push(`<!-- wp:pattern {"slug":"${themeSlug}/services"} /-->`)
  if (data.stats?.length) patterns.push(`<!-- wp:pattern {"slug":"${themeSlug}/stats"} /-->`)
  if (data.testimonials?.items?.length) patterns.push(`<!-- wp:pattern {"slug":"${themeSlug}/testimonials"} /-->`)
  if (data.cta) patterns.push(`<!-- wp:pattern {"slug":"${themeSlug}/cta"} /-->`)

  console.log('=== FRONT-PAGE.HTML TEMPLATE ===')
  console.log(`Including ${patterns.length} patterns:`, patterns.map(p => p.match(/slug":"([^"]+)"/)?.[1]))

  return `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
${patterns.join('\n')}
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
}
