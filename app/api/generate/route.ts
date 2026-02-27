import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.businessName || !data.businessType || !data.sections || data.sections.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const themeName = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const themeSlug = `${themeName}-wp`

    // Get business-specific content
    const businessContent = getBusinessContent(data.businessType, data.businessName, data.tagline)

    const themeFiles = generateThemeFiles({
      ...data,
      themeName,
      themeSlug,
      businessContent,
    })

    return NextResponse.json({
      success: true,
      themeName: themeSlug,
      files: themeFiles,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al generar el theme' },
      { status: 500 }
    )
  }
}

function getBusinessContent(type: string, name: string, tagline?: string) {
  const contents: Record<string, any> = {
    'Restaurante': {
      hero: {
        title: `${name}`,
        subtitle: tagline || 'Experiencia gastronómica única en cada plato',
        cta: 'Reservar Mesa',
        badge: 'Nuevo menú de temporada',
      },
      services: [
        { title: 'Menú Degustación', desc: 'Experiencia completa con maridaje incluido', icon: 'chef' },
        { title: 'Eventos Privados', desc: 'Salón privado para celebraciones especiales', icon: 'calendar' },
        { title: 'Carta de Vinos', desc: 'Selección premium de bodegas nacionales', icon: 'wine' },
        { title: 'Terraza', desc: 'Ambiente al aire libre en pleno centro', icon: 'sun' },
        { title: 'Menú del Día', desc: 'Opciones variadas a precio especial', icon: 'menu' },
        { title: 'Take Away', desc: 'Para llevar o delivery a domicilio', icon: 'delivery' },
      ],
      stats: [
        { number: '15+', label: 'Años de experiencia' },
        { number: '50K+', label: 'Clientes satisfechos' },
        { number: '4.9/5', label: 'Valoración media' },
        { number: '200+', label: 'Platos en carta' },
      ],
      testimonials: [
        { text: 'La mejor experiencia gastronómica que he tenido. Cada plato es una obra de arte.', author: 'María González', role: 'Cliente habitual' },
        { text: 'Ambiente acogedor y comida espectacular. Volveremos sin duda.', author: 'Carlos Ruiz', role: 'Celebró su aniversario' },
        { text: 'El menú degustación superó todas mis expectativas. Simplemente perfecto.', author: 'Ana Martín', role: 'Foodie' },
      ],
    },
    'Agencia': {
      hero: {
        title: `${name}`,
        subtitle: tagline || 'Transformamos tu negocio con estrategias digitales que funcionan',
        cta: 'Empieza Gratis',
        badge: 'Consultoría gratuita',
      },
      services: [
        { title: 'Estrategia Digital', desc: 'Plan personalizado para alcanzar tus objetivos', icon: 'strategy' },
        { title: 'Performance Marketing', desc: 'Campañas optimizadas para máximo ROI', icon: 'chart' },
        { title: 'Diseño UX/UI', desc: 'Interfaces que convierten visitantes en clientes', icon: 'design' },
        { title: 'SEO & SEM', desc: 'Visibilidad garantizada en buscadores', icon: 'search' },
        { title: 'Automatización', desc: 'Workflows que ahorran tiempo y dinero', icon: 'automation' },
        { title: 'Analytics', desc: 'Datos accionables para decisiones inteligentes', icon: 'analytics' },
      ],
      stats: [
        { number: '200+', label: 'Clientes activos' },
        { number: '450%', label: 'ROI promedio' },
        { number: '8+', label: 'Años en el sector' },
        { number: '50+', label: 'Proyectos al año' },
      ],
      testimonials: [
        { text: 'Aumentamos nuestras ventas en un 300% en solo 6 meses. Increíble trabajo.', author: 'Laura Sánchez', role: 'CEO, TechStartup' },
        { text: 'Su estrategia de contenidos transformó completamente nuestra presencia digital.', author: 'Roberto Torres', role: 'Director Marketing' },
        { text: 'Profesionales, creativos y con resultados medibles. Lo mejor de lo mejor.', author: 'Isabel Fernández', role: 'Fundadora, EcoShop' },
      ],
    },
    'eCommerce': {
      hero: {
        title: `${name}`,
        subtitle: tagline || 'Tu tienda online favorita con envío gratis en 24h',
        cta: 'Ver Catálogo',
        badge: '30% descuento en primera compra',
      },
      services: [
        { title: 'Envío Gratis', desc: 'En pedidos superiores a 50€ a toda España', icon: 'shipping' },
        { title: 'Devolución 30 días', desc: 'Sin preguntas, reembolso completo garantizado', icon: 'return' },
        { title: 'Pago Seguro', desc: 'SSL certificado y múltiples métodos de pago', icon: 'security' },
        { title: 'Atención 24/7', desc: 'Soporte via chat, email y teléfono siempre', icon: 'support' },
        { title: 'Programa Fidelidad', desc: 'Puntos y descuentos exclusivos para clientes', icon: 'loyalty' },
        { title: 'Productos Premium', desc: 'Calidad verificada y garantía extendida', icon: 'premium' },
      ],
      stats: [
        { number: '50K+', label: 'Productos' },
        { number: '4.8/5', label: 'Satisfacción' },
        { number: '24h', label: 'Envío Express' },
        { number: '100K+', label: 'Clientes felices' },
      ],
      testimonials: [
        { text: 'Compra rápida, envío súper rápido y producto perfecto. Repetiré seguro.', author: 'Pedro López', role: 'Cliente verificado' },
        { text: 'La atención al cliente es excepcional. Resolvieron mi duda en minutos.', author: 'Carmen Díaz', role: 'Cliente desde 2023' },
        { text: 'Mejor relación calidad-precio imposible. Mi tienda online de confianza.', author: 'Javier Mora', role: 'Cliente VIP' },
      ],
    },
    'SaaS': {
      hero: {
        title: `${name}`,
        subtitle: tagline || 'La plataforma todo-en-uno que tu equipo necesita',
        cta: 'Prueba Gratis 14 Días',
        badge: 'Sin tarjeta de crédito',
      },
      services: [
        { title: 'Gestión de Proyectos', desc: 'Organiza tareas y equipos en un solo lugar', icon: 'projects' },
        { title: 'Colaboración Real-time', desc: 'Trabaja en equipo sin fricciones', icon: 'collaboration' },
        { title: 'Automatizaciones', desc: 'Ahorra horas con workflows inteligentes', icon: 'automation' },
        { title: 'Reportes Avanzados', desc: 'Insights accionables en tiempo real', icon: 'reports' },
        { title: 'Integraciones', desc: 'Conecta con +500 herramientas', icon: 'integrations' },
        { title: 'API Abierta', desc: 'Construye soluciones personalizadas', icon: 'api' },
      ],
      stats: [
        { number: '10K+', label: 'Empresas' },
        { number: '99.9%', label: 'Uptime' },
        { number: '50M+', label: 'Tareas gestionadas' },
        { number: '4.9/5', label: 'Rating G2' },
      ],
      testimonials: [
        { text: 'Redujo nuestro tiempo de gestión en un 60%. No podemos trabajar sin ella.', author: 'Sofía Ramírez', role: 'PM, Acme Corp' },
        { text: 'La mejor inversión que hemos hecho. ROI positivo desde el primer mes.', author: 'Miguel Ángel', role: 'CEO, StartupXYZ' },
        { text: 'Intuitiva, potente y con un soporte excepcional. Altamente recomendable.', author: 'Elena Castro', role: 'COO, TechCo' },
      ],
    },
  }

  return contents[type] || contents['Agencia']
}

function generateThemeFiles(data: any) {
  const { businessName, businessType, tagline, sections, primaryCta, themeName, themeSlug, businessContent } = data
  const functionPrefix = themeSlug.replace(/-/g, '_')

  const files: Record<string, string> = {}

  // style.css
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
Tags: block-theme, full-site-editing, dark-theme, business
*/`

  // theme.json
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

  // functions.php
  files['functions.php'] = `<?php
/**
 * ${businessName} Theme
 * Generated with AnvilWP - https://anvilwp.com
 */

if (!defined('ABSPATH')) exit;

add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('${themeSlug}-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap', [], null);
    wp_enqueue_style('${themeSlug}-theme', get_template_directory_uri() . '/assets/css/theme.css', [], '1.0.0');
    wp_enqueue_script('${themeSlug}-js', get_template_directory_uri() . '/assets/js/theme.js', [], '1.0.0', true);
    wp_localize_script('${themeSlug}-js', '${functionPrefix}Data', [
        'restUrl' => rest_url('${themeSlug}/v1/'),
        'nonce' => wp_create_nonce('wp_rest'),
    ]);
});

add_action('init', function() {
    register_block_pattern_category('${themeSlug}', [
        'label' => __('${businessName}', '${themeSlug}'),
    ]);
});

add_action('rest_api_init', function() {
    register_rest_route('${themeSlug}/v1', '/contact', [
        'methods' => 'POST',
        'callback' => '${functionPrefix}_handle_contact_form',
        'permission_callback' => '__return_true',
    ]);
});

function ${functionPrefix}_handle_contact_form($request) {
    $params = $request->get_params();
    if (empty($params['name']) || empty($params['email']) || empty($params['message'])) {
        return new WP_Error('missing_fields', 'Campos requeridos', ['status' => 400]);
    }
    if (!empty($params['website'])) {
        return new WP_REST_Response(['success' => true], 200);
    }
    $to = get_option('admin_email');
    $subject = 'Contacto desde ' . get_bloginfo('name');
    $message = "Nombre: {$params['name']}\\nEmail: {$params['email']}\\n\\n{$params['message']}";
    $sent = wp_mail($to, $subject, $message);
    return $sent ? new WP_REST_Response(['success' => true], 200) : new WP_Error('failed', 'Error', ['status' => 500]);
}

add_action('wp_head', function() {
    if (is_front_page()) {
        echo '<meta property="og:title" content="' . esc_attr(get_bloginfo('name')) . '" />\\n';
        echo '<meta property="og:description" content="' . esc_attr(get_bloginfo('description')) . '" />\\n';
    }
}, 5);

remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'print_emoji_detection_script', 7);
`

  // assets/css/theme.css - PROFESSIONAL CRUIP/NEON STYLE
  files['assets/css/theme.css'] = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --c-primary: #0A1E3D;
  --c-accent: #3B82F6;
  --c-accent2: #8B5CF6;
  --c-bg: #0d1117;
  --c-surface: #161b27;
  --c-card: #1e2535;
  --c-border: rgba(255,255,255,0.08);
  --c-text: #e2e8f0;
  --c-muted: #94a3b8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', sans-serif;
  background: var(--c-bg);
  color: var(--c-text);
  line-height: 1.6;
}

h1,h2,h3,h4,h5,h6 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; line-height: 1.2; }
h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2rem); }

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(13,17,23,0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--c-border);
  padding-top: 20px;
  padding-bottom: 20px;
}

.hero-section {
  position: relative;
  padding-top: 120px;
  padding-bottom: 80px;
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
  background: radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 40%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.hero-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.3;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 50px;
  font-size: 0.875rem;
  margin-bottom: 24px;
  position: relative;
}

.hero-badge::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3));
  border-radius: 50px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

.hero-badge:hover::before { opacity: 1; }

.gradient-text {
  background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.service-card, .stat-card, .testimonial-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.service-card:hover, .testimonial-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59,130,246,0.3);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1);
}

.service-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(59,130,246,0.2), rgba(139,92,246,0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
}

.stat-number {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  color: var(--c-muted);
}

.testimonial-card {
  position: relative;
}

.testimonial-quote {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 24px;
  font-style: italic;
  color: var(--c-text);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(to top, #2563eb, #3b82f6);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 10px 40px -10px rgba(59,130,246,0.4);
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  background: linear-gradient(to top, #1d4ed8, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 15px 50px -10px rgba(59,130,246,0.5);
  color: white;
}

.btn-secondary {
  padding: 14px 32px;
  background: linear-gradient(to top, var(--c-card), #2d3548);
  color: var(--c-text);
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid var(--c-border);
}

.contact-form input, .contact-form textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  color: var(--c-text);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}

.contact-form input:focus, .contact-form textarea:focus {
  outline: none;
  border-color: var(--c-accent);
}

.cta-section {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 80px 40px;
  background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1));
  border: 1px solid var(--c-border);
}

.cta-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15), transparent 70%);
  filter: blur(60px);
}

.site-footer {
  border-top: 1px solid var(--c-border);
  padding-top: 40px;
  padding-bottom: 40px;
  margin-top: 80px;
  color: var(--c-muted);
}

@media (max-width: 900px) {
  .hero-section { padding-top: 80px; padding-bottom: 60px; }
  .service-card, .stat-card, .testimonial-card { padding: 24px; }
}

@media (max-width: 600px) {
  .hero-section { padding-top: 60px; padding-bottom: 40px; }
  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
}`

  // assets/js/theme.js
  const varName = themeSlug.replace(/-/g, '_')
  files['assets/js/theme.js'] = `(function() {
  'use strict';
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this).entries());
      try {
        const res = await fetch(window.${varName}Data.restUrl + 'contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        alert(result.success ? '¡Mensaje enviado!' : 'Error al enviar');
        if (result.success) this.reset();
      } catch (err) {
        alert('Error al enviar el mensaje');
      }
    });
  }
})();`

  // Generate patterns based on business content
  if (sections.includes('Hero')) {
    files['patterns/hero.php'] = generateRealHero(data, businessContent)
  }
  if (sections.includes('Servicios')) {
    files['patterns/services.php'] = generateRealServices(data, businessContent)
  }
  if (sections.includes('Stats/Números')) {
    files['patterns/stats.php'] = generateRealStats(data, businessContent)
  }
  if (sections.includes('Testimonios')) {
    files['patterns/testimonials.php'] = generateRealTestimonials(data, businessContent)
  }
  if (sections.includes('Contacto')) {
    files['patterns/contact.php'] = generateRealContact(data)
  }
  if (sections.includes('CTA')) {
    files['patterns/cta.php'] = generateRealCTA(data)
  }

  // parts/header.html
  files['parts/header.html'] = `<!-- wp:group {"align":"full","className":"site-header","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group alignfull site-header has-global-padding is-layout-flex wp-block-group-is-layout-flex">
  <!-- wp:site-title {"fontSize":"large"} /-->
  <!-- wp:navigation /-->
</div>
<!-- /wp:group -->`

  // parts/footer.html
  files['parts/footer.html'] = `<!-- wp:group {"align":"full","className":"site-footer","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull site-footer has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
  <!-- wp:paragraph {"align":"center","fontSize":"small"} -->
  <p class="has-text-align-center has-small-font-size">© 2026 ${businessName}. Powered by <a href="https://anvilwp.com">AnvilWP</a></p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`

  // templates
  files['templates/index.html'] = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main"} -->
<main class="wp-block-group"><!-- wp:post-content /--></main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`

  files['templates/front-page.html'] = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main"} -->
<main class="wp-block-group">
${sections.map((s: string) => {
  const slug = s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `  <!-- wp:pattern {"slug":"${themeSlug}/${slug}"} /-->`
}).join('\n')}
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`

  files['README.md'] = `# ${businessName}

Theme profesional generado con [AnvilWP](https://anvilwp.com)

## Instalación
1. Sube a \`wp-content/themes/\`
2. Activa en WordPress
3. Personaliza contenido

## Características
- Dark neon design profesional
- SEO optimizado
- Formulario de contacto nativo
- Responsive
- GPL-2.0

Documentación completa: https://github.com/Josusanz/anvilwp`

  return files
}

function generateRealHero(data: any, content: any) {
  const { themeSlug, primaryCta } = data
  const { hero } = content
  return `<?php
/**
 * Title: Hero Section
 * Slug: ${themeSlug}/hero
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","className":"hero-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull hero-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:120px;padding-bottom:80px">

  <!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
  <div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained" style="max-width:800px;margin-left:auto;margin-right:auto">

    <!-- wp:paragraph {"align":"center","className":"hero-badge"} -->
    <p class="has-text-align-center hero-badge">✨ ${hero.badge}</p>
    <!-- /wp:paragraph -->

    <!-- wp:heading {"textAlign":"center","level":1,"fontSize":"x-large"} -->
    <h1 class="wp-block-heading has-text-align-center has-x-large-font-size">${hero.title}</h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","fontSize":"large"} -->
    <p class="has-text-align-center has-large-font-size" style="color:#94a3b8;margin-bottom:40px">${hero.subtitle}</p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
      <!-- wp:button {"className":"btn-primary"} -->
      <div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">${primaryCta || hero.cta}</a></div>
      <!-- /wp:button -->

      <!-- wp:button {"className":"btn-secondary"} -->
      <div class="wp-block-button btn-secondary"><a class="wp-block-button__link wp-element-button">Saber Más</a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->

  </div>
  <!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

function generateRealServices(data: any, content: any) {
  const { themeSlug } = data
  const { services } = content
  return `<?php
/**
 * Title: Services Section
 * Slug: ${themeSlug}/servicios
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">

  <!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
  <h2 class="wp-block-heading has-text-align-center has-xx-large-font-size" style="margin-bottom:60px">Nuestros Servicios</h2>
  <!-- /wp:heading -->

  <!-- wp:columns {"align":"wide"} -->
  <div class="wp-block-columns alignwide is-layout-flex wp-block-columns-is-layout-flex">
    ${services.slice(0, 3).map((s: any) => `
    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:group {"className":"service-card"} -->
      <div class="wp-block-group service-card">
        <div class="service-icon">${getIconEmoji(s.icon)}</div>
        <!-- wp:heading {"level":3} -->
        <h3 class="wp-block-heading">${s.title}</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph -->
        <p style="color:#94a3b8">${s.desc}</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:column -->
    `).join('')}
  </div>
  <!-- /wp:columns -->

  <!-- wp:columns {"align":"wide"} -->
  <div class="wp-block-columns alignwide is-layout-flex wp-block-columns-is-layout-flex" style="margin-top:32px">
    ${services.slice(3, 6).map((s: any) => `
    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:group {"className":"service-card"} -->
      <div class="wp-block-group service-card">
        <div class="service-icon">${getIconEmoji(s.icon)}</div>
        <!-- wp:heading {"level":3} -->
        <h3 class="wp-block-heading">${s.title}</h3>
        <!-- /wp:heading -->
        <!-- wp:paragraph -->
        <p style="color:#94a3b8">${s.desc}</p>
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

function generateRealStats(data: any, content: any) {
  const { themeSlug } = data
  const { stats } = content
  return `<?php
/**
 * Title: Stats Section
 * Slug: ${themeSlug}/stats-números
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">

  <!-- wp:columns {"align":"wide"} -->
  <div class="wp-block-columns alignwide is-layout-flex wp-block-columns-is-layout-flex">
    ${stats.map((s: any) => `
    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow has-text-align-center">
      <!-- wp:group {"className":"stat-card"} -->
      <div class="wp-block-group stat-card">
        <div class="stat-number">${s.number}</div>
        <div class="stat-label">${s.label}</div>
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

function generateRealTestimonials(data: any, content: any) {
  const { themeSlug } = data
  const { testimonials } = content
  return `<?php
/**
 * Title: Testimonials Section
 * Slug: ${themeSlug}/testimonios
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">

  <!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
  <h2 class="wp-block-heading has-text-align-center has-xx-large-font-size" style="margin-bottom:60px">Lo Que Dicen Nuestros Clientes</h2>
  <!-- /wp:heading -->

  <!-- wp:columns {"align":"wide"} -->
  <div class="wp-block-columns alignwide is-layout-flex wp-block-columns-is-layout-flex">
    ${testimonials.map((t: any) => `
    <!-- wp:column -->
    <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
      <!-- wp:group {"className":"testimonial-card"} -->
      <div class="wp-block-group testimonial-card">
        <p class="testimonial-quote">"${t.text}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.author.charAt(0)}</div>
          <div>
            <div style="font-weight:600">${t.author}</div>
            <div style="font-size:0.875rem;color:#94a3b8">${t.role}</div>
          </div>
        </div>
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

function generateRealContact(data: any) {
  const { themeSlug } = data
  return `<?php
/**
 * Title: Contact Form
 * Slug: ${themeSlug}/contacto
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">

  <!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
  <h2 class="wp-block-heading has-text-align-center has-xx-large-font-size" style="margin-bottom:60px">Hablemos</h2>
  <!-- /wp:heading -->

  <!-- wp:html -->
  <form class="contact-form" style="max-width:600px;margin:0 auto">
    <input type="text" name="name" placeholder="Tu nombre" required>
    <input type="email" name="email" placeholder="Tu email" required>
    <input type="tel" name="phone" placeholder="Teléfono (opcional)">
    <textarea name="message" placeholder="Tu mensaje" required rows="5"></textarea>
    <input type="text" name="website" style="display:none">
    <button type="submit" class="btn-primary" style="width:100%">Enviar Mensaje</button>
  </form>
  <!-- /wp:html -->

</div>
<!-- /wp:group -->`
}

function generateRealCTA(data: any) {
  const { themeSlug, businessName, primaryCta } = data
  return `<?php
/**
 * Title: CTA Section
 * Slug: ${themeSlug}/cta
 * Categories: ${themeSlug}
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:80px;padding-bottom:80px">

  <!-- wp:group {"className":"cta-section","layout":{"type":"constrained","contentSize":"800px"}} -->
  <div class="wp-block-group cta-section is-layout-constrained wp-block-group-is-layout-constrained">

    <!-- wp:heading {"textAlign":"center","fontSize":"xx-large"} -->
    <h2 class="wp-block-heading has-text-align-center has-xx-large-font-size">¿Listo para empezar?</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","fontSize":"large"} -->
    <p class="has-text-align-center has-large-font-size" style="color:#94a3b8;margin-bottom:40px">Únete a cientos de clientes satisfechos con ${businessName}</p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">
      <!-- wp:button {"className":"btn-primary"} -->
      <div class="wp-block-button btn-primary"><a class="wp-block-button__link wp-element-button">${primaryCta || 'Empezar Ahora'}</a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->

  </div>
  <!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

function getIconEmoji(icon: string): string {
  const icons: Record<string, string> = {
    'chef': '👨‍🍳', 'calendar': '📅', 'wine': '🍷', 'sun': '☀️', 'menu': '📋', 'delivery': '🚚',
    'strategy': '🎯', 'chart': '📈', 'design': '🎨', 'search': '🔍', 'automation': '⚡', 'analytics': '📊',
    'shipping': '📦', 'return': '↩️', 'security': '🔒', 'support': '💬', 'loyalty': '⭐', 'premium': '👑',
    'projects': '📁', 'collaboration': '🤝', 'reports': '📑', 'integrations': '🔗', 'api': '⚙️',
  }
  return icons[icon] || '✨'
}
