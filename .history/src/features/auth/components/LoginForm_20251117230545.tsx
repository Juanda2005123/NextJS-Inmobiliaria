'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks';
import type { LoginDto } from '@/features/auth/types';
import type { ApiError } from '@/shared/types';
import { Input } from '@/shared/components/ui';

/**
 * Formulario de inicio de sesión
 * 
 * Valida credenciales y redirige al dashboard si es exitoso
 */
export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Estado del formulario
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  
  // Estado de carga y errores
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Maneja cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Limpia error al escribir
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.email || !formData.password) {
      setError('Todos los campos son requeridos');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Llamada al service a través del Context
      await login(formData);
      
      // Redirección exitosa
      router.push('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      
      // Manejar errores específicos del backend
      if (apiError.statusCode === 401) {
        setError('Correo o contraseña incorrectos');
      } else if (apiError.statusCode === 403) {
        setError('Tu cuenta ha sido desactivada. Contacta al administrador');
      } else if (apiError.statusCode === 429) {
        setError('Demasiados intentos. Intenta nuevamente en unos minutos');
      } else {
        const errorMessage = apiError.message || 'Error al conectar con el servidor. Intenta nuevamente';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <Input
        id="email"
        name="email"
        type="email"
        label="CORREO ELECTRÓNICO"
        variant="ghost"
        required
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="tu@email.com"
        className="font-light"
      />

      {/* Password Field */}
      <Input
        id="password"
        name="password"
        type="password"
        label="CONTRASEÑA"
        variant="ghost"
        required
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="••••••••"
        className="font-light"
      />

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-500/20 border border-red-500/30 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-200 font-light">{error}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3.5 bg-white text-gray-900 rounded-md font-light text-sm tracking-wide hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            INGRESANDO...
          </span>
        ) : (
          'INICIAR SESIÓN'
        )}
      </button>
    </form>
  );
}