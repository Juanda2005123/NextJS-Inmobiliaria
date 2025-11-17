'use client';

import { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import type { PropertiesState } from '../types';
import type { ApiError } from '@/shared/types/common';

/**
 * Hook para obtener todas las propiedades (PÚBLICO)
 * 
 * Este hook NO requiere autenticación y es usado en páginas públicas.
 * Devuelve TODAS las propiedades activas sin filtros ni paginación.
 * 
 * Casos de uso:
 * - Página pública /properties (lista completa para visitantes)
 * - Landing page podría usar esto para mostrar propiedades destacadas
 * 
 * @returns Estado con todas las propiedades, total, loading y error
 * 
 * @example
 * // En página pública /properties
 * export default function PropertiesPage() {
 *   const { properties, total, isLoading, error } = useProperties();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   
 *   return (
 *     <div>
 *       <h1>Propiedades Disponibles ({total})</h1>
 *       <PropertyGrid properties={properties} />
 *     </div>
 *   );
 * }
 */
export function useProperties(): PropertiesState {
  const [state, setState] = useState<PropertiesState>({
    properties: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    /**
     * Cargar todas las propiedades desde el backend
     * 
     * Llama al endpoint público GET /api/properties (sin auth)
     * Este endpoint ya está configurado con skipAuth: true
     */
    const loadProperties = async () => {
      try {
        // Llamar al servicio público (no requiere token)
        const data = await propertyService.getAll();
        
        setState({
          properties: data.properties,
          total: data.total,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const apiError = err as ApiError;
        setState({
          properties: [],
          total: 0,
          isLoading: false,
          error: apiError.message || 'Error al cargar las propiedades',
        });
      }
    };

    loadProperties();
  }, []); // Solo se ejecuta al montar el componente

  return state;
}
