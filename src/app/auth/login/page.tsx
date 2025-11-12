import { LoginForm } from '@/features/auth/components';

/**
 * Página de inicio de sesión
 * 
 * Ruta: /auth/login
 * Pública: No requiere autenticación
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Iniciar sesión
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accede a tu cuenta de Inmobiliaria
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
