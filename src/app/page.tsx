import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-slate-50 to-zinc-50">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-50/95 to-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="text-2xl font-light tracking-tight text-gray-900">
            Inmobiliaria<span className="font-semibold">.pro</span>
          </div>
          
          <nav className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-6 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100/50"
            >
              Ingresar
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2.5 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all rounded-md shadow-sm"
            >
              Comenzar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="text-center space-y-16 mb-20">
            <div className="space-y-8">
              <h1 className="text-7xl md:text-8xl font-extralight tracking-tight text-gray-900 leading-[0.95]">
                Gestión inmobiliaria
                <br />
                <span className="font-normal">reimaginada</span>
              </h1>
              
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                Una plataforma elegante y poderosa para profesionales del sector inmobiliario
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group px-10 py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-all rounded-md shadow-md hover:shadow-lg"
              >
                INICIAR PRUEBA GRATUITA
              </Link>
              <Link
                href="/catalog"
                className="px-10 py-4 border-2 border-gray-300 text-gray-900 text-sm tracking-wide hover:border-gray-900 transition-all rounded-md"
              >
                VER PROPIEDADES
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-16 pt-12 text-sm">
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900">500+</div>
                <div className="text-gray-500 mt-1">Agentes</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900">10K+</div>
                <div className="text-gray-500 mt-1">Propiedades</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900">98%</div>
                <div className="text-gray-500 mt-1">Satisfacción</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src="/images/landing/futuristic-buildings.jpg"
                alt="Desarrollos inmobiliarios de lujo con arquitectura moderna"
                width={3000}
                height={2000}
                priority
                className="w-full h-auto"
                quality={90}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-lg border border-gray-200">
              <p className="text-sm text-gray-600 font-light">
                <span className="font-semibold text-gray-900">Propiedades exclusivas</span> en las mejores ubicaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-24">
            <h2 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
              Todo lo esencial,
              <br />
              <span className="font-normal">nada superfluo</span>
            </h2>
            <p className="text-lg text-gray-500 font-light">
              Herramientas diseñadas con precisión para optimizar cada aspecto de tu trabajo
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-1">
            {/* Feature 1 */}
            <Link href="/catalog" className="block">
              <div className="group border-t border-gray-200 py-12 hover:bg-gray-50 transition-colors px-8 cursor-pointer">
                <div className="flex items-start justify-between gap-12">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-3 tracking-wider">01</div>
                    <h3 className="text-3xl font-light text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                      Catálogo de propiedades
                    </h3>
                    <p className="text-gray-600 text-lg font-light max-w-xl leading-relaxed">
                      Sistema completo para gestionar tu inventario. Descripciones detalladas, 
                      ubicación precisa y estado en tiempo real.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-900 font-medium">
                      <span>Explorar propiedades</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-24 h-24 border border-gray-200 group-hover:border-gray-900 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Feature 2 */}
            <div className="group border-t border-gray-200 py-12 hover:bg-gray-50 transition-colors px-8">
              <div className="flex items-start justify-between gap-12">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-3 tracking-wider">02</div>
                  <h3 className="text-3xl font-light text-gray-900 mb-4">
                    Agenda inteligente
                  </h3>
                  <p className="text-gray-600 text-lg font-light max-w-xl leading-relaxed">
                    Coordina visitas, citas y reuniones con facilidad. Recordatorios automáticos 
                    y sincronización con tu calendario personal.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-24 h-24 border border-gray-200 group-hover:border-gray-900 transition-colors">
                  <svg className="w-12 h-12 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group border-t border-gray-200 py-12 hover:bg-gray-50 transition-colors px-8">
              <div className="flex items-start justify-between gap-12">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-3 tracking-wider">03</div>
                  <h3 className="text-3xl font-light text-gray-900 mb-4">
                    Gestión de clientes
                  </h3>
                  <p className="text-gray-600 text-lg font-light max-w-xl leading-relaxed">
                    Base de datos completa de tus clientes. Registra preferencias, historial de visitas 
                    y notas importantes para ofrecer un servicio personalizado.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-24 h-24 border border-gray-200 group-hover:border-gray-900 transition-colors">
                  <svg className="w-12 h-12 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group border-t border-b border-gray-200 py-12 hover:bg-gray-50 transition-colors px-8">
              <div className="flex items-start justify-between gap-12">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-3 tracking-wider">04</div>
                  <h3 className="text-3xl font-light text-gray-900 mb-4">
                    Reportes y analíticas
                  </h3>
                  <p className="text-gray-600 text-lg font-light max-w-xl leading-relaxed">
                    Visualiza métricas clave de tu negocio. Rendimiento de propiedades, 
                    conversión de clientes y proyecciones de ventas en tiempo real.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-24 h-24 border border-gray-200 group-hover:border-gray-900 transition-colors">
                  <svg className="w-12 h-12 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-6xl font-light leading-tight">
            Comienza hoy.
            <br />
            <span className="font-normal">Sin complicaciones.</span>
          </h2>
          
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Prueba gratuita de 30 días. No requiere tarjeta de crédito.
          </p>

          <div className="pt-8">
            <Link
              href="/auth/register"
              className="inline-block px-12 py-5 bg-white text-gray-900 text-sm tracking-wide hover:bg-gray-100 transition-all"
            >
              CREAR CUENTA GRATIS
            </Link>
          </div>

          <div className="flex items-center justify-center gap-12 pt-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Sin permanencia</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Soporte prioritario</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Actualización constante</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="text-xl font-light text-gray-900 mb-2">
                Inmobiliaria<span className="font-semibold">.pro</span>
              </div>
              <p className="text-sm text-gray-500">© 2025 — Todos los derechos reservados</p>
            </div>
            
            <div className="flex gap-12 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Términos de uso</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Soporte</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Documentación</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}