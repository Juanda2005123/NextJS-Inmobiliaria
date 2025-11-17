import { RegisterForm } from '@/features/auth/components';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Página de registro
 * 
 * Ruta: /auth/register
 * Pública: No requiere autenticación
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/landing/futuristic-buildings.jpg"
          alt="Edificios de lujo"
          fill
          className="object-cover"
          quality={95}
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-900/95"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm tracking-wide">Volver al inicio</span>
        </Link>
      </header>

      {/* Register Container */}
      <div className="relative z-10 min-h-[calc(100vh-88px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="text-3xl font-light tracking-tight text-white">
                Inmobiliaria<span className="font-semibold">.pro</span>
              </div>
            </div>
            <h1 className="text-4xl font-light text-white mb-3 tracking-tight">
              Comienza hoy
            </h1>
            <p className="text-gray-400 font-light">
              Crea tu cuenta en menos de 1 minuto
            </p>
          </div>
          
          {/* Floating Card */}
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-10">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none"></div>
            
            <div className="relative">
              <RegisterForm />
              
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-400 bg-transparent font-light">
                    ¿Ya tienes cuenta?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <Link
                href="/auth/login"
                className="block w-full text-center px-6 py-3 border-2 border-white/30 text-white text-sm tracking-wide hover:bg-white/10 hover:border-white/50 transition-all rounded-md font-light"
              >
                INICIAR SESIÓN
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-light">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" className="text-white hover:underline">Términos</a>
              {' '}y{' '}
              <a href="#" className="text-white hover:underline">Privacidad</a>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
