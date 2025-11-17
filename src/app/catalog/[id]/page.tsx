'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePropertyDetail } from '@/features/properties/hooks/usePropertyDetail';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button, Card } from '@/shared/components/ui';
import { MapPin, BedDouble, Bath, Square, Calendar, ArrowLeft, Edit, Home, LogIn, UserPlus } from 'lucide-react';
import type { User } from '@/features/users/types';

interface CatalogDetailPageProps {
  params: Promise<{ id: string }>;
}

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
 * Página pública: Detalle de una propiedad
 * 
 * Ruta: /catalog/[id]
 * Acceso: Público (sin autenticación)
 * 
 * Funcionalidad:
 * - Muestra información completa de la propiedad
 * - SOLO LECTURA (sin edición ni eliminación)
 * - Si el usuario está autenticado Y es dueño/admin:
 *   → Muestra botón para ir a editar en /dashboard/properties/[id]
 * 
 * Hook: usePropertyDetail(id) (modo público)
 */
export default function CatalogDetailPage({ params }: CatalogDetailPageProps) {
  const { id } = use(params);
  const { property, isLoading, error, canEdit } = usePropertyDetail(id);
  const { user } = useAuth();

  // Estado de carga
  if (isLoading) {
    return (
      <>
        <CatalogNavbar user={user} />
        <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando propiedad...</p>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Estado de error
  if (error || !property) {
    return (
      <>
        <CatalogNavbar user={user} />
        <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Propiedad no encontrada
                </h3>
                <p className="text-red-700 mb-4">
                  {error || 'La propiedad solicitada no existe o no está disponible.'}
                </p>
                <Link href="/catalog">
                  <Button variant="outline">
                    <ArrowLeft size={18} />
                    Volver al catálogo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Formatear precio
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price);

  // Formatear fechas
  const formattedCreatedAt = new Date(property.createdAt).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <CatalogNavbar user={user} />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Botón volver */}
        <div className="mb-6">
          <Link href="/catalog">
            <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}>
              Volver al catálogo
            </Button>
          </Link>
        </div>

        {/* Card principal */}
        <Card padding="lg">
          {/* Header con título y botón editar (si tiene permisos) */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={20} className="shrink-0 mt-1" />
                <p className="text-base">{property.location}</p>
              </div>
            </div>

            {/* Botón editar (solo si está autenticado y tiene permisos) */}
            {user && canEdit && (
              <Link href={`/dashboard/properties/${property.id}`}>
                <Button variant="outline" leftIcon={<Edit size={18} />}>
                  Editar
                </Button>
              </Link>
            )}
          </div>

          {/* Precio destacado */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Precio</p>
            <p className="text-4xl font-bold text-black">
              {formattedPrice}
            </p>
          </div>

          {/* Características en grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            {/* Habitaciones */}
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <BedDouble size={32} className="text-gray-700 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
              <p className="text-sm text-gray-600">
                {property.bedrooms === 1 ? 'Habitación' : 'Habitaciones'}
              </p>
            </div>

            {/* Baños */}
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Bath size={32} className="text-gray-700 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
              <p className="text-sm text-gray-600">
                {property.bathrooms === 1 ? 'Baño' : 'Baños'}
              </p>
            </div>

            {/* Área */}
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Square size={32} className="text-gray-700 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{property.area}</p>
              <p className="text-sm text-gray-600">m²</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Descripción
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>

          {/* Información adicional */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Información adicional
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <p className="text-sm">
                Publicada el {formattedCreatedAt}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}
