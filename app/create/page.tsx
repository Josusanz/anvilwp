export default function CreatePage() {
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
            <form className="space-y-8">
              {/* Business Type */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  ¿Qué tipo de negocio tienes?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Restaurante', 'Agencia', 'eCommerce', 'Blog', 'SaaS', 'Otro'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg text-sm transition-all"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Nombre de tu negocio
                </label>
                <input
                  type="text"
                  placeholder="Ej: Restaurante Michu"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Tagline (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cocina mediterránea con alma"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Sections */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  ¿Qué secciones necesitas? (elige 3-5)
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
                      className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                    >
                      <input type="checkbox" className="w-4 h-4" />
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
                    { name: 'Light Modern', desc: 'Claro y minimalista' },
                    { name: 'Colorful', desc: 'Vibrante y energético' },
                    { name: 'Minimal', desc: 'Simple y elegante' },
                  ].map((style) => (
                    <button
                      key={style.name}
                      type="button"
                      className="text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg transition-all"
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
                  Email (para enviarte el theme)
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="button"
                  className="btn btn-primary w-full text-lg"
                  disabled
                >
                  🚧 Generador en construcción
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Mientras tanto, usa{' '}
                  <a href="https://github.com/Josusanz/anvilwp" className="text-blue-400 hover:underline">
                    Claude Code
                  </a>{' '}
                  para generar tu theme
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
