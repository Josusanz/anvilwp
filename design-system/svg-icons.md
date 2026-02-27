# SVG Icons Library
> Icons con gradientes radiales estilo Cruip/Neon

## Icon Template Base

```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient cx="50%" cy="89.845%" fx="50%" fy="89.845%" r="89.85%" id="icon-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="icon-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none" fillRule="evenodd">
    <use fill="url(#icon-gradient)" xlinkHref="#icon-bg" />
    <!-- Icon content here -->
  </g>
</svg>
```

## Pre-built Icons

### 1. Expand Icon (Features/Scale)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="expand-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="expand-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#expand-gradient)" href="#expand-bg" />
    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
      <path d="M17 28h22" opacity=".64" />
      <path d="M20 23v-3h3M33 20h3v3M36 33v3h-3M23 36h-3v-3" />
    </g>
  </g>
</svg>
```

### 2. Code Icon (Developer Tools)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="code-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="code-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#code-gradient)" href="#code-bg" />
    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
      <path d="m22 24-4 4 4 4M34 24l4 4-4 4" />
      <path d="m26 36 4-16" opacity=".64" />
    </g>
  </g>
</svg>
```

### 3. Check Icon (Validation/Success)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="check-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="check-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#check-gradient)" href="#check-bg" />
    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
      <path d="m18 31 4 4 12-15" />
      <path d="M39 25h-3M39 30h-7M39 35H28" opacity=".64" />
    </g>
  </g>
</svg>
```

### 4. Rocket Icon (Speed/Launch)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="rocket-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="rocket-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#rocket-gradient)" href="#rocket-bg" />
    <g stroke="#FDF2F8" strokeLinecap="round" strokeWidth="2">
      <path d="M28 14v8M28 34v8M18 28h8M36 28h8" opacity=".64" />
      <circle cx="28" cy="28" r="4" />
    </g>
  </g>
</svg>
```

### 5. Shield Icon (Security)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="shield-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="shield-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#shield-gradient)" href="#shield-bg" />
    <path stroke="#FDF2F8" strokeWidth="2" d="M28 16l-8 4v6c0 4 3 7 8 9 5-2 8-5 8-9v-6l-8-4z" />
    <path stroke="#FDF2F8" strokeWidth="2" strokeLinecap="round" d="M24 28l3 3 5-6" opacity=".64" />
  </g>
</svg>
```

### 6. Lightning Icon (Performance)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="lightning-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="lightning-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#lightning-gradient)" href="#lightning-bg" />
    <path stroke="#FDF2F8" strokeWidth="2" strokeLinejoin="round" d="M30 14l-8 14h6l-2 14 8-14h-6l2-14z" />
  </g>
</svg>
```

### 7. Globe Icon (Global/International)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="globe-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="globe-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#globe-gradient)" href="#globe-bg" />
    <g stroke="#FDF2F8" strokeWidth="2">
      <circle cx="28" cy="28" r="10" />
      <path d="M28 18c-3 0-5 4.5-5 10s2 10 5 10 5-4.5 5-10-2-10-5-10z" opacity=".64" />
      <path d="M18 28h20M20 23h16M20 33h16" opacity=".64" />
    </g>
  </g>
</svg>
```

### 8. Users Icon (Community/Team)
```html
<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="users-gradient">
      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
    </radialGradient>
    <circle id="users-bg" cx="28" cy="28" r="28" />
  </defs>
  <g fill="none">
    <use fill="url(#users-gradient)" href="#users-bg" />
    <g stroke="#FDF2F8" strokeWidth="2" strokeLinecap="round">
      <circle cx="22" cy="24" r="3" />
      <circle cx="34" cy="24" r="3" opacity=".64" />
      <path d="M17 34c0-3 2.5-5 5-5s5 2 5 5" />
      <path d="M29 34c0-3 2.5-5 5-5s5 2 5 5" opacity=".64" />
    </g>
  </g>
</svg>
```

## Emoji Alternatives (Simpler)

Para diseños más simples, usar emojis grandes:

```
🚀 Launch/Speed
⚡ Performance
🎯 Target/Precision
🔒 Security
🌍 Global
👥 Team/Community
✨ Magic/Quality
💡 Ideas/Innovation
📈 Growth/Stats
🎨 Design/Creative
🔥 Popular/Hot
💼 Business/Professional
🏆 Achievement/Winner
⭐ Featured/Star
💎 Premium/Value
🛡️ Protection
🔑 Access/Key
📱 Mobile/Responsive
```

## Usage Guidelines

1. **Size**: Always use 56x56px para consistency
2. **Gradients**: Blue (#3B82F6) to Pink (#F472B6) es el default
3. **Stroke**: White (#FDF2F8) con width 2px
4. **Opacity**: Secondary elements en 0.64 opacity
5. **Spacing**: 16-24px margin bottom del icon al heading

## WordPress Implementation

```php
// En WordPress patterns, embedear como data URI o usar emoji
<!-- wp:image {"width":56,"height":56} -->
<figure class="wp-block-image">
  <svg width="56" height="56">...</svg>
</figure>
<!-- /wp:image -->

// O simplemente texto con emoji
<!-- wp:paragraph {"fontSize":"xxx-large"} -->
<p class="has-xxx-large-font-size">🚀</p>
<!-- /wp:paragraph -->
```
