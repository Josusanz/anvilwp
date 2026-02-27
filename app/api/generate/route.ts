import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.businessName || !data.businessType || !data.sections || data.sections.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre de negocio, tipo y secciones' },
        { status: 400 }
      )
    }

    // Generate theme files using the data
    const themeName = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const themeSlug = `${themeName}-wp`

    // Build the theme structure
    const themeFiles = generateThemeFiles({
      ...data,
      themeName,
      themeSlug,
    })

    // Return the theme files as JSON (client will create zip)
    return NextResponse.json({
      success: true,
      themeName: themeSlug,
      files: themeFiles,
    })
  } catch (error) {
    console.error('Error generating theme:', error)
    return NextResponse.json(
      { error: 'Error al generar el theme' },
      { status: 500 }
    )
  }
}

function generateThemeFiles(data: any) {
  const { businessName, businessType, tagline, sections, primaryCta, style, themeName, themeSlug } = data

  const files: Record<string, string> = {}

  // style.css - Theme metadata
  files['style.css'] = `/*
Theme Name: ${businessName}
Theme URI: https://${themeName}.com
Author: ${businessName}
Description: Theme profesional generado con AnvilWP para ${businessType}
Version: 1.0.0
Requires at least: 6.4
Tested up to: 6.5
Requires PHP: 8.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${themeSlug}
*/`

  // theme.json - FSE configuration
  files['theme.json'] = JSON.stringify({
    "$schema": "https://schemas.wp.org/wp/6.4/theme.json",
    "version": 2,
    "settings": {
      "appearanceTools": true,
      "useRootPaddingAwareAlignments": true,
      "layout": {
        "contentSize": "1200px",
        "wideSize": "1400px"
      },
      "color": {
        "palette": [
          { "slug": "primary", "color": "#0A1E3D", "name": "Primary" },
          { "slug": "accent", "color": "#3B82F6", "name": "Accent" },
          { "slug": "accent2", "color": "#8B5CF6", "name": "Accent 2" },
          { "slug": "background", "color": "#0d1117", "name": "Background" },
          { "slug": "surface", "color": "#161b27", "name": "Surface" },
          { "slug": "text", "color": "#e2e8f0", "name": "Text" }
        ]
      },
      "typography": {
        "fontFamilies": [
          {
            "fontFamily": "'Plus Jakarta Sans', sans-serif",
            "slug": "jakarta",
            "name": "Plus Jakarta Sans"
          },
          {
            "fontFamily": "'Inter', sans-serif",
            "slug": "inter",
            "name": "Inter"
          }
        ]
      }
    },
    "styles": {
      "spacing": {
        "blockGap": "0px",
        "padding": {
          "left": "clamp(20px, 5vw, 80px)",
          "right": "clamp(20px, 5vw, 80px)"
        }
      },
      "color": {
        "background": "var(--wp--preset--color--background)",
        "text": "var(--wp--preset--color--text)"
      },
      "typography": {
        "fontFamily": "var(--wp--preset--font-family--inter)"
      }
    }
  }, null, 2)

  // functions.php - Core functionality
  files['functions.php'] = generateFunctionsPHP(data)

  // assets/css/theme.css
  files['assets/css/theme.css'] = generateThemeCSS(data)

  // assets/js/theme.js
  files['assets/js/theme.js'] = generateThemeJS(themeSlug)

  // patterns - Generate based on selected sections
  if (sections.includes('Hero')) {
    files['patterns/hero.php'] = generateHeroPattern(data)
  }
  if (sections.includes('Servicios') || sections.includes('Services')) {
    files['patterns/services.php'] = generateServicesPattern(data)
  }
  if (sections.includes('Stats/Números')) {
    files['patterns/stats.php'] = generateStatsPattern(data)
  }
  if (sections.includes('Testimonios')) {
    files['patterns/testimonials.php'] = generateTestimonialsPattern(data)
  }
  if (sections.includes('Contacto')) {
    files['patterns/contact.php'] = generateContactPattern(data)
  }
  if (sections.includes('CTA')) {
    files['patterns/cta.php'] = generateCTAPattern(data)
  }

  // parts/header.html
  files['parts/header.html'] = generateHeader(data)

  // parts/footer.html
  files['parts/footer.html'] = generateFooter(data)

  // templates/index.html
  files['templates/index.html'] = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main"} -->
<main class="wp-block-group">
  <!-- wp:post-content /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`

  // templates/front-page.html
  files['templates/front-page.html'] = generateFrontPage(sections)

  // README.md
  files['README.md'] = generateReadme(data)

  return files
}

function generateFunctionsPHP(data: any) {
  const { themeSlug } = data
  return `<?php
/**
 * ${data.businessName} Theme
 * Generated with AnvilWP - https://anvilwp.com
 */

if (!defined('ABSPATH')) exit;

// Enqueue styles and scripts
add_action('wp_enqueue_scripts', function() {
    // Google Fonts
    wp_enqueue_style('${themeSlug}-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap', [], null);

    // Theme styles
    wp_enqueue_style('${themeSlug}-theme', get_template_directory_uri() . '/assets/css/theme.css', [], '1.0.0');

    // Theme scripts
    wp_enqueue_script('${themeSlug}-js', get_template_directory_uri() . '/assets/js/theme.js', [], '1.0.0', true);

    // Localize script
    wp_localize_script('${themeSlug}-js', '${themeSlug}Data', [
        'restUrl' => rest_url('${themeSlug}/v1/'),
        'nonce' => wp_create_nonce('wp_rest'),
    ]);
});

// Register block patterns category
add_action('init', function() {
    register_block_pattern_category('${themeSlug}', [
        'label' => __('${data.businessName}', '${themeSlug}'),
    ]);
});

// Contact form REST API endpoint
add_action('rest_api_init', function() {
    register_rest_route('${themeSlug}/v1', '/contact', [
        'methods' => 'POST',
        'callback' => '${themeSlug}_handle_contact_form',
        'permission_callback' => '__return_true',
    ]);
});

function ${themeSlug}_handle_contact_form($request) {
    $params = $request->get_params();

    // Validate
    if (empty($params['name']) || empty($params['email']) || empty($params['message'])) {
        return new WP_Error('missing_fields', 'Todos los campos son requeridos', ['status' => 400]);
    }

    // Honeypot check
    if (!empty($params['website'])) {
        return new WP_REST_Response(['success' => true], 200);
    }

    // Send email
    $to = get_option('admin_email');
    $subject = 'Nuevo contacto desde ' . get_bloginfo('name');
    $message = "Nombre: {$params['name']}\\n";
    $message .= "Email: {$params['email']}\\n";
    if (!empty($params['phone'])) {
        $message .= "Teléfono: {$params['phone']}\\n";
    }
    $message .= "\\nMensaje:\\n{$params['message']}";

    $sent = wp_mail($to, $subject, $message);

    if ($sent) {
        return new WP_REST_Response(['success' => true, 'message' => 'Mensaje enviado correctamente'], 200);
    } else {
        return new WP_Error('email_failed', 'Error al enviar el mensaje', ['status' => 500]);
    }
}

// SEO Meta Tags
add_action('wp_head', function() {
    if (is_front_page()) {
        echo '<meta property="og:type" content="website" />' . "\\n";
        echo '<meta property="og:title" content="' . esc_attr(get_bloginfo('name')) . '" />' . "\\n";
        echo '<meta property="og:description" content="' . esc_attr(get_bloginfo('description')) . '" />' . "\\n";
        echo '<meta property="og:url" content="' . esc_url(home_url('/')) . '" />' . "\\n";
        echo '<meta name="twitter:card" content="summary_large_image" />' . "\\n";
    }
}, 5);

// Remove WordPress bloat
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
`
}

function generateThemeCSS(data: any) {
  return `/* Theme CSS for ${data.businessName} */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --c-primary: #0A1E3D;
  --c-accent: #3B82F6;
  --c-accent2: #8B5CF6;
  --c-bg: #0d1117;
  --c-surface: #161b27;
  --c-card: #1e2535;
  --c-text: #e2e8f0;
  --c-muted: #94a3b8;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--c-bg);
  color: var(--c-text);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding-top: 120px;
  padding-bottom: 80px;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(59,130,246,.12) 0%, rgba(139,92,246,.08) 40%, transparent 70%);
  pointer-events: none;
}

/* Services Cards */
.service-card {
  background: var(--c-card);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Buttons */
.btn-primary {
  background: linear-gradient(to top, #2563eb, #3b82f6);
  color: white;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
  box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(to top, #1d4ed8, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 15px 50px -10px rgba(59, 130, 246, 0.5);
  color: white;
}

/* Responsive */
@media (max-width: 900px) {
  .hero-section {
    padding-top: 80px;
    padding-bottom: 60px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding-top: 60px;
    padding-bottom: 40px;
  }
}
`
}

function generateThemeJS(themeSlug: string) {
  return `// ${themeSlug} Theme JavaScript
(function() {
  'use strict';

  // Contact Form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(window.${themeSlug}Data.restUrl + 'contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          alert('¡Mensaje enviado correctamente!');
          this.reset();
        } else {
          alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el mensaje.');
      }
    });
  }

  // Cookie Consent
  if (!localStorage.getItem('cookies-accepted')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = \`
      <div class="cookie-content">
        <p>Usamos cookies para mejorar tu experiencia.</p>
        <button class="btn-accept">Aceptar</button>
      </div>
    \`;
    document.body.appendChild(banner);

    banner.querySelector('.btn-accept').addEventListener('click', function() {
      localStorage.setItem('cookies-accepted', 'true');
      banner.remove();
    });
  }
})();
`
}

function generateHeroPattern(data: any) {
  return `<?php
/**
 * Title: Hero Section
 * Slug: ${data.themeSlug}/hero
 * Categories: ${data.themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"hero-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull hero-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
  <!-- wp:heading {"textAlign":"center","level":1} -->
  <h1 class="wp-block-heading has-text-align-center">${data.businessName}</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">${data.tagline || 'Tu tagline aquí'}</p>
  <!-- /wp:paragraph -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
    <!-- wp:button -->
    <div class="wp-block-button"><a class="wp-block-button__link wp-element-button">${data.primaryCta || 'Empezar'}</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`
}

function generateServicesPattern(data: any) {
  return `<?php
/**
 * Title: Services Section
 * Slug: ${data.themeSlug}/services
 * Categories: ${data.themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:heading {"textAlign":"center"} -->
  <h2 class="wp-block-heading has-text-align-center">Nuestros Servicios</h2>
  <!-- /wp:heading -->

  <!-- wp:columns -->
  <div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">
    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:heading {"level":3} -->
      <h3 class="wp-block-heading">Servicio 1</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Descripción del servicio</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:heading {"level":3} -->
      <h3 class="wp-block-heading">Servicio 2</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Descripción del servicio</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:heading {"level":3} -->
      <h3 class="wp-block-heading">Servicio 3</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Descripción del servicio</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`
}

function generateStatsPattern(data: any) {
  return `<?php
/**
 * Title: Stats Section
 * Slug: ${data.themeSlug}/stats
 * Categories: ${data.themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:columns -->
  <div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">
    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow has-text-align-center">
      <!-- wp:heading {"level":3} -->
      <h3 class="wp-block-heading">500+</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Clientes</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow has-text-align-center">
      <!-- wp:heading {"level":3} -->
      <h3 class="wp-block-heading">10+</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Años</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow has-text-align-center">
      <!-- wp:heading {"level":3} -->
      <h3 class="wp-block-heading">98%</h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>Satisfacción</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`
}

function generateTestimonialsPattern(data: any) {
  return `<?php
/**
 * Title: Testimonials Section
 * Slug: ${data.themeSlug}/testimonials
 * Categories: ${data.themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:heading {"textAlign":"center"} -->
  <h2 class="wp-block-heading has-text-align-center">Testimonios</h2>
  <!-- /wp:heading -->

  <!-- wp:columns -->
  <div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">
    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:paragraph -->
      <p>"Excelente servicio y profesionalidad."</p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph -->
      <p><strong>- Cliente 1</strong></p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:paragraph -->
      <p>"Superaron nuestras expectativas."</p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph -->
      <p><strong>- Cliente 2</strong></p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:group -->`
}

function generateContactPattern(data: any) {
  return `<?php
/**
 * Title: Contact Form
 * Slug: ${data.themeSlug}/contact
 * Categories: ${data.themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:heading {"textAlign":"center"} -->
  <h2 class="wp-block-heading has-text-align-center">Contacto</h2>
  <!-- /wp:heading -->

  <!-- wp:html -->
  <form class="contact-form" style="max-width:600px;margin:0 auto">
    <input type="text" name="name" placeholder="Nombre" required style="width:100%;padding:12px;margin-bottom:16px;background:#1e2535;border:1px solid #2d3548;border-radius:8px;color:#e2e8f0">
    <input type="email" name="email" placeholder="Email" required style="width:100%;padding:12px;margin-bottom:16px;background:#1e2535;border:1px solid #2d3548;border-radius:8px;color:#e2e8f0">
    <input type="tel" name="phone" placeholder="Teléfono (opcional)" style="width:100%;padding:12px;margin-bottom:16px;background:#1e2535;border:1px solid #2d3548;border-radius:8px;color:#e2e8f0">
    <textarea name="message" placeholder="Mensaje" required rows="5" style="width:100%;padding:12px;margin-bottom:16px;background:#1e2535;border:1px solid #2d3548;border-radius:8px;color:#e2e8f0"></textarea>
    <input type="text" name="website" style="display:none">
    <button type="submit" class="btn-primary" style="width:100%">Enviar Mensaje</button>
  </form>
  <!-- /wp:html -->
</div>
<!-- /wp:group -->`
}

function generateCTAPattern(data: any) {
  return `<?php
/**
 * Title: CTA Section
 * Slug: ${data.themeSlug}/cta
 * Categories: ${data.themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:heading {"textAlign":"center"} -->
  <h2 class="wp-block-heading has-text-align-center">¿Listo para empezar?</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">Contáctanos hoy y descubre cómo podemos ayudarte</p>
  <!-- /wp:paragraph -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
    <!-- wp:button -->
    <div class="wp-block-button"><a class="wp-block-button__link wp-element-button">${data.primaryCta || 'Contactar'}</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`
}

function generateHeader(data: any) {
  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"20px","bottom":"20px"}}},"layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-flex wp-block-group-is-layout-flex" style="padding-top:20px;padding-bottom:20px">
  <!-- wp:site-title /-->

  <!-- wp:navigation /-->
</div>
<!-- /wp:group -->`
}

function generateFooter(data: any) {
  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:40px;padding-bottom:40px">
  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">© 2026 ${data.businessName}. Generado con <a href="https://anvilwp.com">AnvilWP</a></p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`
}

function generateFrontPage(sections: string[]) {
  let content = '<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n\n'
  content += '<!-- wp:group {"tagName":"main"} -->\n'
  content += '<main class="wp-block-group">\n'

  sections.forEach(section => {
    const sectionSlug = section.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    content += `  <!-- wp:pattern {"slug":"THEME_SLUG/${sectionSlug}"} /-->\n\n`
  })

  content += '</main>\n'
  content += '<!-- /wp:group -->\n\n'
  content += '<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->'

  return content
}

function generateReadme(data: any) {
  return `# ${data.businessName} - WordPress Theme

Theme profesional generado con **AnvilWP** - https://anvilwp.com

## Instalación

1. Sube el theme a \`wp-content/themes/\`
2. Activa el theme en WordPress
3. Personaliza el contenido desde el editor

## Características

- ✅ Dark neon design
- ✅ Responsive design
- ✅ SEO optimizado
- ✅ Formulario de contacto integrado
- ✅ Sin plugins necesarios

## Personalización

- **Colores**: Edita \`assets/css/theme.css\`
- **Contenido**: Usa el editor de bloques de WordPress
- **Patterns**: En \`patterns/\`

## Soporte

Documentación: https://github.com/Josusanz/anvilwp

---

Generado con ❤️ por [AnvilWP](https://anvilwp.com)
`
}
