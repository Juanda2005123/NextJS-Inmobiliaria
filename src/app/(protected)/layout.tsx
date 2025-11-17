'use client';

import { Navbar } from '@/components';
import { Footer } from '@/components';
import { useRequireAuth } from '@/features/auth/hooks';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout para páginas protegidas
 * 
 * Características:
 * - Valida autenticación con useRequireAuth
 * - Navbar fixed arriba
 * - Footer al final
 * - Padding-top para compensar el navbar fixed (64px)
 * - Contenedor centrado con ancho máximo
 */
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isLoading } = useRequireAuth();

  // Mientras valida autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar fixed arriba (h-16 = 64px) */}
      <Navbar />

      {/* Contenido principal con padding-top de 64px */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer al final */}
      <Footer />
    </div>
  );
}