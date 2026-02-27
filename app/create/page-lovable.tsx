'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Sparkles, Download, Share2, Settings, Eye, Code,
  Smartphone, Monitor, Send, Plus, Clock, Check
} from 'lucide-react'

type Message = {
  role: 'assistant' | 'user'
  content: string
  timestamp?: Date
}

const SUGGESTED_PROMPTS = [
  'Una web para mi restaurante italiano',
  'Portfolio minimalista para agencia',
  'Tienda online de productos artesanales',
  'Blog de viajes con galería',
  'Sitio corporativo para empresa tech',
  'Landing page para SaaS'
]

export default function CreatePageLovable() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Describe el tipo de web WordPress que quieres crear y yo me encargo del resto.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [themeZipUrl, setThemeZipUrl] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState('')
  const [themeData, setThemeData] = useState<any>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showCode, setShowCode] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }])

    await generateTheme(userMessage)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const generateTheme = async (userMessage: string) => {
    setIsGenerating(true)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Analizando tu descripción y generando un diseño profesional...',
      timestamp: new Date()
    }])

    try {
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
        content: `¡Theme completado con éxito!\n\n✓ ${fileCount} archivos generados\n✓ Diseño profesional dark/neon\n✓ SEO optimizado\n✓ Mobile responsive\n✓ Listo para descargar`,
        timestamp: new Date()
      }])

      setIsComplete(true)
      setIsGenerating(false)
    } catch (error) {
      console.error('Error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error al generar el theme: ${errorMsg}\n\nIntenta describirlo de otra forma.`,
        timestamp: new Date()
      }])
      setIsGenerating(false)
    }
  }

  const generatePreviewHTML = (data: any) => {
    // Using the improved preview generator would go here
    // For now, using simplified version
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName || 'Mi Sitio'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0d1117; color: #e2e8f0; line-height: 1.6; }
    h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; }
    .header { position: sticky; top: 0; background: rgba(22,27,39,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 20px 40px; z-index: 100; }
    .hero { padding: 120px 40px 80px; text-align: center; position: relative; }
    .hero::before { content: ''; position: absolute; top: -50%; left: 50%; transform: translateX(-50%); width: 800px; height: 300px; background: radial-gradient(ellipse, rgba(59,130,246,0.15), rgba(139,92,246,0.1) 40%, transparent 70%); z-index: 0; }
    h1 { font-size: clamp(2.5rem, 5vw, 5rem); margin-bottom: 20px; position: relative; z-index: 1; }
    .gradient { background: linear-gradient(135deg, #3B82F6, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(to top, #2563EB, #3B82F6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 10px 40px rgba(59,130,246,0.3); }
  </style>
</head>
<body>
  <header class="header">
    <h3>${data.businessName || 'Mi Sitio'}</h3>
  </header>
  <section class="hero">
    <h1>${data.businessName || 'Mi Sitio'}<br><span class="gradient">${data.tagline || 'Potencia tu negocio'}</span></h1>
    <p style="font-size: 1.25rem; color: #94a3b8; margin-bottom: 40px;">${data.hero?.subtitle || 'Diseño profesional con IA'}</p>
    <a href="#" class="btn">Comenzar →</a>
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
      {
        role: 'assistant',
        content: 'Describe el tipo de web WordPress que quieres crear y yo me encargo del resto.',
        timestamp: new Date()
      }
    ])
    setInput('')
    setIsGenerating(false)
    setIsComplete(false)
    setThemeZipUrl(null)
    setPreviewHtml('')
    setThemeData(null)
  }

  const shareTheme = () => {
    // TODO: Implement share functionality
    alert('Share functionality coming soon!')
  }

  return (
    <div className="h-screen flex flex-col bg-[#fafafa]">
      {/* Top Navigation Bar - Lovable Style */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md z-50 sticky top-0">
        <div className="max-w-[2000px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">AnvilWP</span>
            </div>
            {themeData && (
              <span className="text-sm text-gray-500 hidden md:inline">
                {themeData.themeName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm text-gray-700"
              title={previewMode === 'desktop' ? 'Mobile view' : 'Desktop view'}
            >
              {previewMode === 'desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowCode(!showCode)}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm text-gray-700"
              title="View code"
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              onClick={shareTheme}
              disabled={!isComplete}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Share</span>
            </button>

            <button
              onClick={downloadTheme}
              disabled={!isComplete}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - Left Side */}
        <div className="w-[420px] border-r border-gray-200 flex flex-col bg-white">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                }`}>
                  {msg.role === 'user' ? (
                    <span className="text-xs font-semibold">TÚ</span>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>

                <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[90%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-900'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                  {msg.timestamp && (
                    <div className={`mt-1 flex items-center gap-1 text-xs text-gray-400 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Generando tu theme...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts */}
          {!isGenerating && messages.length <= 2 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-3">Prueba con estos ejemplos:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {!isComplete ? (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="Describe tu sitio web aquí..."
                    disabled={isGenerating}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-gray-900 placeholder-gray-400 disabled:opacity-50 resize-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating}
                    className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">Shift + Enter para nueva línea</p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={startOver}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear nuevo theme
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel - Right Side */}
        <div className="flex-1 bg-gray-50 flex flex-col">
          {/* Preview Header */}
          <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Live Preview</span>
              {themeData && (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Generated
                </span>
              )}
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            {previewHtml ? (
              <div className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
                previewMode === 'desktop'
                  ? 'w-full h-full'
                  : 'w-[375px] h-[667px]'
              }`}>
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            ) : (
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Crea tu sitio web perfecto
                </h3>
                <p className="text-gray-600 mb-6">
                  Describe el tipo de web que necesitas y generaré un theme profesional de WordPress en minutos
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Diseño profesional dark/neon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>SEO optimizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Mobile responsive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Listo en minutos</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
