# 🤖 Guía Claude Code para AnvilWP

**Cómo generar themes completos de WordPress con Claude Code**

---

## 🎯 Objetivo

Usar Claude Code para generar un theme de WordPress completamente funcional y personalizado basado en AnvilWP, sin escribir código manualmente.

---

## 📋 Prerequisitos

1. **Claude Code instalado** y configurado
2. **WordPress local** instalado (MAMP, Local, Laragon, o Docker)
3. **Acceso a terminal** básico

---

## 🚀 Prompt Master para Generar Themes

### Template Base

Copia y pega este prompt en Claude Code, personalizando los valores entre corchetes:

```
Generate a complete WordPress theme based on AnvilWP architecture for a [TYPE_OF_BUSINESS].

## Business Details:
- Name: [BUSINESS_NAME]
- Type: [Restaurant / Agency / SaaS / eCommerce / Portfolio / Other]
- Tagline: [One-line description]
- Primary CTA: [e.g., "Book a table" / "Get started" / "Contact us"]

## Theme Configuration:
- Theme Name: [business-name-wp]
- Theme URI: https://[businessdomain.com]
- Author: [Your name or company]
- Description: [Short description of the business]
- Text Domain: [business-name-wp]

## Required Sections (Patterns):
1. Hero - [Describe what should be highlighted]
2. [Services/Products/Features] - [What to showcase]
3. [Stats/Numbers/Achievements] - [Key metrics to display]
4. Testimonials - [Social proof]
5. [Team/About] - [Optional]
6. CTA - [Final call to action]
7. Contact Form - [With fields: name, email, message, phone]

## Design Preferences:
- Style: Dark neon aesthetic (AnvilWP default)
- Primary color: #3B82F6 (or custom: [#HEXCODE])
- Secondary color: #8B5CF6 (or custom: [#HEXCODE])
- Font pairing: Plus Jakarta Sans + Inter (or suggest alternatives)

## Technical Requirements:
✓ Use native Gutenberg blocks only (no wp:html)
✓ Include built-in SEO (Open Graph, Twitter Cards)
✓ Include Schema.org JSON-LD for Organization
✓ Include native contact form with REST API endpoint
✓ Include cookie consent banner (GDPR)
✓ Remove WordPress bloat (emoji, generator, etc.)
✓ Mobile-first responsive design (900px, 600px breakpoints)
✓ Performance optimized (no unnecessary dependencies)

## File Structure:
Create complete theme with:
- style.css (theme metadata)
- functions.php (built-in features)
- theme.json (FSE configuration)
- assets/css/theme.css (all styles)
- assets/js/[theme-name].js (contact form + cookies)
- patterns/ (all section patterns)
- parts/ (header.html, footer.html)
- templates/ (index.html, front-page.html)

## WordPress Standards:
- Follow WordPress Block Pattern rules (see memory)
- CSS longhand only: padding-top, padding-bottom (not shorthand)
- Include all layout classes (is-layout-*, wp-block-*)
- Use has-global-padding for full-width sections
- blockGap: "0px" in theme.json to avoid double spacing

## Content Generation:
- Generate realistic Spanish content for all sections
- Use business context for headlines and copy
- Include 4-6 testimonials with realistic names
- Suggest image placeholders (Unsplash URLs)

Start by creating the directory structure and then generate all files.
```

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Restaurante

```
Generate a complete WordPress theme based on AnvilWP architecture for a Restaurant.

## Business Details:
- Name: Restaurante Michu
- Type: Restaurant
- Tagline: Cocina mediterránea con alma
- Primary CTA: "Reservar mesa"

## Required Sections:
1. Hero - Imagen de plato destacado, call to action para reservas
2. Menú - Categorías: Entrantes, Principales, Postres, Bebidas
3. Galería - Fotos del restaurante y platos
4. Testimonials - Reseñas de clientes
5. Ubicación - Mapa y horarios
6. Contact Form - Reservas y consultas

[... resto del template]
```

### Ejemplo 2: Agencia Digital

```
Generate a complete WordPress theme based on AnvilWP architecture for a Digital Agency.

## Business Details:
- Name: Nova Digital
- Type: Agency
- Tagline: Estrategia digital que transforma negocios
- Primary CTA: "Empieza gratis"

## Required Sections:
1. Hero - Propuesta de valor, badge "Nuevo", CTAs
2. Services - 6 servicios (Estrategia, Performance, Diseño, SEO, Automatización, Analytics)
3. Stats - Números clave (clientes, proyectos, ROI, años)
4. Testimonials - 6 testimonios con nombres y empresas
5. Team - 4 miembros con fotos y roles
6. CTA - Call to action final
7. Contact Form - Lead generation

[... resto del template]
```

### Ejemplo 3: SaaS

```
Generate a complete WordPress theme based on AnvilWP architecture for a SaaS product.

## Business Details:
- Name: TaskFlow
- Type: SaaS
- Tagline: Project management made simple
- Primary CTA: "Start free trial"

## Required Sections:
1. Hero - Product screenshot, feature highlights, sign up CTA
2. Features - 6 key features with icons
3. How it Works - 3-step process
4. Pricing - 3 tiers (Free, Pro, Enterprise)
5. Testimonials - Customer success stories
6. Integration - Logos of integrated tools
7. FAQ - 8-10 common questions
8. Contact Form - Sales inquiries

[... resto del template]
```

---

## 🔧 Workflow Recomendado

### Fase 1: Generación (5-10 min)

1. **Prepara el entorno:**
   ```bash
   cd ~/Sites/mi-proyecto/wp-content/themes/
   ```

2. **Lanza Claude Code:**
   ```bash
   claude
   ```

3. **Pega el prompt personalizado** y espera

4. **Claude genera automáticamente:**
   - Todos los archivos del theme
   - Estructura de directorios
   - Código funcional y comentado

### Fase 2: Revisión (2-3 min)

1. **Revisa los archivos generados:**
   ```bash
   ls -la [theme-name]/
   cat [theme-name]/style.css
   ```

2. **Verifica que incluye:**
   - ✓ Todos los patterns necesarios
   - ✓ Assets (CSS, JS)
   - ✓ Templates y parts
   - ✓ functions.php con features

### Fase 3: Activación (1 min)

1. **Activa el theme:**
   ```bash
   wp theme activate [theme-name]
   ```

2. **Abre el navegador:**
   ```bash
   open http://localhost:8080
   ```

### Fase 4: Ajustes (10-30 min)

1. **Personaliza contenido** en el editor de WordPress
2. **Ajusta colores** en `assets/css/theme.css` si es necesario
3. **Cambia imágenes** por las reales del cliente
4. **Prueba responsive** en diferentes dispositivos

---

## 💡 Tips Pro

### Para múltiples clientes

Crea un **template de prompt** y solo cambia business details:

```bash
# Guarda tu template base
echo "[TU PROMPT MASTER]" > ~/anvil-prompt-template.txt

# Para cada cliente, copia y personaliza
cp ~/anvil-prompt-template.txt ~/cliente-X-prompt.txt
# Edita y pega en Claude
```

### Iteración rápida

Si algo no sale bien:

```
"Regenerate the [hero/services/etc] pattern with these changes:
- [Cambio 1]
- [Cambio 2]
Keep everything else the same."
```

### Versionado

```bash
cd [theme-name]/
git init
git add .
git commit -m "Initial theme generated by AnvilWP + Claude Code"
```

### Export para cliente

```bash
# Comprime el theme
cd ~/Sites/mi-proyecto/wp-content/themes/
zip -r cliente-theme.zip [theme-name]/ \
  -x "*.git*" "node_modules/*" ".DS_Store"

# Envía al cliente con instrucciones
```

---

## 🎨 Personalización Post-Generación

### Cambiar colores

```css
/* assets/css/theme.css */
:root {
  --c-accent: #YOUR_COLOR;
  --c-accent2: #YOUR_SECONDARY;
}
```

### Añadir Google Analytics

```php
/* functions.php - añade al final */
add_action('wp_head', function() {
    ?>
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    <?php
}, 99);
```

### Cambiar tipografía

```css
/* assets/css/theme.css - cambia el import */
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE:wght@400;600;700&display=swap');

h1,h2,h3,h4,h5,h6 {
  font-family: 'TU_FUENTE', sans-serif !important;
}
```

---

## 🐛 Troubleshooting

### "Theme no aparece en WordPress"

```bash
# Verifica que style.css existe y tiene el header correcto
cat [theme-name]/style.css | head -15
```

### "Estilos no se aplican"

```bash
# Verifica que theme.css está enlazado en functions.php
grep "theme.css" [theme-name]/functions.php
```

### "Contact form no funciona"

```bash
# Verifica el REST endpoint
wp rest list-routes | grep anvilwp
```

### "Patterns no aparecen"

```bash
# Verifica el registro de categoría
grep "register_block_pattern_category" [theme-name]/functions.php
```

---

## 📚 Recursos Adicionales

- **Memoria de proyecto**: `/Users/josu/.claude/projects/-Users-josu-wpclaude/memory/MEMORY.md`
- **Reglas de WordPress**: `wordpress-patterns-detailed.md`
- **CLAUDE.md del proyecto**: `/Users/josu/wpclaude/CLAUDE.md`

---

## ✅ Checklist Final

Antes de entregar al cliente:

- [ ] Theme activado y funcionando
- [ ] Todos los patterns instalados
- [ ] Contenido placeholder reemplazado
- [ ] Imágenes optimizadas
- [ ] Forms testeados (envía un test)
- [ ] SEO tags verificados (view source)
- [ ] Mobile responsive probado
- [ ] Cross-browser tested (Chrome, Safari, Firefox)
- [ ] Performance optimizado (Google PageSpeed)
- [ ] Backup creado
- [ ] Documentación entregada al cliente

---

<div align="center">
  <p>🔨 Forja themes profesionales en minutos con Claude Code + AnvilWP</p>
</div>
