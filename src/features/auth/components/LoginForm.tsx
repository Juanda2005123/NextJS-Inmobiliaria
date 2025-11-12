'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks';
import type { LoginDto } from '@/features/auth/types';

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
    setIsLoading(true);
    setError(null);

    try {
      // Validación básica
      if (!formData.email || !formData.password) {
        setError('Todos los campos son requeridos');
        return;
      }

      // Llamada al service a través del Context
      await login(formData);
      
      // Redirección exitosa
      router.push('/dashboard');
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
        setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <a href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Regístrate aquí
        </a>
      </p>
    </form>
  );
}