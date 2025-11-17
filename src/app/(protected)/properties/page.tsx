'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAgentProperties } from '@/features/properties/hooks/useAgentProperties';
import { useAdminProperties } from '@/features/properties/hooks/useAdminProperties';
import { PropertyCard } from '@/features/properties/components';
import { Button } from '@/shared/components/ui';
import { Plus, Home, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Página protegida: Lista de propiedades según rol
 * 
 * Ruta: /properties
 * Acceso: Protegido (requiere autenticación)
 * 
 * Funcionalidad:
 * - AGENTE: Muestra solo sus propiedades (useAgentProperties)
 * - SUPERADMIN: Muestra todas las propiedades (useAdminProperties)
 * - Grid responsivo con PropertyCards
 * - Botón "Crear Propiedad" → /properties/create
 * - Estadísticas rápidas
 * - Estados: loading, error, sin propiedades, éxito
 */
export default function PropertiesPage() {
  const { user } = useAuth();
  
  // Determinar qué hook usar según el rol
  const isAdmin = user?.role === 'superadmin';
  
  // Hooks condicionales (solo uno se ejecutará)
  const agentData = useAgentProperties();
  const adminData = useAdminProperties();
  
  // Seleccionar los datos según el rol
  const { properties, total, isLoading, error } = isAdmin ? adminData : agentData;

  // Si no hay usuario (no debería pasar por el layout protegido)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error de autenticación
          </h2>
          <p className="text-gray-600 mb-4">
            Debes iniciar sesión para ver esta página
          </p>
          <Link href="/auth/login">
            <Button variant="primary">Ir a login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con gradiente */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link 
              href="/dashboard" 
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <Home size={16} />
              Dashboard
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">Propiedades</span>
          </nav>

          {/* Header con título y botón */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                {isAdmin ? 'Todas las Propiedades' : 'Mis Propiedades'}
              </h1>
              <p className="text-lg text-gray-300">
                {isAdmin 
                  ? 'Gestiona todas las propiedades del sistema'
                  : 'Gestiona tu portafolio de propiedades'
                }
              </p>
            </div>

            {/* Botón crear */}
            <Link href="/properties/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg shadow-lg transition-colors font-medium cursor-pointer">
                <Plus size={20} />
                Crear Propiedad
              </button>
            </Link>
          </div>

          {/* Estadísticas rápidas */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {/* Total de propiedades */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm text-gray-300 mb-1">Total de propiedades</p>
                <p className="text-3xl font-bold">{total}</p>
              </div>

              {/* Valor total estimado */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm text-gray-300 mb-1">Valor total portafolio</p>
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    notation: 'compact',
                  }).format(properties.reduce((sum, prop) => sum + prop.price, 0))}
                </p>
              </div>

              {/* Precio promedio */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm text-gray-300 mb-1">Precio promedio</p>
                <p className="text-3xl font-bold">
                  {properties.length > 0
                    ? new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        notation: 'compact',
                      }).format(properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length)
                    : '$0'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Estado: Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-gray-900 animate-spin mb-4" />
            <p className="text-lg text-gray-600">Cargando propiedades...</p>
            <p className="text-sm text-gray-500 mt-2">
              Por favor espera un momento
            </p>
          </div>
        )}

        {/* Estado: Error */}
        {!isLoading && error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-900 mb-3">
                Error al cargar propiedades
              </h3>
              <p className="text-red-700 mb-6 text-lg">
                {error}
              </p>
              <Button 
                variant="danger"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Estado: Sin propiedades */}
        {!isLoading && !error && properties.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {isAdmin ? 'No hay propiedades en el sistema' : 'Aún no tienes propiedades'}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {isAdmin 
                  ? 'Ningún agente ha creado propiedades todavía. Las propiedades aparecerán aquí cuando se agreguen.'
                  : 'Comienza a construir tu portafolio agregando tu primera propiedad.'
                }
              </p>
              <Link href="/properties/create">
                <Button 
                  variant="primary" 
                  size="lg"
                  leftIcon={<Plus size={20} />}
                >
                  Crear mi primera propiedad
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Estado: Éxito - Grid de propiedades */}
        {!isLoading && !error && properties.length > 0 && (
          <>
            {/* Info bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold text-gray-900">{properties.length}</span> {properties.length === 1 ? 'propiedad' : 'propiedades'}
              </p>
              
              {/* Badge de rol (solo visible para admin) */}
              {isAdmin && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">Vista de Administrador</span>
                </div>
              )}
            </div>

            {/* Grid de PropertyCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  href={`/properties/${property.id}`}
                  showOwner={isAdmin}
                  ownerName={isAdmin && property.ownerId ? property.ownerId : undefined}
                />
              ))}
            </div>

            {/* Footer con acción */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                ¿Necesitas agregar más propiedades a tu portafolio?
              </p>
              <Link href="/properties/create">
                <Button 
                  variant="outline" 
                  size="lg"
                  leftIcon={<Plus size={20} />}
                >
                  Crear Nueva Propiedad
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
