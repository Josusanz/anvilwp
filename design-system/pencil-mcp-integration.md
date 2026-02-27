# Pencil MCP Integration for AnvilWP

## Overview

Integrar Pencil MCP permite a Claude generar diseños visuales primero, luego convertirlos a código WordPress. Esto garantiza diseños de mayor calidad y más consistentes.

## Architecture

```
User Input
    ↓
Claude + Pencil MCP (Visual Design)
    ↓
.pen File (Design Specification)
    ↓
Conversion Logic (pen → WordPress Blocks)
    ↓
WordPress Theme Files
```

## Implementation Strategy

### Phase 1: Style Guide Integration (COMPLETED ✅)

1. **Design System Created**: `/design-system/README.md`
   - Complete design tokens
   - Component patterns
   - Visual effects library

2. **SVG Icons Library**: `/design-system/svg-icons.md`
   - 8+ pre-built gradient icons
   - WordPress integration examples

3. **Improved Prompt**: `/design-system/improved-prompt.md`
   - Detailed design guidelines
   - Business-specific templates
   - Quality checklist

### Phase 2: Text-Based Generation with Style Guides (COMPLETED ✅)

1. **Enhanced API Route**: `/app/api/generate-with-claude/route-improved.ts`
   - 8K token budget for rich content
   - Design system guidelines in prompt
   - Multiple section generation

2. **Pattern Generators**:
   - `pattern-generators.ts` - Core patterns
   - `pattern-generators-part2.ts` - Extended patterns
   - All patterns follow Cruip/Neon design system

3. **Advanced CSS**: `generateAdvancedCSS()`
   - Custom properties
   - Visual effects (glows, gradients)
   - Hover animations
   - Responsive utilities

### Phase 3: Pencil MCP Direct Integration (IN PROGRESS 🚧)

#### Prerequisites

1. **Pencil MCP Server Running**
   ```bash
   # Start Pencil MCP server (if available)
   npx @anthropic-ai/pencil-mcp
   ```

2. **Claude Desktop Configuration**
   ```json
   {
     "mcpServers": {
       "pencil": {
         "command": "npx",
         "args": ["@anthropic-ai/pencil-mcp"]
       }
     }
   }
   ```

#### Implementation Steps

**Step 1: Visual Design Generation**

```typescript
// In generate-with-pencil/route.ts
import { usePencilMCP } from '@/lib/pencil-mcp'

async function generateVisualDesign(userMessage: string) {
  // 1. Get style guide from Cruip templates
  const styleGuide = await getStyleGuide(['website', 'dark', 'neon'])

  // 2. Use Pencil MCP to generate visual design
  const design = await usePencilMCP({
    prompt: userMessage,
    styleGuide: styleGuide,
    designSystem: ANVILWP_DESIGN_SYSTEM,
    outputFormat: 'pen'
  })

  // 3. Get screenshot for preview
  const screenshot = await getPencilScreenshot(design.nodeId)

  return { design, screenshot }
}
```

**Step 2: .pen to WordPress Conversion**

```typescript
async function convertPenToWordPress(penFile: any, businessData: any) {
  // Read .pen file structure
  const nodes = await readPenNodes(penFile)

  // Map .pen components to WordPress blocks
  const wordPressBlocks = nodes.map(node => {
    switch(node.type) {
      case 'frame':
        return convertFrameToGroup(node)
      case 'text':
        return convertTextToParagraph(node)
      case 'rectangle':
        return convertRectangleToBlock(node)
      // ... more mappings
    }
  })

  // Generate WordPress patterns
  const patterns = generatePatternsFromBlocks(wordPressBlocks)

  return {
    patterns,
    theme.json: generateThemeJson(penFile.styles),
    css: generateCSSFromPen(penFile.styles)
  }
}
```

**Step 3: Component Mapping**

| Pencil Component | WordPress Block | Notes |
|------------------|----------------|-------|
| `frame` with `reusable:true` | Component pattern | Create reusable pattern |
| `frame` with `layout:vertical` | `wp:group` with vertical stack | Use constrained layout |
| `frame` with `layout:horizontal` | `wp:group` with flex | Horizontal layout |
| `text` | `wp:paragraph` or `wp:heading` | Based on fontSize |
| `rectangle` with `fill` | `wp:group` with background | Background color |
| `ellipse` (icon) | SVG embedded or emoji | Based on size |
| `group` of items | `wp:columns` | Grid layout |

### Phase 4: Live Preview Enhancement (TODO)

**Iframe Preview with Real WordPress Rendering**

```typescript
// In page.tsx - generatePreviewHTML()
function generateEnhancedPreview(themeData: any, patterns: string[]) {
  // Generate full HTML with:
  // 1. All generated CSS
  // 2. All patterns rendered
  // 3. Real WordPress block classes
  // 4. Interactive elements

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${themeData.businessName}</title>
  <style>
    ${fullThemeCSS}
    ${wordPressBlockCSS}
  </style>
</head>
<body>
  ${renderAllPatterns(patterns)}
  <script>
    // Add interactivity
    ${interactivityScript}
  </script>
</body>
</html>`
}
```

## Usage Examples

### Example 1: Restaurant Site with Visual Design

```typescript
POST /api/generate-with-pencil

{
  "userMessage": "Una web para mi restaurante italiano La Dolce Vita"
}

Response:
{
  "visualDesign": {
    "penFile": "path/to/design.pen",
    "screenshot": "base64_screenshot",
    "components": ["hero", "menu", "gallery", "location"]
  },
  "wordPressTheme": {
    "patterns": [...],
    "css": "...",
    "preview": "full_html_preview"
  }
}
```

### Example 2: Agency Portfolio with Custom Branding

```typescript
POST /api/generate-with-pencil

{
  "userMessage": "Portfolio para agencia de diseño, colores morado y amarillo neón"
}

// Claude uses Pencil MCP to:
// 1. Generate visual design with custom purple/yellow neon palette
// 2. Create components based on Cruip patterns
// 3. Convert to WordPress with custom CSS variables
// 4. Return preview + downloadable theme
```

## Benefits

### With Pencil MCP Integration:

1. **Visual Consistency**: Designs follow exact style guide rules
2. **Better Quality**: Visual-first approach ensures coherent layouts
3. **Faster Iteration**: Can tweak visual design before code generation
4. **Client Preview**: Show visual mockup before generating WordPress code
5. **Design System Enforcement**: All components use defined patterns

### Current Implementation (Text-Based):

- ✅ Still produces high-quality themes
- ✅ Follows Cruip/Neon design guidelines
- ✅ Generates professional patterns
- ❌ No visual preview before code generation
- ❌ Harder to ensure pixel-perfect layouts

## Roadmap

### Completed ✅
- [x] Design system documentation
- [x] SVG icon library
- [x] Improved prompt with design guidelines
- [x] Advanced CSS generation
- [x] Multiple pattern generators
- [x] Basic Pencil MCP endpoint structure

### In Progress 🚧
- [ ] Pencil MCP direct integration
- [ ] .pen to WordPress converter
- [ ] Enhanced preview HTML

### Planned 📋
- [ ] Component library in Pencil format
- [ ] Real-time design editing
- [ ] A/B testing different layouts
- [ ] Export to Figma/Sketch
- [ ] Design version history

## Testing

```bash
# Test current improved generation
curl -X POST http://localhost:3000/api/generate-with-claude \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Una web para mi restaurante italiano"}'

# Test visual generation (when Pencil MCP integrated)
curl -X POST http://localhost:3000/api/generate-with-pencil \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "Portfolio minimalista para fotógrafo"}'
```

## Migration Path

**Current Users (Text-Based):**
- Continue using `/api/generate-with-claude`
- Get improved designs with style guide prompts
- No breaking changes

**Future Users (Pencil MCP):**
- Use `/api/generate-with-pencil` for visual-first generation
- Get visual preview before code generation
- Option to edit design before exporting

**Hybrid Approach:**
- Generate visual design with Pencil
- Convert to WordPress blocks
- Allow text-based refinements
- Best of both worlds!

## Resources

- Design System: `/design-system/README.md`
- SVG Icons: `/design-system/svg-icons.md`
- Pattern Generators: `/app/api/generate-with-claude/pattern-generators*.ts`
- Pencil MCP Docs: https://github.com/anthropics/anthropic-tools/pencil-mcp
