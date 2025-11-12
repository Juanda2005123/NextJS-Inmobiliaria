/**
 * Roles disponibles en el sistema
 * Basado en el backend NestJS
 */
export enum Role {
  AGENT = 'agent',
  SUPERADMIN = 'superadmin',
}

/**
 * Estructura de error estándar de la API
 * Se usa cuando la petición falla (4xx, 5xx)
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}