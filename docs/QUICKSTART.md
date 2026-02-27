# 🔨 AnvilWP Quick Start

**Crea tu propio theme de WordPress en 5 minutos, sin código.**

AnvilWP **genera un theme personalizado** para tu negocio. No es un builder - es **TU theme** que puedes instalar en cualquier WordPress.

---

## 🚀 Opción 1: Para Usuarios (Web App)

### Paso 1: Genera tu theme

1. Ve a **anvilwp.com/create**
2. Completa el formulario:
   ```
   ¿Qué tipo de negocio tienes?
   → Restaurante / Agencia / eCommerce / Blog / SaaS / Otro

   Nombre de tu negocio:
   → [Ej: Restaurante Michu]

   ¿Qué quieres destacar? (elige 3-4):
   → ☑ Menú / Galería de fotos
   → ☑ Reservas online
   → ☑ Testimonios de clientes
   → ☑ Ubicación y horarios

   Estilo visual:
   → Dark Neon (predeterminado) / Light Modern / Colorful / Minimal
   ```

3. Click en **"Generar mi theme"**
   - AnvilWP crea un theme completo personalizado
   - Preview en tiempo real

4. **Descarga**: `restaurante-michu-theme.zip`

### Paso 2: Instala en WordPress

**¿No tienes WordPress aún?**
- Hosting recomendado: [Hostinger](https://hostinger.com) (€2/mes con WordPress instalado)
- O prueba gratis: [InstaWP](https://instawp.com) (WordPress temporal)

**Si ya tienes WordPress:**

1. Accede a tu panel de WordPress (`tudominio.com/wp-admin`)
2. Ve a **Apariencia → Temas**
3. Click en **Añadir nuevo → Subir tema**
4. Selecciona tu archivo `restaurante-michu-theme.zip`
5. Click en **Instalar ahora**
6. Click en **Activar**

🎉 **¡Listo!** Tu web está online con tu theme personalizado.

### Paso 3: Personaliza el contenido

1. Ve a **Páginas** en WordPress
2. Edita la página "Inicio"
3. Cambia textos, imágenes y colores usando Gutenberg
4. Todo es editable - es tu theme, tu código

---

## 💻 Opción 2: Para Developers (Claude Code)

### Requisitos previos

- Claude Code instalado
- WordPress local (MAMP, Local, o similar)
- Conocimientos básicos de terminal

### Generar theme con Claude Code

1. **Abre Claude Code** en tu terminal
2. **Navega a tu directorio de themes:**
   ```bash
   cd ~/Sites/mi-proyecto/wp-content/themes/
   ```

3. **Dile a Claude:**
   ```
   "Generate a complete AnvilWP theme for a [type of business].

   Business: [Business name]
   Type: [Restaurant / Agency / eCommerce / etc.]
   Sections needed: [Hero, Services, Menu, Testimonials, Contact]
   Style: Dark neon aesthetic (AnvilWP style)

   Include:
   - All pattern files (hero, services, etc.)
   - Built-in contact form
   - SEO meta tags
   - Schema.org markup
   - Cookie consent
   - Responsive design

   Theme name: [business-name-theme]"
   ```

4. **Claude genera automáticamente:**
   ```
   business-name-theme/
   ├── style.css
   ├── functions.php
   ├── theme.json
   ├── assets/
   │   ├── css/theme.css
   │   └── js/anvilwp.js
   ├── patterns/
   │   ├── hero.php
   │   ├── services.php
   │   └── ...
   ├── parts/
   │   ├── header.html
   │   └── footer.html
   └── templates/
       └── front-page.html
   ```

5. **Activa el theme** en WordPress:
   ```bash
   # Opción A: WP-CLI
   wp theme activate business-name-theme

   # Opción B: Panel de WordPress
   Apariencia → Temas → Activar
   ```

### Editar y personalizar

```bash
# Abre el theme en tu editor
code ~/Sites/mi-proyecto/wp-content/themes/business-name-theme/

# Los archivos principales a editar:
# - patterns/*.php → Secciones de la página
# - assets/css/theme.css → Estilos y colores
# - functions.php → Funcionalidades
```

### Deploy a producción

**Opción A: Via FTP**
```bash
# Comprime el theme
cd ~/Sites/mi-proyecto/wp-content/themes/
zip -r business-name-theme.zip business-name-theme/

# Sube via FTP o instala en el panel de WordPress del servidor
```

**Opción B: Via Git**
```bash
cd business-name-theme/
git init
git add .
git commit -m "Initial theme"
git remote add origin [your-repo]
git push origin main

# En el servidor:
cd wp-content/themes/
git clone [your-repo]
```

**Opción C: WP-CLI en servidor**
```bash
# Si tienes SSH al servidor
ssh user@server
cd /path/to/wp-content/themes/
# Sube el theme y actívalo
wp theme activate business-name-theme
```

---

## 🎨 Personalización Avanzada

### Cambiar colores del theme

Edita `assets/css/theme.css`:
```css
:root {
  --c-primary:   #0A1E3D;    /* Azul oscuro */
  --c-accent:    #3B82F6;    /* Azul brillante */
  --c-accent2:   #8B5CF6;    /* Púrpura */
  --c-bg:        #0d1117;    /* Fondo */
  --c-text:      #e2e8f0;    /* Texto */
}
```

### Añadir nuevas secciones

1. Crea un nuevo pattern en `patterns/mi-seccion.php`
2. Usa bloques nativos de Gutenberg
3. Añade clases CSS personalizadas
4. Registra el pattern en `functions.php` (opcional)

### Cambiar tipografía

Edita el import en `assets/css/theme.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE:wght@400;600;700&display=swap');
```

---

## 📦 Incluido en cada theme generado

### ✅ Funcionalidades sin plugins:

- **SEO Built-in**: Open Graph, Twitter Cards, canonical URLs
- **Schema.org**: JSON-LD structured data
- **Contact Form**: REST API endpoint `/wp-json/anvilwp/v1/contact`
- **Cookie Consent**: GDPR-compliant banner
- **Performance**: Cleaned WordPress head, optimized assets

### ✅ Patterns pre-diseñados:

- Hero con grid background y glow effect
- Services/Features con iconos gradient
- Stats/Numbers con animaciones
- Testimonials con avatares
- Team con fotos profesionales
- CTA call-to-action
- Contact form integrado

### ✅ Responsive:
- Desktop: 1200px-1400px content width
- Tablet: 900px breakpoint
- Mobile: 600px breakpoint

---

## ❓ FAQ

**P: ¿Es gratis?**
R: Sí, AnvilWP es GPL-2.0. Solo pagas hosting (~€2-10/mes).

**P: ¿Puedo usar mi theme en múltiples sitios?**
R: Sí, es tu código. Úsalo donde quieras.

**P: ¿Necesito mantener AnvilWP instalado?**
R: No. Una vez generado, el theme es independiente.

**P: ¿Puedo editar el código?**
R: Sí, es código limpio y editable. No hay ofuscación.

**P: ¿Funciona con plugins?**
R: Sí, es un theme normal de WordPress. Compatible con WooCommerce, Yoast, etc.

**P: ¿Y si no sé programar?**
R: Usa la web app (anvilwp.com/create). Genera todo sin código.

**P: ¿Puedo vender sitios hechos con AnvilWP?**
R: Sí, usa los themes generados para clientes comerciales.

**P: ¿Qué hosting recomiendan?**
R: Hostinger (barato), Cloudways (pro), o cualquiera con WordPress.

---

## 🆘 ¿Necesitas ayuda?

- 📖 **Docs completas**: [docs.anvilwp.com](https://docs.anvilwp.com)
- 💬 **Discord community**: [discord.gg/anvilwp](https://discord.gg/anvilwp)
- 🐛 **Report bugs**: [GitHub Issues](https://github.com/Josusanz/anvilwp/issues)
- 📧 **Email**: support@anvilwp.com

---

## ⚡ Quick Tips

1. **Empieza con la web app** si no programas
2. **Genera múltiples themes** para probar estilos
3. **Edita en local primero** antes de subir a producción
4. **Usa Git** para versionar tus cambios
5. **Haz backups** antes de actualizar WordPress

---

<div align="center">
  <p>🔨 Forja tu web perfecta con AnvilWP</p>
  <p><a href="https://anvilwp.com">anvilwp.com</a></p>
</div>
