'use client';

import Link from 'next/link';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { PropertyCard } from '@/features/properties/components';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui';
import { Home, LogIn, UserPlus } from 'lucide-react';
import type { User } from '@/features/users/types';

/**
 * Navbar pública con navegación
 */
function CatalogNavbar({ user }: { user: User | null }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-4">
          {/* Logo / Volver */}
          <Link href="/">
            <Button variant="ghost" leftIcon={<Home size={18} />}>
              Inmobiliaria.pro
            </Button>
          </Link>

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" leftIcon={<LogIn size={18} />}>
                    Ingresar
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" leftIcon={<UserPlus size={18} />}>
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Página pública: Lista completa de propiedades
 * 
 * Ruta: /catalog
 * Acceso: Público (sin autenticación)
 * 
 * Funcionalidad:
 * - Muestra TODAS las propiedades disponibles
 * - Grid responsivo de tarjetas
 * - Click en tarjeta → /catalog/[id] (detalle público)
 * 
 * Hook: useProperties() (público, skipAuth: true)
 */
export default function CatalogPage() {
  const { properties, total, isLoading, error } = useProperties();
  const { user } = useAuth();

  // Estado de carga
  if (isLoading) {
    return (
      <>
        <CatalogNavbar user={user} />
        <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Estado de error
  if (error) {
    return (
      <>
        <CatalogNavbar user={user} />
        <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Error al cargar propiedades
                </h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Sin propiedades
  if (properties.length === 0) {
    return (
      <>
        <CatalogNavbar user={user} />
        <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay propiedades disponibles
                </h3>
                <p className="text-gray-600">
                  Actualmente no tenemos propiedades en nuestro catálogo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Renderizado exitoso con propiedades
  return (
    <>
      <CatalogNavbar user={user} />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Catálogo de Propiedades
          </h1>
          <p className="text-lg text-gray-600">
            Explora nuestras {total} {total === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
          </p>
        </div>

        {/* Grid de propiedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              href={`/catalog/${property.id}`}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
