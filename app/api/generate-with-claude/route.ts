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

    // Simplified, more reliable prompt
    let message
    try {
      message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096, // Reduced to avoid issues
        messages: [{
          role: 'user',
          content: `Genera un objeto JSON completo para una web WordPress basada en: "${userMessage}"

Estructura requerida (responde SOLO con JSON válido, sin markdown):

{
  "businessName": "Nombre del negocio",
  "businessType": "Restaurante|Agencia|eCommerce|Blog|SaaS|Portfolio",
  "tagline": "Frase memorable y profesional",
  "description": "Meta description SEO de 160 caracteres",
  "hero": {
    "badge": "Badge opcional con emoji",
    "title": "Título principal impactante",
    "subtitle": "Subtítulo que explica el valor",
    "cta": "Texto del botón de acción"
  },
  "features": {
    "title": "Título de la sección",
    "items": [
      {"icon": "🚀", "title": "Feature", "description": "Beneficio específico"},
      {"icon": "⚡", "title": "Feature", "description": "Beneficio específico"},
      {"icon": "💎", "title": "Feature", "description": "Beneficio específico"},
      {"icon": "🎯", "title": "Feature", "description": "Beneficio específico"}
    ]
  },
  "services": {
    "title": "Título de la sección",
    "items": [
      {"icon": "🔥", "title": "Servicio", "description": "Descripción del servicio"},
      {"icon": "✨", "title": "Servicio", "description": "Descripción del servicio"},
      {"icon": "💼", "title": "Servicio", "description": "Descripción del servicio"}
    ]
  },
  "stats": [
    {"value": "500+", "label": "Métrica"},
    {"value": "98%", "label": "Métrica"},
    {"value": "15+", "label": "Métrica"}
  ],
  "testimonials": {
    "title": "Título de la sección",
    "items": [
      {"quote": "Testimonio", "author": "Nombre", "role": "Cargo", "company": "Empresa"},
      {"quote": "Testimonio", "author": "Nombre", "role": "Cargo", "company": "Empresa"},
      {"quote": "Testimonio", "author": "Nombre", "role": "Cargo", "company": "Empresa"}
    ]
  },
  "cta": {
    "title": "Llamada a la acción",
    "subtitle": "Subtítulo motivador",
    "button": "Texto del botón"
  },
  "colors": {
    "primary": "#0A1E3D",
    "accent": "#3B82F6",
    "secondary": "#8B5CF6"
  }
}

IMPORTANTE: Genera contenido REAL y específico en español. Mínimo 4 features, 3 services, 3 stats, 3 testimonials. Responde SOLO con el objeto JSON.`
        }],
      })
    } catch (apiError: any) {
      console.error('=== ANTHROPIC API ERROR ===')
      console.error('Error object:', apiError)
      console.error('Error type:', apiError?.type)
      console.error('Error message:', apiError?.message)
      console.error('Error status:', apiError?.status)

      // More detailed error message
      let errorMsg = 'Error llamando a la API de Claude'
      if (apiError?.message) {
        errorMsg += `: ${apiError.message}`
      }
      if (apiError?.type === 'invalid_request_error') {
        errorMsg = 'Solicitud inválida a Claude API. Verifica la configuración.'
      }
      if (apiError?.status === 401) {
        errorMsg = 'API key inválida o expirada'
      }
      if (apiError?.status === 429) {
        errorMsg = 'Límite de uso excedido. Intenta de nuevo en unos minutos.'
      }

      throw new Error(errorMsg)
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

  return `/* ${data.businessName} - Premium Theme by AnvilWP */

/* ============================================
   DESIGN SYSTEM - Cruip/Neon Inspired Premium
   ============================================ */

:root {
  /* Colors - Dark Neon Palette */
  --c-primary: ${primary};
  --c-accent: ${accent};
  --c-secondary: ${secondary};
  --c-bg-base: #0d1117;
  --c-bg-elevated: #161b27;
  --c-bg-subtle: #1e2535;
  --c-border: rgba(255, 255, 255, 0.08);
  --c-border-focus: rgba(59, 130, 246, 0.3);

  /* Text Colors */
  --c-text-primary: #e2e8f0;
  --c-text-secondary: #94a3b8;
  --c-text-muted: #64748b;

  /* Spacing Scale - 8px base */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 80px;

  /* Typography Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;
  --text-5xl: 3rem;

  /* Effects */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 10px 40px rgba(59, 130, 246, 0.3);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}

/* ============================================
   BASE STYLES
   ============================================ */

body {
  background: var(--c-bg-base);
  color: var(--c-text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2rem); }

p { line-height: 1.7; }

a {
  color: var(--c-accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--c-secondary);
}

/* ============================================
   HERO SECTION - Premium Landing
   ============================================ */

.hero-section {
  position: relative;
  padding-top: clamp(80px, 15vh, 140px);
  padding-bottom: clamp(60px, 12vh, 100px);
  text-align: center;
  overflow: hidden;
}

/* Radial Glow Effect */
.hero-section::before {
  content: '';
  position: absolute;
  top: -30%;
  left: 50%;
  transform: translateX(-50%);
  width: min(1000px, 90vw);
  height: 400px;
  background: radial-gradient(
    ellipse at center,
    rgba(59, 130, 246, 0.18) 0%,
    rgba(139, 92, 246, 0.12) 35%,
    rgba(244, 114, 182, 0.08) 60%,
    transparent 80%
  );
  z-index: 0;
  pointer-events: none;
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
}

.hero-section > * {
  position: relative;
  z-index: 1;
}

.hero-section .badge {
  display: inline-block;
  padding: 8px 20px;
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  border-radius: 50px;
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
  margin-bottom: var(--space-md);
  transition: all var(--transition-base);
}

.hero-section .badge:hover {
  border-color: var(--c-border-focus);
  background: var(--c-bg-subtle);
}

/* Gradient Text Effect */
.gradient-text {
  background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.hero-section .subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: var(--c-text-secondary);
  max-width: 700px;
  margin: 0 auto var(--space-xl);
  line-height: 1.6;
}

/* ============================================
   BUTTONS - Premium CTAs
   ============================================ */

.wp-block-button__link,
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(to bottom, var(--c-accent), color-mix(in srgb, var(--c-accent) 85%, black));
  color: white !important;
  font-weight: 600;
  font-size: var(--text-base);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-glow);
}

.wp-block-button__link:hover,
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  color: var(--c-text-primary);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  border-color: var(--c-border-focus);
  background: var(--c-bg-subtle);
  box-shadow: var(--shadow-md);
}

/* ============================================
   CARDS - Elevated Surfaces
   ============================================ */

.card,
.feature-card,
.service-card,
.testimonial-card {
  background: var(--c-bg-elevated);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: var(--space-lg);
  transition: all var(--transition-slow);
}

.card:hover,
.feature-card:hover,
.service-card:hover {
  transform: translateY(-6px);
  border-color: var(--c-border-focus);
  box-shadow: var(--shadow-lg);
  background: var(--c-bg-subtle);
}

.card .icon,
.feature-card .icon,
.service-card .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  font-size: 2rem;
  margin-bottom: var(--space-md);
  background: radial-gradient(circle at 30% 30%,
    rgba(59, 130, 246, 0.15),
    rgba(139, 92, 246, 0.08)
  );
  border-radius: 50%;
  border: 1px solid var(--c-border);
}

.card h3,
.feature-card h3,
.service-card h3 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-sm);
  color: var(--c-text-primary);
}

.card p,
.feature-card p,
.service-card p {
  color: var(--c-text-secondary);
  font-size: var(--text-base);
  line-height: 1.7;
}

/* ============================================
   SECTIONS - Layout & Spacing
   ============================================ */

.section-padding {
  padding-top: var(--space-3xl);
  padding-bottom: var(--space-3xl);
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  text-align: center;
  margin-bottom: var(--space-xl);
  font-weight: 800;
}

.section-subtitle {
  text-align: center;
  font-size: var(--text-xl);
  color: var(--c-text-secondary);
  max-width: 600px;
  margin: 0 auto var(--space-2xl);
}

/* ============================================
   GRID LAYOUTS
   ============================================ */

.features-grid,
.services-grid,
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .features-grid,
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid,
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ============================================
   STATS SECTION - Bold Numbers
   ============================================ */

.stats-section {
  background: var(--c-bg-elevated);
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2xl);
  text-align: center;
}

.stat-item {
  padding: var(--space-md);
}

.stat-value {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: var(--space-xs);
  background: linear-gradient(135deg, var(--c-accent), var(--c-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: var(--c-text-secondary);
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ============================================
   TESTIMONIALS
   ============================================ */

.testimonial-card {
  padding: var(--space-lg);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.testimonial-quote {
  font-size: var(--text-lg);
  line-height: 1.7;
  font-style: italic;
  color: var(--c-text-primary);
  flex: 1;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--c-border);
}

.testimonial-author-name {
  font-weight: 600;
  color: var(--c-text-primary);
}

.testimonial-author-role {
  font-size: var(--text-sm);
  color: var(--c-text-secondary);
}

/* ============================================
   CTA SECTION - Gradient Background
   ============================================ */

.cta-section {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--c-accent) 20%, var(--c-bg-base)),
    color-mix(in srgb, var(--c-secondary) 20%, var(--c-bg-base))
  );
  border: 1px solid var(--c-border);
  border-radius: 24px;
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
  pointer-events: none;
}

.cta-section::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12), transparent 70%);
  pointer-events: none;
}

.cta-section > * {
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: var(--space-md);
}

.cta-subtitle {
  font-size: var(--text-xl);
  color: var(--c-text-secondary);
  margin-bottom: var(--space-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 900px) {
  :root {
    --space-3xl: 60px;
    --space-2xl: 48px;
  }

  .hero-section {
    padding-top: 80px;
    padding-bottom: 60px;
  }

  .card,
  .feature-card,
  .service-card {
    padding: var(--space-md);
  }
}

@media (max-width: 600px) {
  :root {
    --space-3xl: 40px;
    --space-2xl: 32px;
  }

  .hero-section {
    padding-top: 60px;
    padding-bottom: 40px;
  }

  .stats-grid {
    gap: var(--space-xl);
  }

  .cta-section {
    padding: var(--space-xl) var(--space-md);
  }
}

/* ============================================
   UTILITIES
   ============================================ */

.text-center { text-align: center; }
.text-gradient { composes: gradient-text; }
.mb-0 { margin-bottom: 0; }
.mt-0 { margin-top: 0; }`
}

function generateHeroPattern(themeSlug: string, data: any) {
  return `<?php
/**
 * Title: Hero Principal - Premium Cruip Style
 * Slug: ${themeSlug}/hero
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"hero-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull hero-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">

${data.hero?.badge ? `<!-- wp:paragraph {"align":"center","className":"badge"} -->
<p class="has-text-align-center badge">${data.hero.badge}</p>
<!-- /wp:paragraph -->

` : ''}<!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="wp-block-heading has-text-align-center">${data.hero?.title || data.businessName}<br><span class="gradient-text">${data.tagline}</span></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","className":"subtitle"} -->
<p class="has-text-align-center subtitle">${data.hero?.subtitle || ''}</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"blockGap":"16px"}}} -->
<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
<!-- wp:button {"className":"btn-primary"} -->
<div class="wp-block-button"><a class="wp-block-button__link btn-primary wp-element-button">${data.hero?.cta || 'Comenzar'} →</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"btn-secondary"} -->
<div class="wp-block-button"><a class="wp-block-button__link btn-secondary wp-element-button">Saber más</a></div>
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
 * Title: Features - Premium Grid
 * Slug: ${themeSlug}/features
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","className":"section-title"} -->
<h2 class="wp-block-heading has-text-align-center section-title">${features.title}</h2>
<!-- /wp:heading -->

<!-- wp:columns {"className":"features-grid"} -->
<div class="wp-block-columns features-grid is-layout-flex wp-block-columns-is-layout-flex">
${items.map((item: any) => `
<!-- wp:column -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<!-- wp:group {"className":"feature-card","layout":{"type":"constrained"}} -->
<div class="wp-block-group feature-card is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:html -->
<div class="icon">${item.icon}</div>
<!-- /wp:html -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">${item.title}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${item.description}</p>
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
 * Title: Services - Premium Cards
 * Slug: ${themeSlug}/services
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","className":"section-title"} -->
<h2 class="wp-block-heading has-text-align-center section-title">${services.title}</h2>
<!-- /wp:heading -->

<!-- wp:columns {"className":"services-grid"} -->
<div class="wp-block-columns services-grid is-layout-flex wp-block-columns-is-layout-flex">
${items.map((item: any) => `
<!-- wp:column -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<!-- wp:group {"className":"service-card","layout":{"type":"constrained"}} -->
<div class="wp-block-group service-card is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:html -->
<div class="icon">${item.icon}</div>
<!-- /wp:html -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">${item.title}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${item.description}</p>
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
 * Title: Stats - Key Metrics
 * Slug: ${themeSlug}/stats
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding stats-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding stats-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:html -->
<div class="stats-grid">
${stats.map(stat => `
  <div class="stat-item">
    <div class="stat-value">${stat.value}</div>
    <div class="stat-label">${stat.label}</div>
  </div>
`).join('')}
</div>
<!-- /wp:html -->

</div>
<!-- /wp:group -->`
}

function generateTestimonialsPattern(themeSlug: string, testimonials: any) {
  const items = testimonials.items || []

  return `<?php
/**
 * Title: Testimonials - Client Reviews
 * Slug: ${themeSlug}/testimonials
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","className":"section-title"} -->
<h2 class="wp-block-heading has-text-align-center section-title">${testimonials.title}</h2>
<!-- /wp:heading -->

<!-- wp:columns {"className":"testimonials-grid"} -->
<div class="wp-block-columns testimonials-grid is-layout-flex wp-block-columns-is-layout-flex">
${items.map((item: any) => `
<!-- wp:column -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
<!-- wp:group {"className":"testimonial-card","layout":{"type":"constrained"}} -->
<div class="wp-block-group testimonial-card is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:paragraph {"className":"testimonial-quote"} -->
<p class="testimonial-quote">"${item.quote}"</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<div class="testimonial-author">
  <div class="testimonial-author-name">${item.author}</div>
  <div class="testimonial-author-role">${item.role}${item.company ? ` · ${item.company}` : ''}</div>
</div>
<!-- /wp:html -->
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
 * Title: Call to Action - Premium Gradient
 * Slug: ${themeSlug}/cta
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"section-padding","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull section-padding has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:group {"className":"cta-section","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group cta-section is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:heading {"textAlign":"center","className":"cta-title"} -->
<h2 class="wp-block-heading has-text-align-center cta-title">${cta.title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","className":"cta-subtitle"} -->
<p class="has-text-align-center cta-subtitle">${cta.subtitle}</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
<!-- wp:button {"className":"btn-primary"} -->
<div class="wp-block-button"><a class="wp-block-button__link btn-primary wp-element-button">${cta.button} →</a></div>
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
