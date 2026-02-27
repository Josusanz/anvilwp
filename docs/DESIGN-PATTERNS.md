# 🎨 AnvilWP Design Patterns (Calidad Cruip/Neon)

**Patrones de diseño de alta calidad basados en Cruip Neon Theme**

> ⚠️ **IMPORTANTE**: Estos patrones deben ser la referencia para generar themes. NO generes código genérico - usa ESTOS patrones específicos.

---

## 🎯 Elementos Clave de Calidad

### ❌ Lo que NO hacer (código genérico):
```html
<!-- MALO: Emoji simple, sin efectos -->
<div class="icon">🚀</div>
<h3>Feature Title</h3>
<p>Some description</p>
```

### ✅ Lo que SÍ hacer (calidad Cruip):
```html
<!-- BUENO: SVG con gradiente radial, animaciones, efectos -->
<div class="flex flex-col items-center" data-aos="zoom-out">
  <div class="mb-4">
    <svg width="56" height="56">
      <defs>
        <radialGradient cx="50%" cy="89.845%" r="89.85%" id="icon1">
          <stop stop-color="#3B82F6" stop-opacity=".64" offset="0%" />
          <stop stop-color="#F472B6" stop-opacity=".876" offset="100%" />
        </radialGradient>
        <circle id="icon-bg" cx="28" cy="28" r="28" />
      </defs>
      <g fill="none">
        <use fill="url(#icon1)" href="#icon-bg" />
        <path stroke="#FDF2F8" stroke-width="2" d="M17 28h22" />
      </g>
    </svg>
  </div>
  <h4 class="h4 text-gray-200 text-center mb-2">Feature Title</h4>
  <p class="text-lg text-gray-400 text-center">Professional description with proper typography.</p>
</div>
```

---

## 🔨 Patrones por Sección

### 1. Hero Section

**Elementos clave:**
- Badge animado con borde gradient
- Heading con `<em>` en itálica para énfasis
- Dos botones con efectos hover
- Ilustración de fondo o gradient overlay
- Animaciones escalonadas (AOS delays)

**Template:**
```html
<section class="lumen-hero relative overflow-hidden">
  <!-- Gradient background -->
  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-800 to-gray-900 opacity-60 h-40 pointer-events-none -z-10"></div>

  <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
    <div class="pt-32 pb-12 md:pt-40 md:pb-20">
      <div class="max-w-xl mx-auto md:max-w-2xl text-center">

        <!-- Badge con efecto de borde -->
        <div data-aos="zoom-out">
          <div class="relative text-sm text-gray-300 bg-gray-800 rounded-full inline-block px-4 py-1 mb-6 before:content-[''] before:absolute before:-z-10 before:inset-0 before:-m-0.5 before:bg-gradient-to-t before:from-gray-800 before:via-gray-600 before:to-gray-800 before:rounded-full">
            <div class="text-gray-400">
              Nuevo lanzamiento.{' '}
              <a class="font-medium text-blue-500 inline-flex items-center transition duration-150 ease-in-out group" href="#0">
                Saber más{' '}
                <span class="tracking-normal group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">→</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Heading con énfasis en itálica -->
        <h1 class="text-5xl md:text-6xl font-bold mb-6" data-aos="zoom-out" data-aos-delay="100">
          Transforma tu negocio con <em class="italic bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">estrategia digital</em>
        </h1>

        <!-- Descripción -->
        <p class="text-xl text-gray-400 mb-10" data-aos="zoom-out" data-aos-delay="200">
          Resultados medibles desde el primer mes. Sin promesas vacías, solo datos y crecimiento real.
        </p>

        <!-- CTAs con efectos hover -->
        <div class="flex flex-col sm:flex-row justify-center gap-4" data-aos="zoom-out" data-aos-delay="300">
          <a class="btn bg-gradient-to-t from-blue-600 to-blue-400 hover:to-blue-500 text-white shadow-lg group" href="#contacto">
            Empieza gratis{' '}
            <span class="tracking-normal text-blue-200 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">→</span>
          </a>
          <a class="btn bg-gradient-to-t from-gray-800 to-gray-700 hover:to-gray-800 text-gray-300 shadow-lg" href="#casos">
            Ver casos de éxito
          </a>
        </div>

      </div>
    </div>
  </div>
</section>
```

---

### 2. Features/Services Section

**Elementos clave:**
- SVG icons con gradientes radiales (NO emojis planos)
- Grid responsive (3 cols → 2 → 1)
- Animaciones con delays escalonados
- Centrado vertical y horizontal

**Iconos SVG profesionales:**

```html
<!-- Icon 1: Code/Development -->
<svg width="56" height="56">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="icon-dev">
      <stop stop-color="#3B82F6" stop-opacity=".64" offset="0%" />
      <stop stop-color="#F472B6" stop-opacity=".876" offset="100%" />
    </radialGradient>
    <circle id="dev-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#icon-dev)" href="#dev-bg" />
    <g stroke="#FDF2F8" stroke-width="2">
      <path d="m22 24-4 4 4 4M34 24l4 4-4 4" />
      <path d="m26 36 4-16" opacity=".64" />
    </g>
  </g>
</svg>

<!-- Icon 2: Performance/Speed -->
<svg width="56" height="56">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="icon-speed">
      <stop stop-color="#10B981" stop-opacity=".64" offset="0%" />
      <stop stop-color="#3B82F6" stop-opacity=".876" offset="100%" />
    </radialGradient>
    <circle id="speed-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#icon-speed)" href="#speed-bg" />
    <g stroke="#FDF2F8" stroke-width="2">
      <path d="M17 28h22" opacity=".64" />
      <path d="M20 23v-3h3M33 20h3v3M36 33v3h-3M23 36h-3v-3" />
    </g>
  </g>
</svg>

<!-- Icon 3: Analytics/Data -->
<svg width="56" height="56">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="icon-analytics">
      <stop stop-color="#8B5CF6" stop-opacity=".64" offset="0%" />
      <stop stop-color="#EC4899" stop-opacity=".876" offset="100%" />
    </radialGradient>
    <circle id="analytics-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#icon-analytics)" href="#analytics-bg" />
    <g stroke="#FDF2F8" stroke-width="2">
      <path d="M22 34V26M28 34V22M34 34V28" />
      <path d="M22 22l6 4 6-6" opacity=".64" />
    </g>
  </g>
</svg>
```

**Template completo:**

```html
<section class="lumen-features py-12 md:py-20">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">

    <!-- Header -->
    <div class="text-center pb-12 md:pb-20">
      <h2 class="text-3xl md:text-4xl font-bold mb-4" data-aos="zoom-out">
        Todo lo que necesitas para crecer
      </h2>
      <p class="text-xl text-gray-400" data-aos="zoom-out" data-aos-delay="100">
        Servicios diseñados para empresas que quieren resultados reales
      </p>
    </div>

    <!-- Grid -->
    <div class="max-w-sm mx-auto grid gap-8 md:grid-cols-3 lg:gap-16 items-start md:max-w-none">

      <!-- Feature 1 -->
      <div class="flex flex-col items-center" data-aos="zoom-out">
        <div class="mb-4">
          [SVG Icon aquí]
        </div>
        <h4 class="text-xl text-gray-200 text-center mb-2 font-semibold">Estrategia Digital</h4>
        <p class="text-lg text-gray-400 text-center">
          Definimos el camino más corto desde donde estás hasta donde quieres llegar
        </p>
      </div>

      <!-- Feature 2 -->
      <div class="flex flex-col items-center" data-aos="zoom-out" data-aos-delay="200">
        [Repetir estructura]
      </div>

      <!-- Feature 3 -->
      <div class="flex flex-col items-center" data-aos="zoom-out" data-aos-delay="400">
        [Repetir estructura]
      </div>

    </div>
  </div>
</section>
```

---

### 3. Stats/Numbers Section

**Elementos clave:**
- Números GRANDES con gradiente
- Labels en uppercase
- Grid de 4 columnas → 2 → 1
- Fondo ligeramente diferente

```html
<section class="lumen-stats bg-gray-900/50 py-12 md:py-20 border-y border-gray-800">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="grid md:grid-cols-4 gap-8 text-center">

      <!-- Stat 1 -->
      <div data-aos="fade-up">
        <div class="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
          +240%
        </div>
        <div class="text-sm uppercase tracking-wider text-gray-400 font-semibold">
          Crecimiento medio
        </div>
      </div>

      <!-- Stat 2 -->
      <div data-aos="fade-up" data-aos-delay="100">
        <div class="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
          200+
        </div>
        <div class="text-sm uppercase tracking-wider text-gray-400 font-semibold">
          Clientes activos
        </div>
      </div>

      [... 2 stats más]

    </div>
  </div>
</section>
```

---

### 4. Testimonials Section

**Elementos clave:**
- Cards con hover effect
- Avatares circulares (imágenes reales, no iniciales)
- Rating con estrellas o quote icon
- Grid de 3 columnas

```html
<section class="lumen-testimonials py-12 md:py-20">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">

    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12" data-aos="zoom-out">
      Lo que dicen nuestros clientes
    </h2>

    <div class="grid md:grid-cols-3 gap-6">

      <!-- Testimonial 1 -->
      <div class="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1" data-aos="fade-up">
        <!-- Quote icon -->
        <svg class="w-8 h-8 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>

        <p class="text-gray-300 mb-6 leading-relaxed">
          Nova Digital transformó completamente nuestra presencia online. En 3 meses triplicamos el tráfico orgánico.
        </p>

        <div class="flex items-center">
          <img class="w-12 h-12 rounded-full mr-4 border-2 border-blue-500/30"
               src="https://i.pravatar.cc/150?img=1"
               alt="María Rodríguez" />
          <div>
            <div class="font-semibold text-gray-200">María Rodríguez</div>
            <div class="text-sm text-blue-500">CEO — TechStartup.es</div>
          </div>
        </div>
      </div>

      [... 2 testimonials más]

    </div>
  </div>
</section>
```

---

### 5. CTA Final Section

**Elementos clave:**
- Gradient background fuerte
- Glow overlay effect
- Single focused CTA
- Texto contrastante (blanco sobre gradient)

```html
<section class="lumen-cta py-12 md:py-20">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-20 overflow-hidden">

      <!-- Glow effect -->
      <div class="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none"></div>

      <!-- Content -->
      <div class="relative text-center">
        <h2 class="text-3xl md:text-5xl font-bold text-white mb-6" data-aos="zoom-out">
          ¿Listo para transformar tu negocio?
        </h2>
        <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto" data-aos="zoom-out" data-aos-delay="100">
          Únete a más de 200 empresas que ya están viendo resultados reales
        </p>
        <div data-aos="zoom-out" data-aos-delay="200">
          <a class="btn bg-white text-blue-600 hover:bg-gray-100 shadow-2xl font-semibold px-8 py-4 text-lg" href="#contacto">
            Empezar ahora →
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
```

---

## 🎨 Sistema de Colores (Cruip Quality)

```css
:root {
  /* Base colors */
  --color-gray-900: #111827;
  --color-gray-800: #1F2937;
  --color-gray-700: #374151;
  --color-gray-400: #9CA3AF;
  --color-gray-300: #D1D5DB;
  --color-gray-200: #E5E7EB;

  /* Brand colors */
  --color-blue-600: #2563EB;
  --color-blue-500: #3B82F6;
  --color-blue-400: #60A5FA;
  --color-blue-200: #BFDBFE;

  --color-purple-600: #9333EA;
  --color-purple-500: #A855F7;
  --color-purple-400: #C084FC;

  --color-pink-600: #DB2777;
  --color-pink-500: #EC4899;

  /* Gradients */
  --gradient-primary: linear-gradient(to top, #2563EB, #60A5FA);
  --gradient-secondary: linear-gradient(to right, #3B82F6, #A855F7);
  --gradient-cta: linear-gradient(to right, #2563EB, #9333EA);

  /* Radial gradients for icons */
  --radial-blue-pink: radial-gradient(circle, rgba(59,130,246,.64) 0%, rgba(244,114,182,.876) 100%);
  --radial-purple-pink: radial-gradient(circle, rgba(139,92,246,.64) 0%, rgba(236,72,153,.876) 100%);
  --radial-green-blue: radial-gradient(circle, rgba(16,185,129,.64) 0%, rgba(59,130,246,.876) 100%);
}
```

---

## ✨ Efectos y Animaciones (Cruip Style)

### AOS (Animate On Scroll) - Obligatorio

**NO uses animaciones CSS básicas. USA siempre AOS:**

```html
<!-- ❌ MALO -->
<div class="fade-in">Content</div>

<!-- ✅ BUENO -->
<div data-aos="zoom-out">Content</div>
<div data-aos="fade-up" data-aos-delay="100">Content</div>
<div data-aos="slide-up" data-aos-delay="200">Content</div>
```

**Configuración AOS:**
```javascript
AOS.init({
  duration: 600,
  easing: 'ease-out-cubic',
  once: true,
  offset: 50
});
```

### Hover Effects Profesionales

```css
/* Buttons con translate suave */
.btn {
  @apply transition-all duration-150 ease-in-out;
}
.btn:hover {
  @apply -translate-y-0.5 shadow-xl;
}

/* Cards con translate y border */
.card {
  @apply transition-all duration-300 border border-gray-700;
}
.card:hover {
  @apply -translate-y-1 border-blue-500/50;
}

/* Arrow icons con translate en hover */
.group:hover .arrow {
  @apply translate-x-0.5;
}
```

---

## 📏 Spacing & Typography (Cruip Standards)

```css
/* Section spacing */
.section {
  @apply py-12 md:py-20;
}

/* Container widths */
.container {
  @apply max-w-6xl mx-auto px-4 sm:px-6;
}

/* Headings */
.h1 { @apply text-5xl md:text-6xl font-bold leading-tight; }
.h2 { @apply text-3xl md:text-4xl font-bold; }
.h3 { @apply text-2xl md:text-3xl font-semibold; }
.h4 { @apply text-xl font-semibold; }

/* Body text */
.text-lg { @apply text-lg leading-relaxed; }
.text-xl { @apply text-xl leading-relaxed; }

/* Muted text */
.text-muted { @apply text-gray-400; }
```

---

## 🚀 Checklist de Calidad

Antes de considerar un theme "terminado", verifica:

- [ ] Todos los iconos son SVG con gradientes radiales (NO emojis)
- [ ] Todas las secciones tienen animaciones AOS
- [ ] Los botones tienen efectos hover con translate
- [ ] Las cards tienen hover effects
- [ ] Los gradientes usan las paletas definidas
- [ ] La tipografía sigue la jerarquía definida
- [ ] El spacing es consistente (py-12 md:py-20)
- [ ] Los números/stats tienen gradientes text
- [ ] Los badges tienen efectos de borde con ::before
- [ ] Las imágenes de testimonials son reales (pravatar.cc)
- [ ] Responsive funciona en los 3 breakpoints
- [ ] Los CTAs tienen arrows con group-hover effects

---

<div align="center">
  <p>🔨 Usa estos patrones para generar themes de CALIDAD PROFESIONAL</p>
  <p>NO aceptes menos - estos son los standards de AnvilWP</p>
</div>
