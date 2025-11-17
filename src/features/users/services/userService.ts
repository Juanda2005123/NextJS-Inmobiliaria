import { apiClient } from '@/shared/lib/apiClient';
import type { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  UpdateProfileDto,
  GetUsersResponse 
} from '../types';

/**
 * Endpoint base para usuarios
 */
const USERS_ENDPOINT = '/users';

/**
 * Servicio para gestión de usuarios
 * 
 * Implementa todos los endpoints del módulo Users:
 * - Perfil propio (GET/PUT/DELETE /users/me)
 * - CRUD de usuarios para superadmin (GET/POST/PUT/DELETE /users)
 */
export const userService = {
  /**
   * Obtener el perfil del usuario autenticado
   * 
   * Endpoint: GET /api/users/me
   * Roles: agent, superadmin
   * 
   * @returns Usuario actual con todos sus datos
   * 
   * @example
   * const profile = await userService.getProfile();
   * console.log(profile.name); // "Juan Pérez"
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>(`${USERS_ENDPOINT}/me`);
  },

  /**
   * Actualizar el perfil del usuario autenticado
   * 
   * Endpoint: PUT /api/users/me
   * Roles: agent, superadmin
   * 
   * @param data - Campos a actualizar (name, email, password)
   * @returns Usuario actualizado
   * 
   * @example
   * const updated = await userService.updateProfile({
   *   name: "Juan Pérez Actualizado"
   * });
   */
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    return apiClient.put<User>(`${USERS_ENDPOINT}/me`, data);
  },

  /**
   * Eliminar la cuenta propia (soft delete)
   * 
   * Endpoint: DELETE /api/users/me
   * Roles: agent, superadmin
   * 
   * NOTA: Es un soft delete, el usuario queda con deletedAt != null
   * 
   * @example
   * await userService.deleteProfile();
   * // Luego hacer logout
   */
  async deleteProfile(): Promise<void> {
    return apiClient.delete(`${USERS_ENDPOINT}/me`);
  },

  /**
   * Listar todos los usuarios
   * 
   * Endpoint: GET /api/users
   * Roles: superadmin
   * 
   * @returns Lista completa de usuarios (sin paginación)
   * 
   * @example
   * const { users, total } = await userService.getAll();
   * console.log(`Total de usuarios: ${total}`);
   */
  async getAll(): Promise<GetUsersResponse> {
    return apiClient.get<GetUsersResponse>(USERS_ENDPOINT);
  },

  /**
   * Obtener un usuario específico por ID
   * 
   * Endpoint: GET /api/users/:id
   * Roles: superadmin
   * 
   * @param id - UUID del usuario
   * @returns Usuario encontrado
   * 
   * @example
   * const user = await userService.getById('550e8400-...');
   */
  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`${USERS_ENDPOINT}/${id}`);
  },

  /**
   * Crear un nuevo usuario
   * 
   * Endpoint: POST /api/users
   * Roles: superadmin
   * 
   * @param data - Datos del nuevo usuario (name, email, password, role)
   * @returns Usuario creado
   * 
   * @example
   * const newUser = await userService.create({
   *   name: "María García",
   *   email: "maria@example.com",
   *   password: "securepass123",
   *   role: "agent"
   * });
   */
  async create(data: CreateUserDto): Promise<User> {
    return apiClient.post<User>(USERS_ENDPOINT, data);
  },

  /**
   * Actualizar un usuario específico
   * 
   * Endpoint: PUT /api/users/:id
   * Roles: superadmin
   * 
   * @param id - UUID del usuario a actualizar
   * @param data - Campos a actualizar (incluye role)
   * @returns Usuario actualizado
   * 
   * @example
   * const updated = await userService.update('550e8400-...', {
   *   role: "superadmin"  // Cambiar rol
   * });
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    return apiClient.put<User>(`${USERS_ENDPOINT}/${id}`, data);
  },

  /**
   * Eliminar un usuario específico (soft delete)
   * 
   * Endpoint: DELETE /api/users/:id
   * Roles: superadmin
   * 
   * NOTA: Es un soft delete, el usuario queda con deletedAt != null
   * 
   * @param id - UUID del usuario a eliminar
   * 
   * @example
   * await userService.delete('550e8400-...');
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete(`${USERS_ENDPOINT}/${id}`);
  },
};