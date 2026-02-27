# 🔨 AnvilWP

**AI-powered WordPress theme generator that forges beautiful websites in minutes.**

AnvilWP isn't a website builder that locks you in—it's a **theme generator** that creates professional, portable WordPress themes you can use anywhere. Generate a complete, customized theme for your business, download it as a .zip file, and install it on any WordPress site.

---

## ⚡ What Makes AnvilWP Different?

- **🎨 No Lock-In**: Get your own theme.zip file—it's YOUR code, use it anywhere
- **🚀 Fast**: Generate a complete theme in minutes, not weeks
- **💪 Professional Quality**: Built on Cruip/Neon design standards—not generic templates
- **🔧 Developer-Friendly**: Clean, editable code using native Gutenberg blocks
- **📦 Plugin-Free**: SEO, contact forms, schema.org, cookie consent—all built-in
- **🌙 Modern Aesthetic**: Dark neon theme with gradients and professional animations
- **📱 Fully Responsive**: Mobile-first design with proper breakpoints
- **⚙️ Two Modes**: Simple web app for users, Claude Code CLI for developers

---

## 🎯 Who Is This For?

### For Normal Users (Web App)
- Entrepreneurs who need a professional website fast
- Small businesses without development resources
- Agencies building client sites
- Anyone who wants a beautiful WordPress site without the complexity

### For Developers (Claude Code)
- Developers who want a powerful starting point
- Agencies building multiple client sites
- WordPress professionals who value clean code
- Anyone comfortable with CLI tools

---

## 🚀 Quick Start

### Option 1: Web App (Recommended for most users)

1. **Go to [anvilwp.com/create](https://anvilwp.com/create)**
2. **Fill out the form** (business type, name, sections needed)
3. **Generate your theme** (takes ~2 minutes)
4. **Download** your `business-name-theme.zip`
5. **Install** in WordPress: `Appearance → Themes → Add New → Upload`
6. **Done!** Your professional site is live

### Option 2: Claude Code (For developers)

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Navigate to your WordPress themes directory
cd ~/Sites/my-project/wp-content/themes/

# Launch Claude Code
claude

# Tell Claude:
"Generate a complete AnvilWP theme for a [type of business].

Business: [Business name]
Type: [Restaurant / Agency / eCommerce / etc.]
Sections needed: [Hero, Services, Testimonials, Contact]
Style: Dark neon aesthetic

Include all AnvilWP features: SEO, contact form, schema.org, cookies."
```

Claude will generate the complete theme automatically.

For detailed instructions, see [CLAUDE-CODE-GUIDE.md](./docs/CLAUDE-CODE-GUIDE.md).

---

## 📦 What's Included in Every Theme?

### Built-in Features (No Plugins Required)
- ✅ **SEO Tags**: Open Graph, Twitter Cards, canonical URLs
- ✅ **Schema.org**: JSON-LD structured data for better search results
- ✅ **Contact Form**: Native REST API endpoint with spam protection
- ✅ **Cookie Consent**: GDPR-compliant banner
- ✅ **Performance**: Cleaned WordPress head, optimized assets
- ✅ **Responsive**: Mobile-first with tablet/mobile breakpoints

### Pre-designed Sections (Patterns)
- 🎯 **Hero**: Grid background, gradient glow, call-to-action buttons
- 💼 **Services/Features**: Circular gradient icons, 3-column grid
- 📊 **Stats**: Large numbers with gradients, achievement showcase
- 💬 **Testimonials**: Customer reviews with avatars
- 👥 **Team**: Professional team member cards
- 📞 **Contact**: Built-in form with validation
- 🔥 **CTA**: Final call-to-action section

### Design System
- **Colors**: Professional dark theme with blue/purple accents
- **Typography**: Plus Jakarta Sans + Inter from Google Fonts
- **Icons**: SVG with radial gradients (Cruip/Neon quality)
- **Animations**: Smooth scroll animations (AOS)
- **Components**: Buttons, badges, cards, inputs—all styled

---

## 🎨 Customization

### Change Colors
Edit `assets/css/theme.css`:
```css
:root {
  --c-accent:    #3B82F6;    /* Blue - change to your brand color */
  --c-accent2:   #8B5CF6;    /* Purple - secondary accent */
  --c-bg:        #0d1117;    /* Background */
  --c-text:      #e2e8f0;    /* Text color */
}
```

### Change Typography
```css
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;600;700&display=swap');

h1, h2, h3, h4, h5, h6 {
  font-family: 'YOUR_FONT', sans-serif !important;
}
```

### Add Content
Use WordPress Gutenberg editor to customize all content directly in the dashboard.

---

## 📁 Theme Structure

```
your-theme/
├── style.css              # Theme metadata
├── functions.php          # PHP features (SEO, forms, etc.)
├── theme.json             # FSE configuration
├── assets/
│   ├── css/theme.css      # All styles
│   └── js/theme.js        # Contact form + cookies
├── patterns/              # Reusable sections
│   ├── hero.php
│   ├── services.php
│   ├── stats.php
│   ├── testimonials.php
│   ├── team.php
│   ├── cta.php
│   └── contact.php
├── parts/                 # Header/footer
│   ├── header.html
│   └── footer.html
└── templates/             # Page templates
    ├── index.html
    └── front-page.html
```

---

## 💻 For Developers

### Local Development

```bash
# Clone your generated theme
cd ~/Sites/my-project/wp-content/themes/
# Your theme is already there after generation

# Make changes
code your-theme-name/

# Test locally
open http://your-local-site.test

# Deploy to production
cd your-theme-name/
zip -r ../your-theme.zip . -x "*.git*" ".DS_Store"
# Upload to production WordPress
```

### Technical Stack
- **WordPress 6.4+**: Full Site Editing (FSE)
- **Native Gutenberg Blocks**: No custom blocks, pure WordPress
- **theme.json**: Modern theme configuration
- **CSS Custom Properties**: Easy theming
- **Vanilla JavaScript**: No jQuery dependency
- **REST API**: For contact form
- **GPL-2.0 License**: Free and open source

### Quality Standards
Themes generated by AnvilWP follow professional quality standards based on Cruip's Neon template:
- SVG icons with radial gradients
- Smooth scroll animations (AOS)
- Proper hover states and transitions
- Mobile-first responsive design
- Semantic HTML structure
- Accessible components

See [DESIGN-PATTERNS.md](./docs/DESIGN-PATTERNS.md) for detailed specifications.

---

## 🌍 Deployment

### Option A: Traditional Hosting (Hostinger, SiteGround, etc.)

1. **Upload theme via FTP**:
   ```bash
   # Compress theme
   zip -r my-theme.zip my-theme/
   # Upload to: /wp-content/themes/
   ```

2. **Or via WordPress Dashboard**:
   - Go to `Appearance → Themes → Add New → Upload Theme`
   - Choose your `my-theme.zip` file
   - Click "Install Now" → "Activate"

### Option B: WP-CLI (if you have SSH access)

```bash
ssh user@yourserver.com
cd /path/to/wp-content/themes/
# Upload your theme
wp theme activate my-theme-name
```

### Option C: Git Deployment

```bash
# Initialize git in your theme
cd my-theme/
git init
git add .
git commit -m "Initial theme"
git remote add origin https://github.com/Josusanz/my-theme.git
git push -u origin main

# On server:
cd /path/to/wp-content/themes/
git clone https://github.com/Josusanz/my-theme.git
wp theme activate my-theme
```

---

## ❓ FAQ

**Q: Is AnvilWP free?**
A: Yes, AnvilWP is GPL-2.0 licensed. You only pay for WordPress hosting (~€2-10/month).

**Q: Can I use my theme on multiple sites?**
A: Yes! It's your code. Use it on as many sites as you want.

**Q: Do I need to keep AnvilWP installed?**
A: No. Once generated, the theme is completely independent.

**Q: Can I edit the code?**
A: Absolutely! The code is clean, documented, and yours to modify.

**Q: Does it work with plugins?**
A: Yes, it's a standard WordPress theme. Works with WooCommerce, Yoast, ACF, etc.

**Q: What if I don't know how to code?**
A: Use the web app at anvilwp.com/create—no coding required.

**Q: Can I sell websites made with AnvilWP?**
A: Yes, use the generated themes for commercial client projects.

**Q: What hosting do you recommend?**
A: [Hostinger](https://hostinger.com) (budget), [Cloudways](https://cloudways.com) (pro), or any WordPress-compatible host.

**Q: Is there vendor lock-in?**
A: No. You get a standard WordPress theme. Move it anywhere, anytime.

**Q: What about updates and security?**
A: Your theme is based on WordPress core blocks, which are maintained by WordPress. No proprietary code to update.

---

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICKSTART.md)**: Complete guide for users and developers
- **[Claude Code Guide](./docs/CLAUDE-CODE-GUIDE.md)**: Developer guide with prompt templates
- **[Design Patterns](./docs/DESIGN-PATTERNS.md)**: Quality standards and component specs
- **[Contributing](./CONTRIBUTING.md)**: How to contribute to AnvilWP
- **[Changelog](./CHANGELOG.md)**: Version history and updates

---

## 🛠️ Technology

- **WordPress 6.4+** with Full Site Editing
- **Native Gutenberg Blocks** (no custom blocks)
- **theme.json** for modern configuration
- **CSS Custom Properties** for theming
- **Vanilla JavaScript** (no dependencies)
- **REST API** for forms
- **GPL-2.0 License**

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, improving documentation, or adding new patterns:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-pattern`)
3. Commit your changes (`git commit -m 'Add amazing pattern'`)
4. Push to the branch (`git push origin feature/amazing-pattern`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

AnvilWP is licensed under the [GPL-2.0 License](./LICENSE), just like WordPress itself. This means:

- ✅ Free to use commercially
- ✅ Free to modify and distribute
- ✅ Free to use on unlimited sites
- ✅ Your generated themes are yours to license however you want

---

## 🆘 Support

- **📖 Documentation**: [docs.anvilwp.com](https://docs.anvilwp.com)
- **💬 Community**: [Discord](https://discord.gg/anvilwp)
- **🐛 Report Bugs**: [GitHub Issues](https://github.com/Josusanz/anvilwp/issues)
- **📧 Email**: support@anvilwp.com
- **𝕏 Twitter**: [@anvilwp](https://twitter.com/anvilwp)

---

## 🎯 Roadmap

- [x] Core theme generation
- [x] Dark neon aesthetic
- [x] Built-in SEO and forms
- [x] Claude Code integration
- [ ] Web app interface
- [ ] Additional design styles (light, minimal, colorful)
- [ ] WooCommerce patterns
- [ ] Multi-language support
- [ ] Theme customizer UI
- [ ] AI-powered content generation
- [ ] One-click hosting deployment

---

## ⭐ Show Your Support

If AnvilWP helped you build something great:

- ⭐ Star this repository
- 🐦 Share on Twitter with #AnvilWP
- 📝 Write a blog post about your experience
- 🤝 Contribute a new pattern or feature

---

<div align="center">
  <p><strong>🔨 Forge your perfect website with AnvilWP</strong></p>
  <p><a href="https://anvilwp.com">anvilwp.com</a></p>
  <p>Made with ❤️ for the WordPress community</p>
</div>
