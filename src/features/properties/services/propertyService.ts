import { apiClient } from '@/shared/lib/apiClient';
import type { 
  Property,
  CreatePropertyByAgentDto,
  UpdatePropertyByAgentDto,
  CreatePropertyByAdminDto,
  UpdatePropertyByAdminDto,
  GetPropertiesResponse
} from '../types';

/**
 * Endpoint base para propiedades
 */
const PROPERTIES_ENDPOINT = '/properties';

/**
 * Servicio para gestión de propiedades
 * 
 * Implementa todos los endpoints del módulo Properties:
 * - Endpoints públicos (GET /properties, GET /properties/:id)
 * - CRUD para agentes (POST/PUT/DELETE /properties/agent)
 * - CRUD para admin (POST/PUT/DELETE /properties/admin) [PENDIENTE]
 */
export const propertyService = {
  // ============================================
  // ENDPOINTS PÚBLICOS (sin autenticación)
  // ============================================

  /**
   * Obtener todas las propiedades (público)
   * 
   * Endpoint: GET /api/properties
   * Roles: Público (no requiere autenticación)
   * 
   * Devuelve TODAS las propiedades activas (no eliminadas).
   * No hay paginación ni filtros.
   * 
   * @returns Lista de propiedades con total
   * 
   * @example
   * const { properties, total } = await propertyService.getAll();
   * console.log(`${total} propiedades encontradas`);
   */
  async getAll(): Promise<GetPropertiesResponse> {
    return apiClient.get<GetPropertiesResponse>(PROPERTIES_ENDPOINT, {
      skipAuth: true  // No requiere token (endpoint público)
    });
  },

  /**
   * Obtener una propiedad por ID (público)
   * 
   * Endpoint: GET /api/properties/:id
   * Roles: Público (no requiere autenticación)
   * 
   * @param id - UUID de la propiedad
   * @returns Propiedad completa
   * @throws {ApiError} 404 si la propiedad no existe o fue eliminada
   * 
   * @example
   * const property = await propertyService.getById('abc-123');
   * console.log(property.title);
   */
  async getById(id: string): Promise<Property> {
    return apiClient.get<Property>(`${PROPERTIES_ENDPOINT}/${id}`, {
      skipAuth: true  // No requiere token (endpoint público)
    });
  },

  // ============================================
  // ENDPOINTS PARA AGENTES (requiere auth)
  // ============================================

  /**
   * Crear una propiedad como agente
   * 
   * Endpoint: POST /api/properties/agent
   * Roles: agent
   * 
   * El backend asigna automáticamente el ownerId al usuario autenticado.
   * El agente NO puede especificar el propietario.
   * 
   * NOTA: Enviamos imageUrls: [] por defecto (no usamos imágenes).
   * 
   * @param data - Datos de la nueva propiedad
   * @returns Propiedad creada con ID y ownerId asignado
   * @throws {ApiError} 401 si no está autenticado
   * @throws {ApiError} 403 si no es agente
   * @throws {ApiError} 400 si los datos son inválidos
   * 
   * @example
   * const newProperty = await propertyService.createAsAgent({
   *   title: 'Casa moderna',
   *   description: 'Hermosa casa de 3 pisos',
   *   price: 250000,
   *   location: 'Calle 123 #45-67',
   *   bedrooms: 3,
   *   bathrooms: 2,
   *   area: 120,
   *   imageUrls: []  // Siempre vacío
   * });
   */
  async createAsAgent(data: CreatePropertyByAgentDto): Promise<Property> {
    // Aseguramos que imageUrls esté presente como array vacío
    const payload = {
      ...data,
      imageUrls: data.imageUrls || []
    };
    
    return apiClient.post<Property>(
      `${PROPERTIES_ENDPOINT}/agent`,
      payload
    );
  },

  /**
   * Actualizar una propiedad como agente
   * 
   * Endpoint: PUT /api/properties/agent/:id
   * Roles: agent
   * 
   * Restricción: El agente SOLO puede actualizar sus propias propiedades.
   * NO puede cambiar el ownerId.
   * 
   * @param id - UUID de la propiedad
   * @param data - Campos a actualizar (todos opcionales)
   * @returns Propiedad actualizada
   * @throws {ApiError} 401 si no está autenticado
   * @throws {ApiError} 403 si el agente no es el propietario
   * @throws {ApiError} 404 si la propiedad no existe
   * @throws {ApiError} 400 si los datos son inválidos
   * 
   * @example
   * // Actualizar solo el precio
   * const updated = await propertyService.updateAsAgent('abc-123', {
   *   price: 280000
   * });
   * 
   * @example
   * // Actualizar múltiples campos
   * const updated = await propertyService.updateAsAgent('abc-123', {
   *   title: 'Casa moderna actualizada',
   *   price: 280000,
   *   bedrooms: 4
   * });
   */
  async updateAsAgent(id: string, data: UpdatePropertyByAgentDto): Promise<Property> {
    return apiClient.put<Property>(
      `${PROPERTIES_ENDPOINT}/agent/${id}`,
      data
    );
  },

  /**
   * Eliminar una propiedad como agente
   * 
   * Endpoint: DELETE /api/properties/agent/:id
   * Roles: agent
   * 
   * Restricción: El agente SOLO puede eliminar sus propias propiedades.
   * Es un soft delete (isDeleted = true).
   * Las tareas asociadas también se eliminan en cascada.
   * 
   * @param id - UUID de la propiedad
   * @returns void (status 204)
   * @throws {ApiError} 401 si no está autenticado
   * @throws {ApiError} 403 si el agente no es el propietario
   * @throws {ApiError} 404 si la propiedad no existe
   * 
   * @example
   * await propertyService.deleteAsAgent('abc-123');
   * console.log('Propiedad eliminada exitosamente');
   */
  async deleteAsAgent(id: string): Promise<void> {
    return apiClient.delete(`${PROPERTIES_ENDPOINT}/agent/${id}`);
  },

  // ============================================
  // ENDPOINTS PARA SUPERADMIN (requiere auth + rol superadmin)
  // ============================================

  /**
   * Crear una propiedad como superadmin
   * 
   * Endpoint: POST /api/properties/admin
   * Roles: superadmin
   * 
   * Diferencia clave con agente: El superadmin DEBE especificar el ownerId
   * para asignar la propiedad a un agente específico.
   * 
   * NOTA: Enviamos imageUrls: [] por defecto (no usamos imágenes).
   * 
   * @param data - Datos de la nueva propiedad (incluye ownerId)
   * @returns Propiedad creada con el ownerId especificado
   * @throws {ApiError} 401 si no está autenticado
   * @throws {ApiError} 403 si no es superadmin
   * @throws {ApiError} 404 si el ownerId (agente) no existe
   * @throws {ApiError} 400 si los datos son inválidos
   * 
   * @example
   * const newProperty = await propertyService.createAsAdmin({
   *   title: 'Casa moderna',
   *   description: 'Hermosa casa de 3 pisos',
   *   price: 250000,
   *   location: 'Calle 123 #45-67',
   *   bedrooms: 3,
   *   bathrooms: 2,
   *   area: 120,
   *   imageUrls: [],
   *   ownerId: 'agent-uuid-123'  // Asignar a agente específico
   * });
   */
  async createAsAdmin(data: CreatePropertyByAdminDto): Promise<Property> {
    // Aseguramos que imageUrls esté presente como array vacío
    const payload = {
      ...data,
      imageUrls: data.imageUrls || []
    };
    
    return apiClient.post<Property>(
      `${PROPERTIES_ENDPOINT}/admin`,
      payload
    );
  },

  /**
   * Actualizar una propiedad como superadmin
   * 
   * Endpoint: PUT /api/properties/admin/:id
   * Roles: superadmin
   * 
   * El superadmin puede actualizar CUALQUIER propiedad (no solo las suyas).
   * Puede cambiar el propietario especificando un nuevo ownerId.
   * 
   * @param id - UUID de la propiedad
   * @param data - Campos a actualizar (todos opcionales, incluye ownerId)
   * @returns Propiedad actualizada
   * @throws {ApiError} 401 si no está autenticado
   * @throws {ApiError} 403 si no es superadmin
   * @throws {ApiError} 404 si la propiedad no existe o nuevo ownerId no existe
   * @throws {ApiError} 400 si los datos son inválidos
   * 
   * @example
   * // Actualizar precio y reasignar propietario
   * const updated = await propertyService.updateAsAdmin('abc-123', {
   *   price: 280000,
   *   ownerId: 'otro-agente-uuid-456'
   * });
   * 
   * @example
   * // Solo actualizar campos sin cambiar propietario
   * const updated = await propertyService.updateAsAdmin('abc-123', {
   *   title: 'Casa moderna actualizada',
   *   bedrooms: 4
   * });
   */
  async updateAsAdmin(id: string, data: UpdatePropertyByAdminDto): Promise<Property> {
    return apiClient.put<Property>(
      `${PROPERTIES_ENDPOINT}/admin/${id}`,
      data
    );
  },

  /**
   * Eliminar una propiedad como superadmin
   * 
   * Endpoint: DELETE /api/properties/admin/:id
   * Roles: superadmin
   * 
   * El superadmin puede eliminar CUALQUIER propiedad (no solo las suyas).
   * Es un soft delete (isDeleted = true).
   * Las tareas asociadas también se eliminan en cascada.
   * 
   * @param id - UUID de la propiedad
   * @returns void (status 204)
   * @throws {ApiError} 401 si no está autenticado
   * @throws {ApiError} 403 si no es superadmin
   * @throws {ApiError} 404 si la propiedad no existe
   * 
   * @example
   * await propertyService.deleteAsAdmin('abc-123');
   * console.log('Propiedad eliminada exitosamente');
   */
  async deleteAsAdmin(id: string): Promise<void> {
    return apiClient.delete(`${PROPERTIES_ENDPOINT}/admin/${id}`);
  },
};
