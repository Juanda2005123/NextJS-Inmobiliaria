import { RegisterForm } from '@/features/auth/components';

/**
 * Página de registro
 * 
 * Ruta: /auth/register
 * Pública: No requiere autenticación
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crear cuenta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Regístrate como agente inmobiliario
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
