// Continued pattern generators for WordPress themes

export function generateFeaturesPattern(themeSlug: string, data: any): string {
  const features = data.features || {}
  const title = features.title || 'Nuestras características'
  const subtitle = features.subtitle || ''
  const items = features.items || []

  const featuresHTML = items.map((item: any) => `
<!-- wp:column {"className":"anvilwp-feature-card"} -->
<div class="wp-block-column anvilwp-feature-card is-layout-flow wp-block-column-is-layout-flow">

<!-- wp:paragraph {"align":"center","className":"anvilwp-feature-icon","fontSize":"xxx-large"} -->
<p class="has-text-align-center anvilwp-feature-icon has-xxx-large-font-size">${item.icon || '✨'}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":3,"fontSize":"x-large"} -->
<h3 class="wp-block-heading has-text-align-center has-x-large-font-size">${item.title}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--c-text-secondary)"}}} -->
<p class="has-text-align-center" style="color:var(--c-text-secondary)">${item.description}</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:column -->`).join('\n\n')

  return `<?php
/**
 * Title: Features Section
 * Slug: ${themeSlug}/features
 * Categories: ${themeSlug}
 * Description: Grid de características con icons y descripciones
 */
?>
<!-- wp:group {"align":"full","className":"anvilwp-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull anvilwp-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:group {"className":"anvilwp-section-header","layout":{"type":"constrained","contentSize":"700px"}} -->
<div class="wp-block-group anvilwp-section-header is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","className":"anvilwp-section-title"} -->
<h2 class="wp-block-heading has-text-align-center anvilwp-section-title">${title}</h2>
<!-- /wp:heading -->

${subtitle ? `<!-- wp:paragraph {"align":"center","className":"anvilwp-section-subtitle"} -->
<p class="has-text-align-center anvilwp-section-subtitle">${subtitle}</p>
<!-- /wp:paragraph -->` : ''}

</div>
<!-- /wp:group -->

<!-- wp:columns {"className":"anvilwp-grid-3"} -->
<div class="wp-block-columns anvilwp-grid-3 is-layout-flex wp-block-columns-is-layout-flex">
${featuresHTML}
</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`
}

export function generateServicesPattern(themeSlug: string, data: any): string {
  const services = data.services || {}
  const title = services.title || 'Nuestros servicios'
  const items = services.items || []

  const servicesHTML = items.map((item: any) => `
<!-- wp:group {"className":"anvilwp-card","layout":{"type":"constrained"}} -->
<div class="wp-block-group anvilwp-card is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:paragraph {"className":"anvilwp-feature-icon","fontSize":"xxx-large"} -->
<p class="anvilwp-feature-icon has-xxx-large-font-size">${item.icon || '🎯'}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"x-large"} -->
<h3 class="wp-block-heading has-x-large-font-size">${item.title}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"var(--c-text-secondary)"}}} -->
<p style="color:var(--c-text-secondary)">${item.description}</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`).join('\n\n')

  return `<?php
/**
 * Title: Services Section
 * Slug: ${themeSlug}/services
 * Categories: ${themeSlug}
 * Description: Grid de servicios con cards hover effect
 */
?>
<!-- wp:group {"align":"full","className":"anvilwp-section","style":{"color":{"background":"var(--c-bg-secondary)"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull anvilwp-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="background-color:var(--c-bg-secondary)">

<!-- wp:heading {"textAlign":"center","className":"anvilwp-section-title","style":{"spacing":{"margin":{"bottom":"60px"}}}} -->
<h2 class="wp-block-heading has-text-align-center anvilwp-section-title" style="margin-bottom:60px">${title}</h2>
<!-- /wp:heading -->

<!-- wp:group {"className":"anvilwp-grid-2","layout":{"type":"grid","columnCount":null,"minimumColumnWidth":"350px"}} -->
<div class="wp-block-group anvilwp-grid-2">
${servicesHTML}
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

export function generateStatsPattern(themeSlug: string, data: any): string {
  const stats = data.stats || []

  const statsHTML = stats.map((stat: any) => `
<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"0","bottom":"0"}}}} -->
<div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:0;padding-bottom:0">

<!-- wp:paragraph {"className":"anvilwp-stat-value","style":{"typography":{"fontSize":"3.5rem","fontWeight":"800","lineHeight":"1"}}} -->
<p class="anvilwp-stat-value" style="font-size:3.5rem;font-weight:800;line-height:1">${stat.value}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"anvilwp-stat-label","style":{"typography":{"fontSize":"0.875rem","textTransform":"uppercase","letterSpacing":"0.05em"},"color":{"text":"var(--c-text-secondary)"}}} -->
<p class="anvilwp-stat-label" style="color:var(--c-text-secondary);font-size:0.875rem;text-transform:uppercase;letter-spacing:0.05em">${stat.label}</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`).join('\n\n')

  return `<?php
/**
 * Title: Stats Section
 * Slug: ${themeSlug}/stats
 * Categories: ${themeSlug}
 * Description: Estadísticas con números grandes y gradientes
 */
?>
<!-- wp:group {"align":"full","className":"anvilwp-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull anvilwp-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-around"},"style":{"spacing":{"gap":"48px"}}} -->
<div class="wp-block-group is-layout-flex wp-block-group-is-layout-flex" style="gap:48px">
${statsHTML}
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

export function generateTestimonialsPattern(themeSlug: string, data: any): string {
  const testimonials = data.testimonials || {}
  const title = testimonials.title || 'Lo que dicen nuestros clientes'
  const items = testimonials.items || []

  const testimonialsHTML = items.map((item: any) => {
    const initials = item.author ? item.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '👤'

    return `
<!-- wp:column -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">

<!-- wp:group {"className":"anvilwp-testimonial","layout":{"type":"constrained"}} -->
<div class="wp-block-group anvilwp-testimonial is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:paragraph {"className":"anvilwp-testimonial-quote"} -->
<p class="anvilwp-testimonial-quote">${item.quote}</p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"anvilwp-testimonial-author","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group anvilwp-testimonial-author is-layout-flex wp-block-group-is-layout-flex">

<!-- wp:paragraph {"className":"anvilwp-testimonial-avatar"} -->
<p class="anvilwp-testimonial-avatar">${initials}</p>
<!-- /wp:paragraph -->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:paragraph {"className":"anvilwp-testimonial-name","style":{"spacing":{"margin":{"bottom":"4px"}}}} -->
<p class="anvilwp-testimonial-name" style="margin-bottom:4px"><strong>${item.author}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"anvilwp-testimonial-role","fontSize":"small"} -->
<p class="anvilwp-testimonial-role has-small-font-size">${item.role}${item.company ? ` - ${item.company}` : ''}</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:column -->`
  }).join('\n\n')

  return `<?php
/**
 * Title: Testimonials Section
 * Slug: ${themeSlug}/testimonials
 * Categories: ${themeSlug}
 * Description: Grid de testimonials con avatars y quotes
 */
?>
<!-- wp:group {"align":"full","className":"anvilwp-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull anvilwp-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","className":"anvilwp-section-title","style":{"spacing":{"margin":{"bottom":"60px"}}}} -->
<h2 class="wp-block-heading has-text-align-center anvilwp-section-title" style="margin-bottom:60px">${title}</h2>
<!-- /wp:heading -->

<!-- wp:columns {"className":"anvilwp-grid-3"} -->
<div class="wp-block-columns anvilwp-grid-3 is-layout-flex wp-block-columns-is-layout-flex">
${testimonialsHTML}
</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`
}

export function generateCTAPattern(themeSlug: string, data: any): string {
  const cta = data.cta || {}
  const title = cta.title || '¿Listo para comenzar?'
  const subtitle = cta.subtitle || 'Únete a miles de usuarios satisfechos'
  const button = cta.button || 'Comenzar ahora'

  return `<?php
/**
 * Title: Call to Action
 * Slug: ${themeSlug}/cta
 * Categories: ${themeSlug}
 * Description: CTA con gradient background
 */
?>
<!-- wp:group {"align":"full","className":"anvilwp-section","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull anvilwp-section has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:group {"className":"anvilwp-cta","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group anvilwp-cta is-layout-constrained wp-block-group-is-layout-constrained">

<!-- wp:heading {"textAlign":"center","className":"anvilwp-cta-title","style":{"color":{"text":"#ffffff"}}} -->
<h2 class="wp-block-heading has-text-align-center anvilwp-cta-title" style="color:#ffffff">${title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","className":"anvilwp-cta-subtitle","style":{"color":{"text":"rgba(255,255,255,0.9)"},"typography":{"fontSize":"1.125rem"}}} -->
<p class="has-text-align-center anvilwp-cta-subtitle" style="color:rgba(255,255,255,0.9);font-size:1.125rem">${subtitle}</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex">

<!-- wp:button {"className":"anvilwp-button","style":{"color":{"background":"#ffffff","text":"var(--c-accent)"}}} -->
<div class="wp-block-button anvilwp-button"><a class="wp-block-button__link has-background has-text-color wp-element-button" style="background-color:#ffffff;color:var(--c-accent)">${button} <span class="anvilwp-button-arrow">→</span></a></div>
<!-- /wp:button -->

</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

export function generateHeader(data: any): string {
  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"20px","bottom":"20px"}},"position":{"type":"sticky","top":"0px"}},"backgroundColor":"surface","className":"has-backdrop-blur","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background has-backdrop-blur has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:20px;padding-bottom:20px">

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group is-layout-flex wp-block-group-is-layout-flex">

<!-- wp:site-title {"level":3,"style":{"elements":{"link":{"color":{"text":"var(--c-text-primary)"}}}}} /-->

<!-- wp:navigation {"layout":{"type":"flex","justifyContent":"right"},"style":{"spacing":{"blockGap":"var:preset|spacing|50"}}} /-->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`
}

export function generateFooter(data: any): string {
  const businessName = data.businessName || 'Mi Sitio'
  const year = new Date().getFullYear()

  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"60px","bottom":"40px"}},"elements":{"link":{"color":{"text":"var(--c-accent)"}}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background has-link-color has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:60px;padding-bottom:40px">

<!-- wp:columns -->
<div class="wp-block-columns is-layout-flex wp-block-columns-is-layout-flex">

<!-- wp:column {"width":"40%"} -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:40%">

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">${businessName}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"var(--c-text-secondary)"}}} -->
<p style="color:var(--c-text-secondary)">${data.tagline || ''}</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:column -->

<!-- wp:column {"width":"30%"} -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:30%">

<!-- wp:heading {"level":4,"fontSize":"large"} -->
<h4 class="wp-block-heading has-large-font-size">Enlaces</h4>
<!-- /wp:heading -->

<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"var:preset|spacing|30"}}} /-->

</div>
<!-- /wp:column -->

<!-- wp:column {"width":"30%"} -->
<div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style="flex-basis:30%">

<!-- wp:heading {"level":4,"fontSize":"large"} -->
<h4 class="wp-block-heading has-large-font-size">Contacto</h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"var(--c-text-secondary)"}}} -->
<p style="color:var(--c-text-secondary)">info@example.com</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"40px","bottom":"20px"}}},"backgroundColor":"text-tertiary","className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-text-tertiary-background-color has-alpha-channel-opacity has-text-tertiary-background-color has-background is-style-wide" style="margin-top:40px;margin-bottom:20px"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"var(--c-text-secondary)"}},"fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size" style="color:var(--c-text-secondary)">© ${year} ${businessName}. Powered by <a href="https://anvilwp.com">AnvilWP</a></p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`
}

export function generateIndexTemplate(themeSlug: string): string {
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
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
}

export function generateFrontPageTemplate(themeSlug: string): string {
  return `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:pattern {"slug":"${themeSlug}/hero"} /-->
<!-- wp:pattern {"slug":"${themeSlug}/features"} /-->
<!-- wp:pattern {"slug":"${themeSlug}/services"} /-->
<!-- wp:pattern {"slug":"${themeSlug}/stats"} /-->
<!-- wp:pattern {"slug":"${themeSlug}/testimonials"} /-->
<!-- wp:pattern {"slug":"${themeSlug}/cta"} /-->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
}

export function generatePageTemplate(): string {
  return `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
<!-- wp:post-title /-->
<!-- wp:post-content /-->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
}

export function generateSingleTemplate(): string {
  return `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained","contentSize":"800px"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
<!-- wp:post-title /-->
<!-- wp:post-date /-->
<!-- wp:post-content /-->
<!-- wp:post-comments /-->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
}
