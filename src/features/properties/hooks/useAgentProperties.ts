'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types';
import type { ApiError } from '@/shared/types/common';

/**
 * Hook para gestionar propiedades de un agente específico (PROTEGIDO)
 * 
 * Este hook requiere autenticación y es usado solo por agentes.
 * Filtra las propiedades para mostrar SOLO las del agente autenticado.
 * Solo para VISUALIZACIÓN en lista, la eliminación se hace desde la página de detalle.
 * 
 * Casos de uso:
 * - Dashboard del agente /dashboard/properties (lista de propiedades)
 * - Lista de "Mis Propiedades" del agente
 * 
 * Diferencias con useProperties (público):
 * - Requiere autenticación (usa useAuth)
 * - Filtra por ownerId (solo las del agente)
 * - NO incluye función deleteProperty (se elimina desde detalle)
 * 
 * @returns Estado con propiedades del agente, loading y error
 * 
 * @example
 * // En dashboard del agente /dashboard/properties
 * export default function AgentPropertiesPage() {
 *   const { 
 *     properties, 
 *     total, 
 *     isLoading, 
 *     error
 *   } = useAgentProperties();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   
 *   return (
 *     <div>
 *       <h1>Mis Propiedades ({total})</h1>
 *       {properties.map(property => (
 *         <PropertyCard 
 *           key={property.id}
 *           property={property}
 *           href={`/dashboard/properties/${property.id}`}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useAgentProperties() {
  const { user } = useAuth(); // Usuario autenticado
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar y filtrar propiedades del agente
   * 
   * Flujo:
   * 1. Llamar a GET /api/properties (público, todas las propiedades)
   * 2. Filtrar en frontend por ownerId === user.id
   * 3. Actualizar estado con solo las propiedades del agente
   * 
   * ¿Por qué no hay endpoint /api/properties/agent/me?
   * - El backend no tiene ese endpoint específico
   * - Usamos el público y filtramos (eficiente para MVP)
   * - Si hubiera 1000+ propiedades, convendría un endpoint específico
   */
  useEffect(() => {
    const loadAgentProperties = async () => {
      try {
        // Obtener TODAS las propiedades (público)
        const data = await propertyService.getAll();
        
        // Filtrar solo las del agente autenticado
        const myProperties = data.properties.filter(
          (property) => property.ownerId === user?.id
        );
        
        setProperties(myProperties);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Error al cargar tus propiedades');
        setIsLoading(false);
      }
    };

    // Solo cargar si hay usuario autenticado
    if (user) {
      loadAgentProperties();
    }
  }, [user]); // Recargar si cambia el usuario

  return {
    // Datos
    properties,              // Solo las propiedades del agente
    total: properties.length, // Total de propiedades del agente
    
    // Estados
    isLoading,               // true mientras carga
    error,                   // Mensaje de error si falla
  };
}
