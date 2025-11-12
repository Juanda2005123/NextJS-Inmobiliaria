import { User } from '@/features/users/types';

/**
 * DTO para login
 * 
 * POST /api/auth/login
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * DTO para registro de un nuevo agente
 * 
 * POST /api/auth/register
 * 
 * NOTA: No incluye 'role' porque el backend automáticamente
 * asigna el rol 'agent' a quien se registra
 */
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

/**
 * Respuesta del endpoint POST /api/auth/login
 * 
 * Incluye el token JWT y los datos del usuario
 */
export interface LoginResponse {
  token: string;    // JWT para autenticación
  user: User;       // Datos completos del usuario
}

/**
 * Respuesta del endpoint POST /api/auth/register
 * 
 * IMPORTANTE: El backend solo devuelve el User, NO incluye token.
 * Después de registrarse, el usuario debe hacer login manualmente
 * o podemos hacer un auto-login en el frontend.
 */
export type RegisterResponse = User;

/**
 * Estado de autenticación en el frontend
 * 
 * Se usa en AuthContext para manejar el estado global
 */
export interface AuthState {
  user: User | null;           // Usuario actual o null si no está logueado
  token: string | null;        // JWT o null si no está logueado
  isAuthenticated: boolean;    // true si hay token válido
  isLoading: boolean;          // true mientras verifica el token
}