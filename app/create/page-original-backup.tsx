'use client'

import { useState, useEffect, useRef } from 'react'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

export default function CreatePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Describe el tipo de web WordPress que quieres crear y yo me encargo del resto.' },
    { role: 'assistant', content: '💡 Ejemplos:\n• "Una web para mi restaurante italiano llamado La Dolce Vita"\n• "Un portfolio minimalista para mi agencia de diseño"\n• "Una tienda online de productos artesanales"\n• "Un blog de viajes con galería de fotos"' },
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

    // Generate immediately
    await generateTheme(userMessage)
  }

  const generateTheme = async (userMessage: string) => {
    setIsGenerating(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '🚀 Generando tu theme con Claude AI...' }])

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessages(prev => [...prev, { role: 'assistant', content: '✨ Analizando tu descripción...' }])

      await new Promise(resolve => setTimeout(resolve, 500))
      setMessages(prev => [...prev, { role: 'assistant', content: '🎨 Creando contenido personalizado...' }])

      const response = await fetch('/api/generate-with-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const result = await response.json()
      setThemeData(result)

      // Generate preview
      const previewHtmlContent = generatePreviewHTML(result.themeData)
      setPreviewHtml(previewHtmlContent)

      setMessages(prev => [...prev, { role: 'assistant', content: '📦 Empaquetando archivos...' }])

      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      Object.entries(result.files).forEach(([path, content]) => {
        zip.file(path, content as string)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      setThemeZipUrl(url)

      const fileCount = Object.keys(result.files).length
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🎉 ¡Theme completado!\n\n✓ ${fileCount} archivos generados\n✓ Contenido único creado por Claude AI\n✓ Diseño profesional dark/neon\n✓ Compatible con WordPress 6.9+\n✓ SEO y formularios incluidos`
      }])

      setIsComplete(true)
    } catch (error) {
      console.error('Error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${errorMsg}\n\nIntenta describirlo de otra forma o verifica tu configuración.`
      }])
      setIsGenerating(false)
    } finally {
      if (isComplete) setIsGenerating(false)
    }
  }

  const generatePreviewHTML = (data: any) => {
    const sections = data.sections || []

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName || 'Mi Sitio'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#0d1117; color:#e2e8f0; line-height:1.6; }
    h1,h2,h3 { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; }
    .header { position:sticky; top:0; background:rgba(13,17,23,0.95); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.08); padding:20px 40px; z-index:100; }
    .hero { padding:120px 40px 80px; text-align:center; position:relative; overflow:hidden; background:#0d1117; }
    .hero::before { content:''; position:absolute; top:-50%; left:50%; transform:translateX(-50%); width:800px; height:300px; background:radial-gradient(ellipse,rgba(59,130,246,0.15),rgba(139,92,246,0.1) 40%,transparent 70%); z-index:0; pointer-events:none; }
    .hero-content { position:relative; z-index:1; max-width:800px; margin:0 auto; }
    .badge { display:inline-block; padding:8px 16px; background:#1e2535; border:1px solid rgba(255,255,255,0.1); border-radius:50px; font-size:0.875rem; margin-bottom:24px; color:#94a3b8; }
    h1 { font-size:clamp(2.5rem,5vw,4rem); margin-bottom:20px; line-height:1.2; }
    .gradient { background:linear-gradient(135deg,${data.colors?.accent || '#3B82F6'},#8B5CF6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .subtitle { font-size:1.25rem; color:#94a3b8; margin-bottom:40px; max-width:600px; margin-left:auto; margin-right:auto; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(to top,#2563eb,#3b82f6); color:white; text-decoration:none; border-radius:8px; font-weight:600; box-shadow:0 10px 40px rgba(59,130,246,0.3); transition:transform 0.2s; }
    .btn:hover { transform:translateY(-2px); }
    .section { padding:80px 40px; max-width:1200px; margin:0 auto; }
    h2 { font-size:2.5rem; text-align:center; margin-bottom:60px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; }
    .card { background:#1e2535; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:32px; transition:all 0.3s; }
    .card:hover { transform:translateY(-4px); border-color:rgba(59,130,246,0.3); box-shadow:0 20px 60px rgba(0,0,0,0.4); }
    .card h3 { font-size:1.25rem; margin-bottom:12px; }
    .card p { color:#94a3b8; font-size:0.95rem; line-height:1.6; }
    .icon { font-size:2rem; margin-bottom:16px; }
    .footer { border-top:1px solid rgba(255,255,255,0.08); padding:40px; text-align:center; color:#94a3b8; font-size:0.875rem; }
    .footer a { color:#3B82F6; text-decoration:none; }
  </style>
</head>
<body>
  <header class="header">
    <h3>${data.businessName || 'Mi Sitio'}</h3>
  </header>

  <section class="hero">
    <div class="hero-content">
      ${data.hero?.badge ? `<div class="badge">✨ ${data.hero.badge}</div>` : ''}
      <h1>${data.hero?.title || data.businessName}<br><span class="gradient">${data.tagline || 'Potencia tu negocio'}</span></h1>
      <p class="subtitle">${data.hero?.subtitle || 'Llevamos tu presencia digital al siguiente nivel'}</p>
      <a href="#" class="btn">${data.hero?.cta || 'Empezar'} →</a>
    </div>
  </section>

  ${sections.filter((s: any) => s.items && s.items.length > 0).map((section: any) => `
    <section class="section">
      <h2>${section.title}</h2>
      <div class="grid">
        ${section.items.map((item: any) => `
          <div class="card">
            <div class="icon">${item.icon || '✨'}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('')}

  <footer class="footer">
    <p>© 2026 ${data.businessName || 'Mi Sitio'}. Powered by <a href="https://anvilwp.com">AnvilWP</a></p>
  </footer>
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
      { role: 'assistant', content: '¡Hola! Describe el tipo de web WordPress que quieres crear y yo me encargo del resto.' },
      { role: 'assistant', content: '💡 Ejemplos:\n• "Una web para mi restaurante italiano llamado La Dolce Vita"\n• "Un portfolio minimalista para mi agencia de diseño"\n• "Una tienda online de productos artesanales"\n• "Un blog de viajes con galería de fotos"' },
    ])
    setInput('')
    setIsGenerating(false)
    setIsComplete(false)
    setThemeZipUrl(null)
    setPreviewHtml('')
    setThemeData(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm z-50 sticky top-0">
        <div className="max-w-[2000px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold font-jakarta gradient-text">AnvilWP</a>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Powered by Claude AI</span>
            <a href="https://github.com/Josusanz/anvilwp" className="text-sm text-gray-400 hover:text-blue-400">GitHub →</a>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[40%] border-r border-gray-800 flex flex-col bg-[#0d1117]">
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

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-gray-400">Claude está trabajando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800 bg-[#0d1117]">
            {!isComplete ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe tu web aquí..."
                    disabled={isGenerating}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 disabled:opacity-50"
                    autoFocus
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
                  >
                    {isGenerating ? '...' : 'Generar →'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">Presiona Enter o click en Generar</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={downloadTheme}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
                >
                  📦 Descargar Theme ({themeData?.themeName})
                </button>
                <button
                  onClick={startOver}
                  className="w-full px-6 py-3 bg-gray-700 text-white rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  ← Crear otro theme
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-[60%] bg-gray-900 flex flex-col">
          <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-2 bg-gray-900">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-gray-400">Vista Previa en Vivo</span>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {previewHtml ? (
              <iframe srcDoc={previewHtml} className="w-full h-full border-0" title="Preview" sandbox="allow-same-origin" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 bg-[#0d1117]">
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl text-gray-300 mb-2">Tu theme aparecerá aquí</h3>
                  <p className="text-sm text-gray-500">Describe la web que quieres crear y Claude generará un theme completo y único</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
