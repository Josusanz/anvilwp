'use client'

import { useState } from 'react'
import { Sparkles, Download, Code, Zap, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ConvertPage() {
  const [htmlInput, setHtmlInput] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [themeZipUrl, setThemeZipUrl] = useState<string | null>(null)
  const [themeName, setThemeName] = useState('')
  const [error, setError] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')

  const handleConvert = async () => {
    if (!htmlInput.trim()) {
      setError('Por favor pega el HTML generado por tu AI')
      return
    }

    setIsConverting(true)
    setError('')
    setIsComplete(false)

    try {
      const response = await fetch('/api/convert-html-to-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlInput }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const result = await response.json()

      // Generate ZIP
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      Object.entries(result.files).forEach(([path, content]) => {
        zip.file(path, content as string)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)

      setThemeZipUrl(url)
      setThemeName(result.themeName)
      setPreviewHtml(htmlInput) // Show original HTML as preview
      setIsComplete(true)

    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error al convertir el HTML')
    } finally {
      setIsConverting(false)
    }
  }

  const downloadTheme = () => {
    if (themeZipUrl && themeName) {
      const a = document.createElement('a')
      a.href = themeZipUrl
      a.download = `${themeName}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const resetConverter = () => {
    setHtmlInput('')
    setIsConverting(false)
    setIsComplete(false)
    setThemeZipUrl(null)
    setThemeName('')
    setError('')
    setPreviewHtml('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md z-50 sticky top-0">
        <div className="max-w-[2000px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">AnvilWP Converter</span>
            </a>
          </div>
          <a href="/create" className="text-sm text-gray-600 hover:text-gray-900">
            ← Generador con IA
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Input Panel */}
        <div className="w-[50%] border-r border-gray-200 flex flex-col bg-white">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">HTML → WordPress Theme</h2>
            <p className="text-sm text-gray-600">
              Pega el HTML generado por Gemini, Claude, v0.dev o cualquier AI
            </p>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="<!DOCTYPE html>
<html>
  <head>
    <title>Mi Sitio</title>
    ...
  </head>
  <body>
    ...
  </body>
</html>"
              className="w-full h-full min-h-[500px] px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:border-blue-500 focus:outline-none resize-none"
              disabled={isConverting || isComplete}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200">
            {!isComplete ? (
              <button
                onClick={handleConvert}
                disabled={isConverting || !htmlInput.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Convirtiendo...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Convertir a WordPress Theme
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={downloadTheme}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Descargar {themeName}.zip
                </button>
                <button
                  onClick={resetConverter}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  ← Convertir otro HTML
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-[50%] bg-gray-900 flex flex-col">
          <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-2 bg-gray-900">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-gray-400">Vista Previa</span>
          </div>

          <div className="flex-1 overflow-auto bg-white">
            {isComplete && previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-[#0d1117]">
                <div className="text-center max-w-md px-6">
                  <div className="mb-6">
                    <Code className="w-16 h-16 text-gray-600 mx-auto" />
                  </div>
                  <h3 className="text-xl text-gray-300 mb-3 font-semibold">
                    {isConverting ? 'Convirtiendo tu HTML...' : 'Tu preview aparecerá aquí'}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isConverting
                      ? 'Analizando estructura, extrayendo colores y generando WordPress blocks...'
                      : 'Pega HTML generado por IA (Gemini, Claude, v0.dev) y conviértelo en un theme de WordPress FSE completo'
                    }
                  </p>

                  {!isConverting && (
                    <div className="mt-8 space-y-3 text-left bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">✨ Cómo funciona:</h4>
                      <div className="space-y-2 text-xs text-gray-400">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>Extrae secciones (nav, hero, features, footer)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>Convierte Tailwind → WordPress blocks</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>Genera theme.json con colores extraídos</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>Empaqueta theme.zip listo para instalar</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
