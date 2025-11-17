'use client';

import { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import type { Property } from '../types';
import type { ApiError } from '@/shared/types/common';

/**
 * Hook para gestionar propiedades como SUPERADMIN (PROTEGIDO)
 * 
 * Este hook requiere autenticación y es usado solo por superadmins.
 * Muestra TODAS las propiedades sin filtrar (puede ver propiedades de todos los agentes).
 * Solo para VISUALIZACIÓN en lista, la eliminación se hace desde la página de detalle.
 * 
 * Casos de uso:
 * - Dashboard del superadmin /dashboard/properties (lista de propiedades)
 * - Panel de administración de propiedades
 * 
 * Diferencias con useAgentProperties:
 * - NO filtra por ownerId (muestra todas)
 * - Muestra propiedades de todos los agentes
 * 
 * Diferencias con useProperties (público):
 * - Requiere autenticación (usa token JWT)
 * - NO incluye función deleteProperty (se elimina desde detalle)
 * 
 * @returns Estado con todas las propiedades, loading y error
 * 
 * @example
 * // En dashboard del superadmin /dashboard/properties
 * export default function AdminPropertiesPage() {
 *   const { 
 *     properties, 
 *     total, 
 *     isLoading, 
 *     error
 *   } = useAdminProperties();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   
 *   return (
 *     <div>
 *       <h1>Todas las Propiedades ({total})</h1>
 *       {properties.map(property => (
 *         <PropertyCard 
 *           key={property.id}
 *           property={property}
 *           ownerInfo={property.ownerId}
 *           href={`/dashboard/properties/${property.id}`}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useAdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar TODAS las propiedades (sin filtrar)
   * 
   * Flujo:
   * 1. Llamar a GET /api/properties (público, pero con token en headers)
   * 2. NO filtrar nada, mostrar todas
   * 3. Actualizar estado con todas las propiedades
   * 
   * ¿Por qué no hay endpoint /api/properties/admin?
   * - El GET /api/properties ya retorna todas las propiedades
   * - No tiene sentido duplicar el endpoint
   * - La diferencia está en los permisos de DELETE/PUT
   */
  useEffect(() => {
    const loadAllProperties = async () => {
      try {
        // Obtener TODAS las propiedades (público, pero autenticado)
        const data = await propertyService.getAll();
        
        // NO filtrar, mostrar todas
        setProperties(data.properties);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Error al cargar las propiedades');
        setIsLoading(false);
      }
    };

    loadAllProperties();
  }, []); // Cargar solo una vez al montar

  return {
    // Datos
    properties,              // TODAS las propiedades (sin filtrar)
    total: properties.length, // Total de propiedades en el sistema
    
    // Estados
    isLoading,               // true mientras carga
    error,                   // Mensaje de error si falla
  };
}
