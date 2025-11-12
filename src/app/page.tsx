import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🏠 Inmobiliaria
          </h2>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Gestiona propiedades, agenda citas y conecta con clientes de manera eficiente
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg font-semibold"
            >
              Empezar ahora
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors shadow-lg text-lg font-semibold dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Gestión de Propiedades
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Administra tu catálogo de propiedades de forma sencilla
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Agenda de Citas
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Organiza visitas y reuniones con clientes
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Gestión de Clientes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mantén registro de tus clientes y sus preferencias
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-600 dark:text-gray-400">
          © 2025 Inmobiliaria. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}