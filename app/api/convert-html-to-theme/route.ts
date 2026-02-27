import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const runtime = 'edge'
export const maxDuration = 60

/**
 * HTML → WordPress FSE Theme Converter
 *
 * Takes HTML (from Gemini, Claude, yenze.io builder, etc.)
 * and converts it to a complete WordPress FSE theme
 */

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json()

    if (!html || typeof html !== 'string') {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      )
    }

    console.log('=== HTML TO WORDPRESS CONVERTER ===')
    console.log('HTML length:', html.length)

    // Parse HTML with cheerio
    const $ = cheerio.load(html)

    // Extract metadata
    const title = $('title').text() || 'Converted Site'
    const themeName = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50) || 'converted-theme'

    const themeSlug = `${themeName}-wp`

    console.log('Theme name:', themeName)
    console.log('Theme slug:', themeSlug)

    // Extract colors from HTML
    const colors = extractColors($, html)
    console.log('Extracted colors:', colors)

    // Extract sections
    const sections = extractSections($)
    console.log('Extracted sections:', Object.keys(sections))

    // Generate WordPress theme files
    const files = generateWordPressTheme(themeSlug, themeName, title, colors, sections, $)

    console.log('Generated files:', Object.keys(files))

    return NextResponse.json({
      success: true,
      themeName: themeSlug,
      message: 'HTML converted successfully to WordPress theme',
      files,
      metadata: {
        title,
        sections: Object.keys(sections),
        colors
      }
    })

  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      {
        error: 'Error al convertir HTML a WordPress theme',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function extractColors($: cheerio.CheerioAPI, html: string) {
  const colors: any = {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    background: '#0d1117',
    surface: '#161b27',
    text: '#e2e8f0'
  }

  // Try to extract from Tailwind config
  const tailwindConfigMatch = html.match(/tailwind\.config\s*=\s*({[\s\S]*?});/)
  if (tailwindConfigMatch) {
    try {
      const configStr = tailwindConfigMatch[1]
      // Extract colors from config
      const primaryMatch = configStr.match(/primary:\s*["']([^"']+)["']/)
      if (primaryMatch) colors.primary = primaryMatch[1]

      const bgMatch = configStr.match(/background(?:-(?:light|dark))?:\s*["']([^"']+)["']/)
      if (bgMatch) colors.background = bgMatch[1]
    } catch (e) {
      console.log('Could not parse Tailwind config:', e)
    }
  }

  // Extract from inline styles
  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || ''
    const bgColorMatch = style.match(/background(?:-color)?:\s*([#\w]+)/)
    if (bgColorMatch && bgColorMatch[1].startsWith('#')) {
      // Could track most common colors here
    }
  })

  return colors
}

function extractSections($: cheerio.CheerioAPI) {
  const sections: any = {}

  // Try to find nav/header
  const nav = $('nav').first()
  if (nav.length) {
    sections.header = {
      html: $.html(nav),
      text: nav.text().trim()
    }
  }

  // Try to find hero section
  const hero = $('section').first()
  if (hero.length) {
    sections.hero = {
      html: $.html(hero),
      heading: hero.find('h1').first().text().trim(),
      subheading: hero.find('p').first().text().trim()
    }
  }

  // Try to find footer
  const footer = $('footer').first()
  if (footer.length) {
    sections.footer = {
      html: $.html(footer),
      text: footer.text().trim()
    }
  }

  // Extract all sections
  $('section').each((i, el) => {
    const section = $(el)
    const heading = section.find('h2, h3').first().text().trim()

    if (heading && i > 0) { // Skip first (hero)
      const key = heading
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .substring(0, 30) || `section-${i}`

      sections[key] = {
        html: $.html(section),
        heading,
        content: section.text().trim().substring(0, 200)
      }
    }
  })

  return sections
}

function generateWordPressTheme(
  themeSlug: string,
  themeName: string,
  title: string,
  colors: any,
  sections: any,
  $: cheerio.CheerioAPI
) {
  const files: Record<string, string> = {}

  // style.css
  files['style.css'] = `/*
Theme Name: ${title}
Theme URI: https://anvilwp.com
Author: AnvilWP Converter
Description: Converted from HTML to WordPress FSE theme by AnvilWP
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.9
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${themeSlug}
Tags: full-site-editing, block-patterns, custom-colors, converted, anvilwp
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
          { "slug": "primary", "color": colors.primary, "name": "Primary" },
          { "slug": "secondary", "color": colors.secondary, "name": "Secondary" },
          { "slug": "background", "color": colors.background, "name": "Background" },
          { "slug": "surface", "color": colors.surface, "name": "Surface" },
          { "slug": "text", "color": colors.text, "name": "Text" }
        ]
      },
      "layout": {
        "contentSize": "1200px",
        "wideSize": "1400px"
      },
      "spacing": {
        "blockGap": "0px",
        "padding": {
          "left": "clamp(20px, 5vw, 80px)",
          "right": "clamp(20px, 5vw, 80px)"
        }
      },
      "typography": {
        "fontFamilies": [
          {
            "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            "slug": "body",
            "name": "Body"
          },
          {
            "fontFamily": "'Plus Jakarta Sans', sans-serif",
            "slug": "heading",
            "name": "Heading"
          }
        ]
      }
    },
    "styles": {
      "color": {
        "background": colors.background,
        "text": colors.text
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
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('${themeSlug}-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap',
        [], null
    );
    wp_enqueue_style('${themeSlug}-theme',
        get_template_directory_uri() . '/assets/css/theme.css',
        [], '1.0.0'
    );
});

add_action('init', function() {
    register_block_pattern_category('${themeSlug}', ['label' => '${title}']);
});`

  // Extract and convert CSS
  let extractedCSS = ''
  $('style').each((_, el) => {
    extractedCSS += $(el).html() + '\n\n'
  })

  files['assets/css/theme.css'] = `/* ${title} - Converted CSS */
${extractedCSS}

/* WordPress Compatibility */
body {
  background: ${colors.background};
  color: ${colors.text};
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
}

.wp-block-button__link {
  background: ${colors.primary};
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.wp-block-button__link:hover {
  transform: translateY(-2px);
}`

  // Generate header from nav
  if (sections.header) {
    files['parts/header.html'] = convertHTMLToWordPressBlocks(sections.header.html, $, 'header')
  } else {
    files['parts/header.html'] = `<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group is-layout-flex wp-block-group-is-layout-flex">
<!-- wp:site-title /-->
<!-- wp:navigation /-->
</div>
<!-- /wp:group -->`
  }

  // Generate footer
  if (sections.footer) {
    files['parts/footer.html'] = convertHTMLToWordPressBlocks(sections.footer.html, $, 'footer')
  } else {
    files['parts/footer.html'] = `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">© 2024 ${title}. Converted by <a href="https://anvilwp.com">AnvilWP</a></p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`
  }

  // Generate hero pattern
  if (sections.hero) {
    files['patterns/hero.php'] = `<?php
/**
 * Title: Hero
 * Slug: ${themeSlug}/hero
 * Categories: ${themeSlug}
 */
?>
${convertHTMLToWordPressBlocks(sections.hero.html, $, 'section')}`
  }

  // Generate other section patterns
  Object.keys(sections).forEach(key => {
    if (!['header', 'hero', 'footer'].includes(key)) {
      const section = sections[key]
      files[`patterns/${key}.php`] = `<?php
/**
 * Title: ${section.heading || key}
 * Slug: ${themeSlug}/${key}
 * Categories: ${themeSlug}
 */
?>
${convertHTMLToWordPressBlocks(section.html, $, 'section')}`
    }
  })

  // Generate front-page.html
  const patternSlugs = Object.keys(sections)
    .filter(k => !['header', 'footer'].includes(k))
    .map(k => `<!-- wp:pattern {"slug":"${themeSlug}/${k === 'hero' ? 'hero' : k}"} /-->`)

  files['templates/front-page.html'] = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">
${patternSlugs.join('\n')}
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`

  // Generate index.html
  files['templates/index.html'] = files['templates/front-page.html']

  return files
}

function convertHTMLToWordPressBlocks(html: string, $: cheerio.CheerioAPI, context: string): string {
  // Parse the HTML fragment
  const fragment = $.load(html)

  // Simple conversion - wrap in group block
  const cleanHTML = fragment.html().trim()

  return `<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<!-- wp:html -->
${cleanHTML}
<!-- /wp:html -->
</div>
<!-- /wp:group -->`
}
