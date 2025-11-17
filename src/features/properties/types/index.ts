/**
 * ============================================
 * TIPOS BASE
 * ============================================
 */

/**
 * Propiedad completa
 * 
 * Representa la entidad Property del backend.
 * Se usa en todas las respuestas que devuelven datos de propiedades.
 * 
 * IMPORTANTE: El backend NO envía isDeleted ni deletedAt en las respuestas
 * (solo los usa internamente). Solo enviará propiedades activas.
 * 
 * NOTA: El backend incluye imageUrls, pero NO lo usaremos en el frontend.
 */
export interface Property {
  id: string;                    // UUID
  title: string;                 // Máximo 120 caracteres
  description: string;           // Texto largo
  price: number;                 // Precio en número
  location: string;              // Dirección completa
  bedrooms: number;              // Número de habitaciones (entero positivo)
  bathrooms: number;             // Número de baños (entero positivo)
  area: number;                  // Área en m² (positivo)
  imageUrls: string[];           // Array de URLs (backend lo envía, nosotros no lo usamos)
  ownerId: string | null;        // UUID del agente propietario (puede ser null)
  createdAt: string;             // ISO 8601 date string
  updatedAt: string;             // ISO 8601 date string
}

/**
 * ============================================
 * DTOs DE ENTRADA - AGENTE (Request Bodies)
 * ============================================
 */

/**
 * DTO para crear una propiedad como agente
 * 
 * Endpoint: POST /api/properties/agent
 * Rol requerido: agent
 * 
 * El ownerId se asigna automáticamente al usuario autenticado,
 * NO debe enviarse en el body.
 * 
 * NOTA: imageUrls es opcional en el backend, pero NO lo usaremos.
 * Se puede enviar como array vacío o simplemente omitirlo.
 */
export interface CreatePropertyByAgentDto {
  title: string;                 // Requerido - Máx 120 caracteres
  description: string;           // Requerido
  price: number;                 // Requerido - Numérico
  location: string;              // Requerido
  bedrooms: number;              // Requerido - Positivo
  bathrooms: number;             // Requerido - Positivo
  area: number;                  // Requerido - Positivo (m²)
  imageUrls?: string[];          // Opcional - No lo usaremos (enviaremos [])
}

/**
 * DTO para actualizar una propiedad como agente
 * 
 * Endpoint: PUT /api/properties/agent/:id
 * Rol requerido: agent
 * Restricción: Solo puede actualizar sus propias propiedades
 * 
 * Todos los campos son opcionales (actualización parcial).
 * NO puede cambiar el ownerId.
 * 
 * NOTA: imageUrls existe pero NO lo usaremos en el frontend.
 */
export interface UpdatePropertyByAgentDto {
  title?: string;                // Opcional
  description?: string;          // Opcional
  price?: number;                // Opcional
  location?: string;             // Opcional
  bedrooms?: number;             // Opcional
  bathrooms?: number;            // Opcional
  area?: number;                 // Opcional
  imageUrls?: string[];          // Opcional - No lo usaremos
}

/**
 * ============================================
 * DTOs DE ENTRADA - ADMIN (Request Bodies)
 * ============================================
 */

/**
 * DTO para crear una propiedad como superadmin
 * 
 * Endpoint: POST /api/properties/admin
 * Rol requerido: superadmin
 * 
 * Diferencia con agente: El superadmin DEBE especificar el ownerId
 * para asignar la propiedad a un agente específico.
 * 
 * NOTA: imageUrls es opcional en el backend, pero NO lo usaremos.
 */
export interface CreatePropertyByAdminDto {
  title: string;                 // Requerido - Máx 120 caracteres
  description: string;           // Requerido
  price: number;                 // Requerido - Numérico
  location: string;              // Requerido
  bedrooms: number;              // Requerido - Positivo
  bathrooms: number;             // Requerido - Positivo
  area: number;                  // Requerido - Positivo (m²)
  imageUrls?: string[];          // Opcional - No lo usaremos (enviaremos [])
  ownerId: string;               // Requerido - UUID del agente propietario
}

/**
 * DTO para actualizar una propiedad como superadmin
 * 
 * Endpoint: PUT /api/properties/admin/:id
 * Rol requerido: superadmin
 * 
 * Puede actualizar cualquier propiedad, incluyendo cambiar el propietario.
 * Todos los campos son opcionales (actualización parcial).
 * 
 * NOTA: imageUrls existe pero NO lo usaremos en el frontend.
 */
export interface UpdatePropertyByAdminDto {
  title?: string;                // Opcional
  description?: string;          // Opcional
  price?: number;                // Opcional
  location?: string;             // Opcional
  bedrooms?: number;             // Opcional
  bathrooms?: number;            // Opcional
  area?: number;                 // Opcional
  imageUrls?: string[];          // Opcional - No lo usaremos
  ownerId?: string;              // Opcional - UUID del nuevo propietario
}

/**
 * ============================================
 * RESPUESTAS DEL BACKEND (Responses)
 * ============================================
 */

/**
 * Respuesta de GET /api/properties (lista completa pública)
 * 
 * Endpoint: GET /api/properties
 * Rol requerido: Público (sin autenticación)
 * 
 * Devuelve TODAS las propiedades activas (no eliminadas).
 */
export interface GetPropertiesResponse {
  properties: Property[];
  total: number;
}

/**
 * Respuesta de GET /api/properties/:id (detalle público)
 * 
 * Endpoint: GET /api/properties/:id
 * Rol requerido: Público (sin autenticación)
 * 
 * Devuelve una propiedad específica si existe y no está eliminada.
 */
export type GetPropertyByIdResponse = Property;

/**
 * ============================================
 * TIPOS AUXILIARES PARA EL FRONTEND
 * ============================================
 * 
 * Estos tipos NO vienen del backend.
 * Los creamos para estructurar el estado de hooks y componentes.
 */

/**
 * Estado del hook useProperties()
 * 
 * Combina:
 * - Datos del backend (properties, total)
 * - Estados de UI (isLoading, error)
 * 
 * @example
 * const { properties, isLoading, error } = useProperties();
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <PropertyGrid properties={properties} />;
 */
export interface PropertiesState {
  properties: Property[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Estado del formulario de propiedad (crear/editar)
 * 
 * Combina:
 * - Datos del formulario (data)
 * - Estado de envío (isSubmitting)
 * - Errores de validación por campo (errors)
 * 
 * @example
 * const { data, isSubmitting, errors } = usePropertyForm();
 * <Input value={data.title} error={errors.title} />
 * <Button isLoading={isSubmitting}>Guardar</Button>
 */
export interface PropertyFormState {
  data: CreatePropertyByAgentDto | CreatePropertyByAdminDto | UpdatePropertyByAgentDto | UpdatePropertyByAdminDto;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
