'use client'

import { useState, useEffect, useRef } from 'react'

type Message = {
  role: 'assistant' | 'user'
  content: string
  options?: string[]
}

type FormData = {
  businessType: string
  businessName: string
  tagline: string
  sections: string[]
  primaryCta: string
}

const steps = [
  {
    id: 'businessType',
    question: '¿Qué tipo de negocio tienes?',
    options: ['Restaurante', 'Agencia', 'eCommerce', 'Blog', 'SaaS', 'Otro'],
  },
  {
    id: 'businessName',
    question: '¿Cuál es el nombre de tu negocio?',
    type: 'text',
  },
  {
    id: 'tagline',
    question: '¿Tienes un tagline o lema? (opcional)',
    type: 'text',
    optional: true,
  },
  {
    id: 'sections',
    question: '¿Qué secciones quieres incluir? (elige al menos 2)',
    options: ['Hero', 'Servicios', 'Stats/Números', 'Testimonios', 'Contacto', 'CTA'],
    multiple: true,
  },
  {
    id: 'primaryCta',
    question: '¿Cuál es tu llamada a la acción principal?',
    type: 'text',
    placeholder: 'Ej: Reservar Mesa, Empieza Gratis, Contactar',
  },
]

export default function CreatePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Voy a ayudarte a crear tu theme WordPress perfecto. Vamos paso a paso.' },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    businessName: '',
    tagline: '',
    sections: [],
    primaryCta: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [themeZipUrl, setThemeZipUrl] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (currentStep === 0 && messages.length === 1) {
      showNextQuestion()
    }
  }, [])

  const showNextQuestion = () => {
    if (currentStep >= steps.length) {
      generateTheme()
      return
    }

    const step = steps[currentStep]
    const newMessage: Message = {
      role: 'assistant',
      content: step.question,
      options: step.options,
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleAnswer = (answer: string | string[]) => {
    const step = steps[currentStep]
    const answerText = Array.isArray(answer) ? answer.join(', ') : answer

    setMessages(prev => [...prev, { role: 'user', content: answerText }])

    setFormData(prev => ({
      ...prev,
      [step.id]: answer,
    }))

    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
      if (currentStep + 1 < steps.length) {
        showNextQuestion()
      } else {
        generateTheme()
      }
    }, 500)
  }

  const generateTheme = async () => {
    setIsGenerating(true)
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: '¡Perfecto! Generando tu theme...' },
    ])

    try {
      const previewHtmlContent = generatePreviewHTML(formData)
      setPreviewHtml(previewHtmlContent)

      setMessages(prev => [...prev, { role: 'assistant', content: '✨ Creando estructura del theme...' }])
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMessages(prev => [...prev, { role: 'assistant', content: '🎨 Aplicando diseño profesional...' }])
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMessages(prev => [...prev, { role: 'assistant', content: '📝 Generando contenido específico...' }])

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Error')

      const result = await response.json()

      setMessages(prev => [...prev, { role: 'assistant', content: '📦 Empaquetando archivos...' }])

      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      Object.entries(result.files).forEach(([path, content]) => {
        zip.file(path, content as string)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      setThemeZipUrl(url)

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `🎉 ¡Tu theme "${result.themeName}" está listo! Puedes verlo en el preview y descargarlo.` },
      ])

      setIsComplete(true)
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error. Intenta de nuevo.' }])
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePreviewHTML = (data: FormData) => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName || 'Mi Negocio'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;600&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#0d1117; color:#e2e8f0; line-height:1.6; }
    h1,h2,h3 { font-family:'Plus Jakarta Sans',sans-serif; }
    .header { position:sticky; top:0; background:rgba(13,17,23,0.9); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,0.08); padding:20px; z-index:100; }
    .container { max-width:1200px; margin:0 auto; padding:0 20px; }
    .hero { padding:120px 20px 80px; text-align:center; position:relative; overflow:hidden; }
    .hero::before { content:''; position:absolute; top:-50%; left:50%; transform:translateX(-50%); width:800px; height:300px; background:radial-gradient(ellipse,rgba(59,130,246,0.15) 0%,rgba(139,92,246,0.1) 40%,transparent 70%); z-index:0; }
    .hero-content { position:relative; z-index:1; }
    .badge { display:inline-block; padding:8px 16px; background:#1e2535; border:1px solid rgba(255,255,255,0.1); border-radius:50px; font-size:0.875rem; margin-bottom:24px; }
    h1 { font-size:clamp(2.5rem,5vw,4rem); margin-bottom:20px; }
    .gradient { background:linear-gradient(135deg,#3B82F6,#8B5CF6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .subtitle { font-size:1.25rem; color:#94a3b8; margin-bottom:40px; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(to top,#2563eb,#3b82f6); color:white; text-decoration:none; border-radius:8px; font-weight:600; box-shadow:0 10px 40px rgba(59,130,246,0.3); transition:transform 0.2s; }
    .btn:hover { transform:translateY(-2px); }
    .section { padding:80px 20px; }
    .services { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:24px; max-width:1200px; margin:60px auto 0; }
    .card { background:#1e2535; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:32px; transition:all 0.3s; }
    .card:hover { transform:translateY(-4px); border-color:rgba(59,130,246,0.3); box-shadow:0 20px 60px rgba(0,0,0,0.4); }
    .icon { width:56px; height:56px; border-radius:50%; background:radial-gradient(circle,rgba(59,130,246,0.2),rgba(139,92,246,0.2)); display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:16px; }
    h2 { font-size:clamp(2rem,4vw,3rem); text-align:center; margin-bottom:60px; }
    h3 { font-size:1.5rem; margin-bottom:12px; }
    .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:32px; text-align:center; }
    .stat-number { font-size:3rem; font-weight:800; background:linear-gradient(135deg,#3B82F6,#8B5CF6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:8px; }
    .stat-label { text-transform:uppercase; font-size:0.875rem; letter-spacing:0.05em; color:#94a3b8; }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <h3>${data.businessName || 'Mi Negocio'}</h3>
    </div>
  </header>
  <main>
    ${data.sections.includes('Hero') ? `
    <section class="hero">
      <div class="hero-content">
        <div class="badge">✨ ${data.businessType || 'Nuevo'}</div>
        <h1>${data.businessName || 'Tu Negocio'}<br><span class="gradient">${data.tagline || 'Experiencia única'}</span></h1>
        <p class="subtitle">${data.businessType === 'Restaurante' ? 'Experiencia gastronómica única' : data.businessType === 'Agencia' ? 'Estrategias digitales que funcionan' : 'La mejor experiencia'}</p>
        <a href="#" class="btn">${data.primaryCta || 'Empezar'}</a>
      </div>
    </section>` : ''}
    ${data.sections.includes('Servicios') ? `
    <section class="section">
      <div class="container">
        <h2>Nuestros Servicios</h2>
        <div class="services">
          <div class="card"><div class="icon">🎯</div><h3>Servicio 1</h3><p style="color:#94a3b8;">Descripción del servicio.</p></div>
          <div class="card"><div class="icon">⚡</div><h3>Servicio 2</h3><p style="color:#94a3b8;">Otra característica importante.</p></div>
          <div class="card"><div class="icon">✨</div><h3>Servicio 3</h3><p style="color:#94a3b8;">Valor adicional único.</p></div>
        </div>
      </div>
    </section>` : ''}
    ${data.sections.includes('Stats/Números') ? `
    <section class="section" style="background:#161b27;">
      <div class="container">
        <div class="stats">
          <div><div class="stat-number">500+</div><div class="stat-label">Clientes</div></div>
          <div><div class="stat-number">10+</div><div class="stat-label">Años</div></div>
          <div><div class="stat-number">98%</div><div class="stat-label">Satisfacción</div></div>
          <div><div class="stat-number">24/7</div><div class="stat-label">Soporte</div></div>
        </div>
      </div>
    </section>` : ''}
    ${data.sections.includes('CTA') ? `
    <section class="section">
      <div class="container" style="text-align:center;">
        <h2>¿Listo para empezar?</h2>
        <p class="subtitle">Únete a cientos de clientes satisfechos</p>
        <a href="#" class="btn">${data.primaryCta || 'Contactar'}</a>
      </div>
    </section>` : ''}
  </main>
  <footer style="border-top:1px solid rgba(255,255,255,0.08); padding:40px 20px; text-align:center; color:#94a3b8;">
    <p>© 2026 ${data.businessName || 'Mi Negocio'}. Powered by <a href="https://anvilwp.com" style="color:#3B82F6;">AnvilWP</a></p>
  </footer>
</body>
</html>`
  }

  const downloadTheme = () => {
    if (themeZipUrl) {
      const a = document.createElement('a')
      a.href = themeZipUrl
      a.download = `${formData.businessName.toLowerCase().replace(/\s+/g, '-')}-wp.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="max-w-[2000px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold font-jakarta gradient-text">AnvilWP</a>
          <a href="https://github.com/Josusanz/anvilwp" className="text-sm text-gray-400 hover:text-blue-400">GitHub →</a>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[40%] border-r border-gray-800 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.options && !isGenerating && !isComplete && (
                    <div className="mt-3 space-y-2">
                      {steps[currentStep]?.multiple ? (
                        <div className="space-y-2">
                          {msg.options.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
                              <input type="checkbox" checked={formData.sections?.includes(opt)} onChange={(e) => {
                                const newSections = e.target.checked ? [...(formData.sections || []), opt] : (formData.sections || []).filter(s => s !== opt)
                                setFormData(prev => ({ ...prev, sections: newSections }))
                              }} className="w-4 h-4" />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                          <button onClick={() => handleAnswer(formData.sections)} disabled={formData.sections.length < 2} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700">Continuar →</button>
                        </div>
                      ) : (
                        msg.options.map((opt) => (
                          <button key={opt} onClick={() => handleAnswer(opt)} className="w-full text-left px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-gray-600">{opt}</button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {!isGenerating && !isComplete && currentStep < steps.length && steps[currentStep]?.type === 'text' && (
              <div className="flex justify-start">
                <div className="max-w-[80%] w-full">
                  <input type="text" placeholder={steps[currentStep].placeholder || 'Escribe...'} onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleAnswer(e.currentTarget.value.trim())
                      e.currentTarget.value = ''
                    }
                  }} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-sm focus:border-blue-500 focus:outline-none" autoFocus />
                  {steps[currentStep].optional && <button onClick={() => handleAnswer('')} className="mt-2 text-xs text-gray-400">Saltar →</button>}
                </div>
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
          {isComplete && themeZipUrl && (
            <div className="p-6 border-t border-gray-800">
              <button onClick={downloadTheme} className="w-full btn btn-primary text-lg py-4">📦 Descargar Theme</button>
              <p className="text-xs text-gray-500 text-center mt-3">Listo para WordPress</p>
            </div>
          )}
        </div>
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
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">👀</div>
                  <p className="text-lg">Tu theme aparecerá aquí</p>
                  <p className="text-sm text-gray-600 mt-2">Responde las preguntas del chat</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
