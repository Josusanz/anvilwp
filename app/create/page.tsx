'use client'

import { useState } from 'react'

export default function CreatePage() {
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    tagline: '',
    sections: [] as string[],
    primaryCta: '',
    style: 'Dark Neon',
    email: '',
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!formData.businessName || !formData.businessType || formData.sections.length === 0) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setIsGenerating(true)

    try {
      // Call API to generate theme
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al generar el theme')
      }

      const result = await response.json()

      // Create zip file
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      // Add all files to zip
      Object.entries(result.files).forEach(([path, content]) => {
        zip.file(path, content as string)
      })

      // Generate zip blob
      const blob = await zip.generateAsync({ type: 'blob' })

      // Download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${result.themeName}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert('¡Theme generado! La descarga comenzará automáticamente.')
    } catch (err) {
      console.error(err)
      setError('Error al generar el theme. Por favor intenta de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSection = (section: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section],
    }))
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold font-jakarta">
              <span className="gradient-text">AnvilWP</span>
            </a>
            <a
              href="https://github.com/Josusanz/anvilwp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-blue-400"
            >
              GitHub →
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
            Genera Tu Theme WordPress
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Responde unas preguntas y obtén tu theme personalizado en minutos
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Type */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  ¿Qué tipo de negocio tienes? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Restaurante', 'Agencia', 'eCommerce', 'Blog', 'SaaS', 'Otro'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, businessType: type })}
                      className={`px-4 py-3 border rounded-lg text-sm transition-all ${
                        formData.businessType === type
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Nombre de tu negocio *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Ej: Restaurante Michu"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Tagline (opcional)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Ej: Cocina mediterránea con alma"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Sections */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  ¿Qué secciones necesitas? * (elige al menos 1)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Hero',
                    'Servicios',
                    'Galería',
                    'Menú/Productos',
                    'Stats/Números',
                    'Testimonios',
                    'Equipo',
                    'FAQ',
                    'Blog',
                    'Contacto',
                    'Ubicación',
                    'CTA',
                  ].map((section) => (
                    <label
                      key={section}
                      className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                        formData.sections.includes(section)
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sections.includes(section)}
                        onChange={() => toggleSection(section)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{section}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Primary CTA */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Call to action principal
                </label>
                <input
                  type="text"
                  value={formData.primaryCta}
                  onChange={(e) => setFormData({ ...formData, primaryCta: e.target.value })}
                  placeholder="Ej: Reservar mesa, Empieza gratis, Contactar"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Color Preference */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Estilo visual
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Dark Neon', desc: 'Oscuro con acentos azul/púrpura' },
                    { name: 'Light Modern', desc: 'Claro y minimalista (próximamente)' },
                    { name: 'Colorful', desc: 'Vibrante y energético (próximamente)' },
                    { name: 'Minimal', desc: 'Simple y elegante (próximamente)' },
                  ].map((style) => (
                    <button
                      key={style.name}
                      type="button"
                      disabled={style.name !== 'Dark Neon'}
                      onClick={() => setFormData({ ...formData, style: style.name })}
                      className={`text-left px-4 py-3 border rounded-lg transition-all ${
                        formData.style === style.name
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : style.name === 'Dark Neon'
                          ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                          : 'bg-gray-800/50 border-gray-700/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-semibold text-sm">{style.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Solo para enviarte actualizaciones sobre AnvilWP
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn btn-primary w-full text-lg"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generando Theme...
                    </span>
                  ) : (
                    '🔨 Generar Mi Theme'
                  )}
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Gratis • Sin tarjeta de crédito • Descarga instantánea
                </p>
              </div>
            </form>
          </div>

          {/* Alternative */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              ¿Eres developer? Usa Claude Code para más control
            </p>
            <a
              href="https://github.com/Josusanz/anvilwp#option-2-claude-code-for-developers"
              className="btn btn-secondary"
            >
              Ver Guía Claude Code →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
