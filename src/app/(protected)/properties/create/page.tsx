'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PropertyForm } from '@/features/properties/components';
import { propertyService } from '@/features/properties/services/propertyService';
import { userService } from '@/features/users/services/userService';
import { Building2, Home, AlertCircle, Loader2 } from 'lucide-react';
import type { CreatePropertyByAgentDto, CreatePropertyByAdminDto } from '@/features/properties/types';
import type { User } from '@/features/users/types';

/**
 * Página de creación de propiedades
 * 
 * Acceso:
 * - Agentes: Pueden crear propiedades (auto-asignadas a ellos)
 * - Superadmin: Pueden crear propiedades y asignarlas a cualquier agente
 * 
 * Características:
 * - Form condicional según rol (agent vs admin)
 * - Carga de lista de agentes para superadmin
 * - Validación y manejo de errores
 * - Redirección a /properties tras éxito
 * 
 * Ruta: /properties/create
 */
export default function CreatePropertyPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'superadmin';

  /**
   * Cargar lista de agentes (solo para superadmin)
   */
  useEffect(() => {
    if (!isAdmin) return;

    const loadAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const response = await userService.getAll();
        // Filtrar solo agentes (no incluir superadmins)
        const agentList = response.users.filter((u) => u.role === 'agent');
        setAgents(agentList);
      } catch (err) {
        console.error('Error al cargar agentes:', err);
        setError('Error al cargar lista de agentes');
      } finally {
        setIsLoadingAgents(false);
      }
    };

    loadAgents();
  }, [isAdmin]);

  /**
   * Manejar creación de propiedad
   */
  const handleSubmit = async (data: CreatePropertyByAgentDto | CreatePropertyByAdminDto) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isAdmin) {
        // Superadmin crea con ownerId específico
        await propertyService.createAsAdmin(data as CreatePropertyByAdminDto);
      } else {
        // Agente crea (auto-asignada)
        await propertyService.createAsAgent(data as CreatePropertyByAgentDto);
      }

      // Redirigir a lista de propiedades
      router.push('/properties');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear la propiedad';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  /**
   * Cancelar y volver a lista
   */
  const handleCancel = () => {
    router.push('/properties');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <a
              href="/dashboard"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </a>
            <span className="text-gray-600">/</span>
            <a
              href="/properties"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Propiedades
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">Crear</span>
          </nav>

          {/* Título */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isAdmin ? 'Crear Nueva Propiedad' : 'Publicar Propiedad'}
              </h1>
              <p className="text-gray-300 text-lg">
                {isAdmin
                  ? 'Crea y asigna propiedades a cualquier agente'
                  : 'Agrega una nueva propiedad a tu portafolio'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Card del formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header de la card */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Información de la Propiedad
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Completa todos los campos requeridos
                </p>
              </div>
            </div>
          </div>

          {/* Contenido de la card */}
          <div className="px-8 py-8">
            {/* Error global */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Error al crear propiedad
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Loading de agentes (solo admin) */}
            {isAdmin && isLoadingAgents ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">Cargando agentes...</span>
              </div>
            ) : (
              <PropertyForm
                mode={isAdmin ? 'create-admin' : 'create-agent'}
                agents={agents.map((agent) => ({
                  id: agent.id,
                  name: agent.name,
                  email: agent.email,
                }))}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Crear Propiedad"
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>

        {/* Tips de ayuda */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              i
            </div>
            Consejos para crear una buena propiedad
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Título claro:</strong> Usa un título descriptivo que destaque la propiedad
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Descripción completa:</strong> Incluye características, acabados y servicios cercanos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Precio real:</strong> Establece un precio competitivo basado en el mercado
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Ubicación exacta:</strong> Proporciona la dirección completa para facilitar visitas
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
