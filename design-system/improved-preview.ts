// Enhanced Preview HTML Generator for AnvilWP
// Generates high-fidelity preview that matches final WordPress theme

export function generateEnhancedPreviewHTML(themeData: any): string {
  const { businessName, tagline, hero, features, services, stats, testimonials, cta, colors } = themeData

  const primary = colors?.primary || '#0A1E3D'
  const accent = colors?.accent || '#3B82F6'
  const secondary = colors?.secondary || '#8B5CF6'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName || 'Mi Sitio'}</title>
  <style>
    /* Reset & Base */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0d1117;
      color: #e2e8f0;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4 {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }

    /* CSS Variables */
    :root {
      --c-primary: ${primary};
      --c-accent: ${accent};
      --c-secondary: ${secondary};
      --c-bg-primary: #0d1117;
      --c-bg-secondary: #161b27;
      --c-bg-tertiary: #1e2535;
      --c-text-primary: #e2e8f0;
      --c-text-secondary: #94a3b8;
      --c-text-tertiary: #64748b;
    }

    /* Header */
    .header {
      position: sticky;
      top: 0;
      background: rgba(22, 27, 39, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 20px 40px;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .site-title {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--c-accent), var(--c-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Hero Section */
    .hero {
      padding: 120px 40px 80px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
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

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
    }

    .badge {
      display: inline-block;
      padding: 8px 16px;
      background: var(--c-bg-secondary);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      font-size: 0.875rem;
      margin-bottom: 24px;
      color: var(--c-text-secondary);
    }

    .hero h1 {
      font-size: clamp(2.5rem, 5vw, 5rem);
      margin-bottom: 20px;
      line-height: 1.1;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--c-accent), var(--c-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--c-text-secondary);
      margin-bottom: 40px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(to top, #2563EB, var(--c-accent));
      color: white;
      box-shadow: 0 10px 40px rgba(59,130,246,0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 50px rgba(59,130,246,0.4);
    }

    .btn-secondary {
      background: var(--c-bg-secondary);
      color: var(--c-text-primary);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-secondary:hover {
      background: var(--c-bg-tertiary);
      border-color: rgba(59, 130, 246, 0.3);
    }

    /* Sections */
    .section {
      padding: 80px 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-alt {
      background: var(--c-bg-secondary);
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      margin-bottom: 16px;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--c-text-secondary);
    }

    /* Grid Layouts */
    .grid {
      display: grid;
      gap: 32px;
    }

    .grid-2 { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); }
    .grid-3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }

    /* Cards */
    .card {
      background: var(--c-bg-tertiary);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 32px;
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      line-height: 1;
    }

    .card-title {
      font-size: 1.25rem;
      margin-bottom: 12px;
    }

    .card-description {
      color: var(--c-text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* Stats */
    .stats {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 48px;
      text-align: center;
    }

    .stat-value {
      font-size: clamp(2.5rem, 4vw, 3.5rem);
      font-weight: 800;
      background: linear-gradient(135deg, var(--c-accent), var(--c-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 8px;
    }

    .stat-label {
      color: var(--c-text-tertiary);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Testimonials */
    .testimonial {
      background: var(--c-bg-secondary);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .testimonial-quote {
      color: var(--c-text-secondary);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 16px;
      flex: 1;
    }

    .testimonial-quote::before {
      content: '"';
      font-size: 2rem;
      color: var(--c-accent);
      opacity: 0.3;
      line-height: 0;
      display: block;
      margin-bottom: 8px;
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
      background: var(--c-bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--c-accent);
      flex-shrink: 0;
    }

    .testimonial-name {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .testimonial-role {
      color: var(--c-text-tertiary);
      font-size: 0.875rem;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--c-accent) 0%, var(--c-secondary) 100%);
      border-radius: 12px;
      padding: clamp(40px, 8vw, 80px) clamp(24px, 6vw, 60px);
      text-align: center;
      position: relative;
      overflow: hidden;
      margin: 80px 40px;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-title {
      color: white;
      margin-bottom: 16px;
      position: relative;
    }

    .cta-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.125rem;
      margin-bottom: 32px;
      position: relative;
    }

    .cta-section .btn {
      background: white;
      color: var(--c-accent);
      position: relative;
    }

    .cta-section .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }

    /* Footer */
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: var(--c-bg-secondary);
      padding: 60px 40px 40px;
      text-align: center;
    }

    .footer-title {
      margin-bottom: 16px;
    }

    .footer-tagline {
      color: var(--c-text-secondary);
      margin-bottom: 40px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
      margin-top: 40px;
      color: var(--c-text-tertiary);
      font-size: 0.875rem;
    }

    .footer-bottom a {
      color: var(--c-accent);
      text-decoration: none;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .hero { padding: 80px 24px 60px; }
      .section { padding: 60px 24px; }
      .grid-3, .grid-2 { grid-template-columns: 1fr; gap: 24px; }
      .stats { gap: 32px; }
      .cta-section { margin: 60px 24px; }
    }

    @media (max-width: 600px) {
      .header { padding: 16px 24px; }
      .hero { padding: 60px 20px 40px; }
      .section { padding: 40px 20px; }
      .card { padding: 24px; }
      .cta-buttons { flex-direction: column; }
      .btn { width: 100%; justify-content: center; }
    }

    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="site-title">${businessName || 'Mi Sitio'}</div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-content">
      ${hero?.badge ? `<div class="badge">✨ ${hero.badge}</div>` : ''}
      <h1>${hero?.title || businessName}<br><span class="gradient-text">${hero?.titleAccent || tagline || 'Potencia tu negocio'}</span></h1>
      <p class="subtitle">${hero?.subtitle || 'Llevamos tu presencia digital al siguiente nivel'}</p>
      <div class="cta-buttons">
        <a href="#" class="btn btn-primary">${hero?.cta?.primary || 'Comenzar'} →</a>
        ${hero?.cta?.secondary ? `<a href="#" class="btn btn-secondary">${hero.cta.secondary}</a>` : ''}
      </div>
    </div>
  </section>

  ${features?.items?.length ? `
  <!-- Features -->
  <section class="section">
    <div class="section-header">
      <h2 class="section-title">${features.title || 'Características'}</h2>
      ${features.subtitle ? `<p class="section-subtitle">${features.subtitle}</p>` : ''}
    </div>
    <div class="grid grid-3">
      ${features.items.map((item: any) => `
        <div class="card" style="text-align: center;">
          <div class="card-icon">${item.icon || '✨'}</div>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-description">${item.description}</p>
        </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  ${stats?.length ? `
  <!-- Stats -->
  <section class="section">
    <div class="stats">
      ${stats.map((stat: any) => `
        <div>
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  ${services?.items?.length ? `
  <!-- Services -->
  <section class="section section-alt">
    <div class="section-header">
      <h2 class="section-title">${services.title || 'Servicios'}</h2>
    </div>
    <div class="grid grid-2">
      ${services.items.map((item: any) => `
        <div class="card">
          <div class="card-icon">${item.icon || '🎯'}</div>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-description">${item.description}</p>
        </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  ${testimonials?.items?.length ? `
  <!-- Testimonials -->
  <section class="section">
    <div class="section-header">
      <h2 class="section-title">${testimonials.title || 'Testimonios'}</h2>
    </div>
    <div class="grid grid-3">
      ${testimonials.items.map((item: any) => {
        const initials = item.author ? item.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '👤'
        return `
        <div class="testimonial">
          <p class="testimonial-quote">${item.quote}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${initials}</div>
            <div>
              <div class="testimonial-name">${item.author}</div>
              <div class="testimonial-role">${item.role}${item.company ? ` - ${item.company}` : ''}</div>
            </div>
          </div>
        </div>
      `}).join('')}
    </div>
  </section>
  ` : ''}

  ${cta ? `
  <!-- CTA -->
  <div class="cta-section">
    <h2 class="cta-title">${cta.title || '¿Listo para comenzar?'}</h2>
    <p class="cta-subtitle">${cta.subtitle || 'Únete a miles de usuarios satisfechos'}</p>
    <a href="#" class="btn">${cta.button || 'Comenzar ahora'} →</a>
  </div>
  ` : ''}

  <!-- Footer -->
  <footer class="footer">
    <h3 class="footer-title">${businessName || 'Mi Sitio'}</h3>
    <p class="footer-tagline">${tagline || ''}</p>
    <div class="footer-bottom">
      © ${new Date().getFullYear()} ${businessName || 'Mi Sitio'}. Powered by <a href="https://anvilwp.com" target="_blank">AnvilWP</a>
    </div>
  </footer>
</body>
</html>`
}
