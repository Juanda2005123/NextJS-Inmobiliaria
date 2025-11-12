import { Role } from '@/shared/types';

/**
 * Usuario del sistema
 * 
 * Esta interface representa la estructura completa de un usuario
 * tal como la devuelve el backend en:
 * - GET /api/users/me
 * - POST /api/auth/login (dentro de LoginResponse)
 * - POST /api/auth/register
 * - GET /api/users (lista de usuarios, solo superadmin)
 */
export interface User {
  id: string;           // UUID generado por el backend
  name: string;         // Nombre completo del usuario
  email: string;        // Email único en el sistema
  role: Role;           // 'agent' o 'superadmin'
  createdAt: string;    // Fecha en formato ISO 8601
  updatedAt: string;    // Fecha en formato ISO 8601
}

