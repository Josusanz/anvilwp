'use client'

import { useState, useEffect, useRef } from 'react'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

export default function CreatePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente para crear themes WordPress. Cuéntame, ¿qué tipo de web quieres crear?' },
    { role: 'assistant', content: 'Por ejemplo: "Una web para mi restaurante italiano" o "Un portfolio para mi agencia de diseño" o "Una tienda online de ropa"' },
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [themeZipUrl, setThemeZipUrl] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState('')
  const [themeData, setThemeData] = useState<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    // Parse user intent
    const parsed = parseUserIntent(userMessage)

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Perfecto, voy a crear ${parsed.description}. Esto incluirá:\n\n${parsed.sections.map(s => `✓ ${s}`).join('\n')}\n\n¿Quieres que empiece?`
    }])
  }

  const parseUserIntent = (message: string) => {
    const lower = message.toLowerCase()

    let businessType = 'Negocio'
    let businessName = 'Mi Web'
    let sections = ['Hero', 'Servicios', 'Contacto']

    // Detect business type
    if (lower.includes('restaurante') || lower.includes('comida') || lower.includes('bar')) {
      businessType = 'Restaurante'
      sections = ['Hero', 'Menú', 'Stats', 'Testimonios', 'Contacto']
    } else if (lower.includes('agencia') || lower.includes('marketing') || lower.includes('diseño')) {
      businessType = 'Agencia'
      sections = ['Hero', 'Servicios', 'Portfolio', 'Stats', 'Contacto']
    } else if (lower.includes('tienda') || lower.includes('ecommerce') || lower.includes('shop')) {
      businessType = 'eCommerce'
      sections = ['Hero', 'Productos', 'Categorías', 'Testimonios', 'CTA']
    } else if (lower.includes('blog') || lower.includes('revista') || lower.includes('noticias')) {
      businessType = 'Blog'
      sections = ['Hero', 'Últimos Posts', 'Categorías', 'Suscripción']
    } else if (lower.includes('saas') || lower.includes('app') || lower.includes('software')) {
      businessType = 'SaaS'
      sections = ['Hero', 'Features', 'Pricing', 'Testimonios', 'CTA']
    }

    // Extract business name (simple heuristic)
    const nameMatch = message.match(/(?:para|de|llamad[oa])\s+(?:mi\s+)?([^,\.]+?)(?:\s+que|\s+con|\.|,|$)/i)
    if (nameMatch) {
      businessName = nameMatch[1].trim()
    }

    return {
      businessType,
      businessName,
      sections,
      description: `una web ${businessType.toLowerCase()} profesional`
    }
  }

  const generateTheme = async () => {
    setIsGenerating(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '🚀 Generando tu theme WordPress...' }])

    try {
      // Get parsed data from last interaction
      const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || ''
      const parsed = parseUserIntent(lastUserMsg)

      const previewHtmlContent = generatePreviewHTML(parsed)
      setPreviewHtml(previewHtmlContent)

      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessages(prev => [...prev, { role: 'assistant', content: '✨ Creando estructura de archivos...' }])

      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessages(prev => [...prev, { role: 'assistant', content: '🎨 Aplicando diseño Cruip/Neon...' }])

      const response = await fetch('/api/generate-with-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: lastUserMsg,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      setThemeData(result)

      setMessages(prev => [...prev, { role: 'assistant', content: '📦 Empaquetando theme...' }])

      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      Object.entries(result.files).forEach(([path, content]) => {
        zip.file(path, content as string)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      setThemeZipUrl(url)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🎉 ¡Listo! Tu theme "${result.themeName}" está generado.\n\n✓ ${Object.keys(result.files).length} archivos creados\n✓ Diseño dark/neon profesional\n✓ Totalmente compatible con Gutenberg\n✓ Optimizado para WordPress 6.9+`
      }])

      setIsComplete(true)
    } catch (error) {
      console.error('Error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error al generar el theme: ${errorMsg}\n\nPor favor, intenta describirme tu web de otra forma.`
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePreviewHTML = (data: any) => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#0d1117; color:#e2e8f0; line-height:1.6; }
    h1,h2,h3 { font-family:'Plus Jakarta Sans',sans-serif; }
    .hero { padding:120px 20px 80px; text-align:center; position:relative; overflow:hidden; }
    .hero::before { content:''; position:absolute; top:-50%; left:50%; transform:translateX(-50%); width:800px; height:300px; background:radial-gradient(ellipse,rgba(59,130,246,0.15) 0%,rgba(139,92,246,0.1) 40%,transparent 70%); z-index:0; }
    .hero-content { position:relative; z-index:1; max-width:800px; margin:0 auto; }
    .badge { display:inline-block; padding:8px 16px; background:#1e2535; border:1px solid rgba(255,255,255,0.1); border-radius:50px; font-size:0.875rem; margin-bottom:24px; }
    h1 { font-size:clamp(2.5rem,5vw,4rem); margin-bottom:20px; }
    .gradient { background:linear-gradient(135deg,#3B82F6,#8B5CF6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .subtitle { font-size:1.25rem; color:#94a3b8; margin-bottom:40px; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(to top,#2563eb,#3b82f6); color:white; text-decoration:none; border-radius:8px; font-weight:600; box-shadow:0 10px 40px rgba(59,130,246,0.3); }
    .section { padding:80px 20px; max-width:1200px; margin:0 auto; }
    h2 { font-size:2.5rem; text-align:center; margin-bottom:60px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:24px; }
    .card { background:#1e2535; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:32px; }
  </style>
</head>
<body>
  <section class="hero">
    <div class="hero-content">
      <div class="badge">✨ ${data.businessType}</div>
      <h1>${data.businessName}<br><span class="gradient">${data.description}</span></h1>
      <p class="subtitle">Potencia tu presencia digital</p>
      <a href="#" class="btn">Empezar →</a>
    </div>
  </section>
  <section class="section">
    <h2>Incluye todo lo necesario</h2>
    <div class="grid">
      ${data.sections.map((s: string) => `
        <div class="card">
          <h3>${s}</h3>
          <p style="color:#94a3b8; margin-top:8px;">Sección completamente personalizable</p>
        </div>
      `).join('')}
    </div>
  </section>
</body>
</html>`
  }

  const downloadTheme = () => {
    if (themeZipUrl && themeData) {
      const a = document.createElement('a')
      a.href = themeZipUrl
      a.download = `${themeData.themeName}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const startOver = () => {
    setMessages([
      { role: 'assistant', content: '¡Hola! Soy tu asistente para crear themes WordPress. Cuéntame, ¿qué tipo de web quieres crear?' },
      { role: 'assistant', content: 'Por ejemplo: "Una web para mi restaurante italiano" o "Un portfolio para mi agencia de diseño" o "Una tienda online de ropa"' },
    ])
    setIsGenerating(false)
    setIsComplete(false)
    setThemeZipUrl(null)
    setPreviewHtml('')
    setThemeData(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="max-w-[2000px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold font-jakarta gradient-text">AnvilWP</a>
          <a href="https://github.com/Josusanz/anvilwp" className="text-sm text-gray-400 hover:text-blue-400">GitHub →</a>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[40%] border-r border-gray-800 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Confirm button after first message */}
            {messages.length > 2 && messages[messages.length - 1].role === 'assistant' &&
             messages[messages.length - 1].content.includes('¿Quieres que empiece?') &&
             !isGenerating && !isComplete && (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={generateTheme}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Sí, generar →
                </button>
                <button
                  onClick={() => {
                    setMessages(prev => prev.slice(0, -2))
                    inputRef.current?.focus()
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600"
                >
                  Modificar
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-400">Generando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800">
            {!isComplete ? (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describe tu web aquí..."
                  disabled={isGenerating || (messages.length > 2 && messages[messages.length - 1].content.includes('¿Quieres que empiece?'))}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 disabled:opacity-50"
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isGenerating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
                >
                  Enviar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={downloadTheme}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl text-base font-semibold hover:bg-blue-700"
                >
                  📦 Descargar Theme
                </button>
                <button
                  onClick={startOver}
                  className="w-full px-6 py-3 bg-gray-700 text-white rounded-xl text-sm font-medium hover:bg-gray-600"
                >
                  Crear otro theme →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-[60%] bg-gray-900 flex flex-col">
          <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-gray-400">Preview en Vivo</span>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {previewHtml ? (
              <iframe srcDoc={previewHtml} className="w-full h-full border-0" title="Preview" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 bg-gray-900">
                <div className="text-center">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-lg text-gray-300">Tu theme aparecerá aquí</p>
                  <p className="text-sm text-gray-500 mt-2">Describe la web que quieres crear</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
