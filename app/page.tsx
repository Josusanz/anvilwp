export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="glow-effect absolute inset-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 mb-8">
              <span className="text-sm text-blue-400">✨ Nuevo</span>
              <span className="text-sm text-gray-400">Genera themes WordPress con IA</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-jakarta mb-6">
              Forja tu web perfecta con{' '}
              <span className="gradient-text italic">AnvilWP</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Generador de themes WordPress con IA que crea sitios profesionales en minutos.
              Sin bloqueos, sin dependencias—solo código limpio y portable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#create" className="btn btn-primary w-full sm:w-auto">
                Generar Mi Theme Gratis →
              </a>
              <a href="#how-it-works" className="btn btn-secondary w-full sm:w-auto">
                Ver Cómo Funciona
              </a>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-gray-500 mt-8">
              GPL-2.0 • Sin lock-in • Tu código, tu sitio
            </p>
          </div>
        </div>

        {/* Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
              ¿Por qué AnvilWP?
            </h2>
            <p className="text-xl text-gray-400">
              No es un builder—es un generador de themes profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="mb-4">
                <svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="icon1">
                      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
                      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
                    </radialGradient>
                    <circle id="icon1-circle" cx="28" cy="28" r="28" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <use fill="url(#icon1)" xlinkHref="#icon1-circle" />
                    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
                      <path d="M20 28h16" opacity=".64" />
                      <path d="M28 20v16" />
                    </g>
                  </g>
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-jakarta mb-3">Sin Lock-In</h3>
              <p className="text-gray-400">
                Descarga tu theme.zip y úsalo donde quieras. Es tu código, tu sitio—sin ataduras.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="mb-4">
                <svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="icon2">
                      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
                      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
                    </radialGradient>
                    <circle id="icon2-circle" cx="28" cy="28" r="28" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <use fill="url(#icon2)" xlinkHref="#icon2-circle" />
                    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
                      <path d="m22 24-4 4 4 4M34 24l4 4-4 4" />
                      <path d="m26 36 4-16" opacity=".64" />
                    </g>
                  </g>
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-jakarta mb-3">Calidad Profesional</h3>
              <p className="text-gray-400">
                Basado en estándares Cruip/Neon. Iconos SVG, gradientes, animaciones—no plantillas genéricas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="mb-4">
                <svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient cx="50%" cy="89.845%" r="89.85%" id="icon3">
                      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
                      <stop stopColor="#F472B6" stopOpacity=".876" offset="100%" />
                    </radialGradient>
                    <circle id="icon3-circle" cx="28" cy="28" r="28" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <use fill="url(#icon3)" xlinkHref="#icon3-circle" />
                    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
                      <path d="m18 31 4 4 12-15" />
                      <path d="M39 25h-3M39 30h-7M39 35H28" opacity=".64" />
                    </g>
                  </g>
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-jakarta mb-3">Todo Integrado</h3>
              <p className="text-gray-400">
                SEO, formularios, schema.org, cookies—sin plugins. Todo está en el theme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-400">
              Dos opciones según tu nivel técnico
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Option 1 - Web App */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold font-jakarta mb-4">Para Usuarios</h3>
              <div className="text-left space-y-4 text-gray-400">
                <div className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Ve a anvilwp.com/create</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Completa el formulario (negocio, secciones)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Descarga tu theme.zip</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>Instala en WordPress → Activar</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400">→</span>
                  <span>¡Listo! Tu web está online</span>
                </div>
              </div>
            </div>

            {/* Option 2 - Claude Code */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold font-jakarta mb-4">Para Developers</h3>
              <div className="text-left space-y-4 text-gray-400">
                <div className="flex gap-3">
                  <span className="text-purple-400">→</span>
                  <span>Instala Claude Code CLI</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-400">→</span>
                  <span>Navega a tu carpeta de themes</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-400">→</span>
                  <span>Ejecuta: <code className="bg-gray-800 px-2 py-1 rounded">claude</code></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-400">→</span>
                  <span>Dile qué tipo de theme necesitas</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-purple-400">→</span>
                  <span>Claude genera todo automáticamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">5min</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">Generación</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">0</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">Plugins Necesarios</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">Código Tuyo</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">GPL</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">Licencia Libre</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="create" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-2xl" />
            <div className="relative bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold font-jakarta mb-4">
                Empieza Gratis Ahora
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Genera tu primer theme WordPress profesional en 5 minutos.
                Sin tarjeta de crédito, sin compromisos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/create" className="btn btn-primary text-lg px-8 py-4">
                  Generar Theme Gratis →
                </a>
                <a
                  href="https://github.com/Josusanz/anvilwp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-lg px-8 py-4"
                >
                  Ver en GitHub ⭐
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold font-jakarta mb-4">AnvilWP</h3>
              <p className="text-sm text-gray-400">
                Forja tu web perfecta con IA
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400">Generar Theme</a></li>
                <li><a href="#" className="hover:text-blue-400">Documentación</a></li>
                <li><a href="#" className="hover:text-blue-400">Ejemplos</a></li>
                <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://github.com/Josusanz/anvilwp" className="hover:text-blue-400">GitHub</a></li>
                <li><a href="#" className="hover:text-blue-400">Guía Claude Code</a></li>
                <li><a href="#" className="hover:text-blue-400">Patrones de Diseño</a></li>
                <li><a href="#" className="hover:text-blue-400">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Comunidad</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400">Discord</a></li>
                <li><a href="#" className="hover:text-blue-400">Twitter</a></li>
                <li><a href="#" className="hover:text-blue-400">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2026 AnvilWP. Código abierto bajo licencia GPL-2.0</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
