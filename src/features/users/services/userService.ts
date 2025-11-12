import { apiClient } from '@/shared/lib/apiClient';
import type { User } from '@/features/users/types';

const USERS_ENDPOINT = '/users';

/**
 * Servicio para gestión de usuarios
 * Endpoints: /users/me, /users (lista), /users/:id, etc.
 */
export const userService = {
  /**
   * Obtiene el perfil del usuario autenticado
   * 
   * @returns Usuario actual
   * @throws ApiError si el token es inválido o expiró
   * 
   * @example
   * const user = await userService.getProfile();
   * console.log(user.name); // "Juan Pérez"
   */
  getProfile(): Promise<User> {
    return apiClient.get<User>(`${USERS_ENDPOINT}/me`);
  },

  
};