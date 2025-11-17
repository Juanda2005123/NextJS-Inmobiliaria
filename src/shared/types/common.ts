/**
 * Roles disponibles en el sistema
 * Basado en el backend NestJS
 * 
 * Se usa en:
 * - Auth (User.role)
 * - Users (CreateUserDto.role, UpdateUserDto.role)
 * - Properties (validación de permisos)
 * - Tasks (validación de permisos)
 */
export type Role = 'agent' | 'superadmin';

/**
 * Estructura de error estándar de la API
 * Se usa cuando la petición falla (4xx, 5xx)
 * 
 * @example
 * try {
 *   await apiClient.get('/users/me');
 * } catch (error) {
 *   const apiError = error as ApiError;
 *   console.error(apiError.message);
 * }
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}