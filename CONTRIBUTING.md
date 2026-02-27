# Contributing to AnvilWP

First off, thank you for considering contributing to AnvilWP! It's people like you that make AnvilWP such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (WordPress version, PHP version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the WordPress Coding Standards
- Include appropriate test coverage
- Update documentation as needed
- End all files with a newline

## Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/Josusanz/anvilwp.git
cd anvilwp

# Install dependencies (if any)
npm install

# Create a branch
git checkout -b feature/my-new-feature
```

### Coding Standards

#### WordPress Patterns
- Use native Gutenberg blocks only
- Never use `wp:html` for structural layout
- Follow block validation rules strictly
- Include all WordPress layout classes

#### CSS
- Use CSS custom properties for theming
- Use longhand properties (padding-top, not padding shorthand)
- Mobile-first responsive design
- Include leading zeros (0.85rem not .85rem)

#### PHP
- Follow WordPress PHP Coding Standards
- Use proper escaping and sanitization
- Add inline documentation for complex functions
- Use meaningful variable names

#### JavaScript
- Use vanilla JavaScript (no jQuery)
- Use modern ES6+ syntax
- Add comments for complex logic
- Handle errors gracefully

### Adding New Patterns

When adding a new block pattern:

1. Create the pattern file in `examples/patterns/`
2. Follow the quality standards in DESIGN-PATTERNS.md
3. Test in WordPress 6.4+
4. Ensure responsive design works
5. Add documentation

Example pattern structure:
```php
<?php
/**
 * Title: Pattern Name
 * Slug: anvilwp/pattern-name
 * Categories: anvilwp
 * Description: Brief description of what this pattern does
 */
?>
<!-- wp:group ... -->
<!-- Pattern content -->
<!-- /wp:group -->
```

### Testing

Before submitting a pull request:

1. **Test in WordPress**:
   - Install in a fresh WordPress 6.4+ installation
   - Test all patterns
   - Verify responsive design
   - Check browser compatibility (Chrome, Firefox, Safari)

2. **Validate HTML**:
   - Ensure valid HTML5
   - Check accessibility with axe DevTools

3. **Check Performance**:
   - Run Google PageSpeed Insights
   - Optimize images
   - Minimize CSS/JS

## Commit Message Guidelines

Use clear and meaningful commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

Examples:
```
Add testimonials pattern with avatar support

Fix responsive layout issue in services section

Update documentation for pattern creation
```

## Pattern Quality Standards

All patterns must meet these quality standards:

### Design
- Follow Cruip/Neon aesthetic guidelines
- Use SVG icons with radial gradients
- Include smooth animations (AOS or CSS)
- Proper hover states and transitions
- Professional spacing and alignment

### Code
- Clean, readable, documented code
- Proper WordPress block structure
- All layout classes included
- Responsive at all breakpoints
- Accessible to screen readers

### Performance
- Optimized images (WebP when possible)
- Minimal CSS (no unused styles)
- No external dependencies unless necessary
- Fast load times (<3s on 3G)

## Documentation

When adding features or patterns:

- Update README.md if needed
- Add examples to DESIGN-PATTERNS.md
- Include inline code comments
- Update CHANGELOG.md

## Questions?

Feel free to:
- Open an issue with the "question" label
- Join our Discord community
- Email us at support@anvilwp.com

## License

By contributing, you agree that your contributions will be licensed under the GPL-2.0 License.

---

Thank you for contributing to AnvilWP! 🔨
