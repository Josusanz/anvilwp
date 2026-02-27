# AnvilWP Design System
> Extraído de los 20 templates premium de Cruip (aprende-themes)

## 📐 Principios de Diseño

### Visual Hierarchy
- Usar gradientes para crear profundidad y dirigir atención
- Iconos circulares con gradientes radiales para features
- Typography scale consistente para jerarquía clara
- Espaciado generoso entre secciones (80-120px)

### Dark Neon Aesthetic
- Background oscuro (#0d1117, #161b27)
- Accent colors brillantes (blue #3B82F6, purple #8B5CF6, pink #F472B6)
- Glassmorphism para superficies
- Glow effects con radial gradients

### Microinteracciones
- Hover effects suaves (transform, border-color, box-shadow)
- Animaciones con AOS (fade, zoom-out, slide)
- Transitions en 150-300ms con ease-in-out
- Arrow indicators con translate en hover

---

## 🎨 Design Tokens

### Colors

#### Base
```css
--c-bg-primary: #0d1117;      /* Background principal */
--c-bg-secondary: #161b27;     /* Superficies (cards, headers) */
--c-bg-tertiary: #1e2535;      /* Cards elevadas */
--c-text-primary: #e2e8f0;     /* Texto principal */
--c-text-secondary: #94a3b8;   /* Texto secundario/muted */
--c-text-tertiary: #64748b;    /* Texto disabled */
```

#### Brand Colors
```css
--c-blue-400: #60A5FA;
--c-blue-500: #3B82F6;
--c-blue-600: #2563EB;
--c-purple-500: #8B5CF6;
--c-purple-600: #7C3AED;
--c-pink-400: #F472B6;
--c-emerald-500: #10B981;
```

#### Semantic Colors
```css
--c-success: #10B981;
--c-warning: #F59E0B;
--c-error: #EF4444;
--c-info: #3B82F6;
```

### Typography

#### Font Families
```css
--font-heading: 'Plus Jakarta Sans', 'Uncut Sans', 'Cabinet Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
```

#### Font Scale
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
--text-7xl: 5rem;        /* 80px */
```

#### Font Weights
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

#### Line Heights
```css
--leading-tight: 1.2;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

#### Letter Spacing
```css
--tracking-tighter: -0.02em;
--tracking-tight: -0.01em;
--tracking-normal: 0;
--tracking-wide: 0.01em;
--tracking-wider: 0.02em;
```

### Spacing

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 80px;
--space-5xl: 120px;
```

#### Section Spacing
```css
--section-padding-mobile: 60px 0;
--section-padding-tablet: 80px 0;
--section-padding-desktop: 120px 0;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Colored shadows */
--shadow-blue: 0 10px 40px rgba(59, 130, 246, 0.3);
--shadow-purple: 0 10px 40px rgba(139, 92, 246, 0.3);
--shadow-glow: 0 0 40px rgba(59, 130, 246, 0.2);
```

### Gradients

```css
/* Linear Gradients */
--gradient-blue: linear-gradient(135deg, #3B82F6, #8B5CF6);
--gradient-purple: linear-gradient(135deg, #8B5CF6, #F472B6);
--gradient-button: linear-gradient(to top, #2563EB, #3B82F6);
--gradient-cta: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);

/* Radial Gradients (for glows) */
--gradient-glow-blue: radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 40%, transparent 70%);
--gradient-glow-center: radial-gradient(circle at center, rgba(59,130,246,0.2) 0%, transparent 70%);

/* Icon Gradients */
--gradient-icon: radial-gradient(circle, rgba(59,130,246,0.64) 0%, rgba(244,114,182,0.876) 100%);
```

### Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

---

## 🧩 Component Patterns

### 1. Hero Section

#### Variantes

**A) Hero con Radial Glow (Neon style)**
```
- Background: dark (#0d1117)
- Radial gradient en top center (blue-purple glow)
- Badge opcional con border + background
- Heading grande con gradient text accent
- Subtitle muted
- CTA button con gradient + shadow
- Spacing: 120px top, 80px bottom
```

**B) Hero con Stats Inline (Creative style)**
```
- Hero content + image lado a lado
- Stats con números grandes (2xl/3xl) + labels
- SVG decorations (underlines, shapes)
- Background con border-radius personalizado
```

**C) Hero con Illustration**
```
- SVG illustration como background
- Content centrado o alineado
- Multi-button CTAs (primary + secondary)
```

### 2. Features Section

#### Icon Cards con Radial Gradients
```
Estructura:
- Grid: 3 columnas desktop, 2 tablet, 1 mobile
- Icon: SVG 56x56px con radial gradient (blue-pink)
- Heading: h4, gray-200
- Description: text-lg, gray-400
- Spacing: gap-8 entre cards
- Animation: fade-in con delay escalonado (0, 200, 400ms)

Gradients para icons:
- Stop 1: #3B82F6 64% opacity en 0%
- Stop 2: #F472B6 87.6% opacity en 100%
- Circle background, 28px radius
```

### 3. Stats Section

```
Estructura:
- Inline flex con separadores (SVG arrows o dots)
- Números: text-2xl/3xl, font-extrabold, headings font
- Labels: text-base, gray-400/500
- Spacing: space-x-4 o space-x-6

Variantes:
- Con gradient en números
- Con icons antes de números
- Con animación counter-up
```

### 4. Testimonials

```
Estructura:
- Grid: 3 columnas desktop, 2 tablet, 1 mobile
- Card: bg-gray-800, padding 24px
- Avatar: 48x48px, rounded-full
- Quote: text-gray-400, leading-relaxed
- Author: name (gray-300) + company link (blue-500)
- Gradientes en top/bottom para fade effect

Layout:
<article class="bg-gray-800 p-6">
  <header><img avatar /></header>
  <div class="grow"><p>quote</p></div>
  <footer>name - company</footer>
</article>
```

### 5. Pricing Tables

```
Estructura:
- Grid: 3 columnas, gap-6
- Card: padding 24px, background gray-800 o transparent
- Badge "Most Popular" en top-right
- Price: grande (4xl), currency small (3xl)
- Features list con checkmarks (emerald-500)
- CTA button con gradient

Destacado:
- Background gray-800
- Badge con gradient icon + emerald colors
- Border o shadow más prominente
```

### 6. CTA Section

```
Background:
- Gradient (blue-600 to purple-500)
- Illustration SVG en right side
- Border-radius: sm (4-8px)
- Padding: 64px desktop, 40px mobile

Content:
- Heading: 4xl, bold
- Subtitle: blue-200 (lighter than white)
- Button: contrast background (white o blue-400)
- Layout: flex row (desktop), column (mobile)
```

### 7. Cards (General)

```css
Base card:
.card {
  background: var(--c-bg-tertiary);
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
```

### 8. Buttons

```css
Primary (gradient):
.btn-primary {
  background: linear-gradient(to top, #2563EB, #3B82F6);
  color: white;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 10px 40px rgba(59,130,246,0.3);
  transition: 150ms ease-in-out;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(to top, #2563EB, #60A5FA);
}

Arrow indicator:
<span class="group-hover:translate-x-0.5 transition-transform">→</span>
```

---

## 🎭 Visual Effects

### Radial Glow (Hero background)

```css
.hero-glow::before {
  content: '';
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 300px;
  background: radial-gradient(
    ellipse,
    rgba(59,130,246,0.15) 0%,
    rgba(139,92,246,0.1) 40%,
    transparent 70%
  );
  z-index: 0;
  pointer-events: none;
}
```

### Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Glassmorphism

```css
.glass {
  background: rgba(22, 27, 39, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Grid Pattern Background

```css
.grid-pattern {
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

---

## 🎬 Animations

### AOS (Animate On Scroll)

```html
<!-- Fade in -->
<div data-aos="fade">...</div>

<!-- Zoom out -->
<div data-aos="zoom-out">...</div>

<!-- With delay -->
<div data-aos="fade" data-aos-delay="200">...</div>

<!-- Staggered animations -->
<div data-aos="fade" data-aos-anchor="[data-aos-id-cards]">Card 1</div>
<div data-aos="fade" data-aos-anchor="[data-aos-id-cards]" data-aos-delay="100">Card 2</div>
<div data-aos="fade" data-aos-anchor="[data-aos-id-cards]" data-aos-delay="200">Card 3</div>
```

### Hover Animations

```css
/* Card lift */
.card-lift:hover {
  transform: translateY(-8px);
}

/* Button arrow */
.btn-arrow:hover .arrow {
  transform: translateX(4px);
}

/* Scale on hover */
.scale-hover:hover {
  transform: scale(1.05);
}
```

---

## 📱 Responsive Patterns

### Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* Tablet */
--breakpoint-md: 768px;   /* Tablet landscape */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
```

### Grid Patterns

```css
/* Features grid */
.features-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
}
```

### Typography Responsive

```css
/* Fluid typography */
h1 {
  font-size: clamp(2.5rem, 5vw, 5rem);
}

h2 {
  font-size: clamp(2rem, 4vw, 3.75rem);
}

/* Section padding */
.section {
  padding: clamp(60px, 10vw, 120px) 0;
}
```

---

## 🎯 Best Practices

### Spacing
- Use consistent spacing scale (8px base)
- Section spacing: 80-120px desktop, 60-80px mobile
- Card padding: 24-32px
- Grid gap: 24-32px desktop, 16-24px mobile

### Typography
- Max 2 font families (heading + body)
- Heading font: 600-900 weight
- Body font: 300-600 weight
- Letter spacing: -0.01em para grandes tamaños

### Colors
- Use CSS variables para consistencia
- Limit palette: 2-3 accent colors
- Always maintain 4.5:1 contrast ratio
- Use gradientes para CTAs y highlights

### Performance
- Lazy load images
- Use SVG para icons
- Minimize animations en mobile
- Preload critical fonts

---

## 📦 WordPress Block Mapping

| Component | WordPress Block |
|-----------|----------------|
| Hero | `wp:group` con pattern custom |
| Features | `wp:columns` con `wp:column` |
| Stats | `wp:group` con `layout:flex` |
| Testimonials | `wp:group` con `wp:quote` o custom |
| Pricing | `wp:columns` con cards custom |
| CTA | `wp:group` con `align:full` |
| Buttons | `wp:buttons` con `wp:button` |

Ver `/wordpress-patterns-detailed.md` para reglas específicas de WordPress.
