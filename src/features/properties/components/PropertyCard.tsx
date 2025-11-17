import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import type { Property } from '../types';

interface PropertyCardProps {
  /**
   * Datos de la propiedad a mostrar
   */
  property: Property;
  
  /**
   * URL a la que navegará al hacer click
   * Por defecto: /properties/[id] (público)
   */
  href?: string;
  
  /**
   * Mostrar información del propietario (solo para superadmin)
   * @default false
   */
  showOwner?: boolean;
  
  /**
   * Nombre del propietario (opcional, solo si showOwner = true)
   */
  ownerName?: string;
}

/**
 * Componente PropertyCard - Tarjeta para mostrar propiedad en lista
 * 
 * Diseño: Tarjeta limpia con información resumida de la propiedad
 * - Título
 * - Ubicación
 * - Precio
 * - Características (habitaciones, baños, área)
 * 
 * Casos de uso:
 * - Lista pública /properties
 * - Dashboard agente /dashboard/properties (solo sus propiedades)
 * - Dashboard admin /dashboard/properties (todas con owner)
 * 
 * NOTA: NO incluye botón de eliminar (se elimina desde detalle)
 * NOTA: NO usa imágenes (el backend las tiene pero no las mostramos)
 * 
 * @example
 * // Uso básico (público)
 * <PropertyCard 
 *   property={property} 
 *   href={`/properties/${property.id}`}
 * />
 * 
 * @example
 * // Dashboard agente
 * <PropertyCard 
 *   property={property}
 *   href={`/dashboard/properties/${property.id}`}
 * />
 * 
 * @example
 * // Dashboard admin (con owner)
 * <PropertyCard 
 *   property={property}
 *   href={`/dashboard/properties/${property.id}`}
 *   showOwner
 *   ownerName="Juan Pérez"
 * />
 */
export function PropertyCard({
  property,
  href,
  showOwner = false,
  ownerName,
}: PropertyCardProps) {
  // URL por defecto: página pública
  const cardHref = href || `/properties/${property.id}`;

  // Formatear precio a COP (pesos colombianos)
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <Link href={cardHref}>
      <Card hoverable variant="elevated" padding="md" className="h-full">
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Ubicación */}
        <div className="flex items-start gap-2 text-gray-600 mb-3">
          <MapPin size={18} className="shrink-0 mt-0.5" />
          <p className="text-sm line-clamp-2">{property.location}</p>
        </div>

        {/* Precio */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-black">
            {formattedPrice}
          </p>
        </div>

        {/* Características */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
          {/* Habitaciones */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <BedDouble size={18} />
            <span className="text-sm font-medium">{property.bedrooms}</span>
          </div>

          {/* Baños */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <Bath size={18} />
            <span className="text-sm font-medium">{property.bathrooms}</span>
          </div>

          {/* Área */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <Square size={18} />
            <span className="text-sm font-medium">{property.area} m²</span>
          </div>
        </div>

        {/* Propietario (solo para superadmin) */}
        {showOwner && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Propietario: <span className="font-medium text-gray-700">{ownerName || property.ownerId}</span>
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}
