import { Role } from '@/shared/types/common';

/**
 * ============================================
 * TIPOS BASE
 * ============================================
 */

/**
 * Usuario completo
 * 
 * Representa la entidad User del backend
 * Se usa en todas las respuestas que devuelven datos de usuario
 */
export interface User {
  id: string;              // UUID
  name: string;
  email: string;
  role: Role;
  createdAt: string;       // ISO 8601 date string
  updatedAt: string;       // ISO 8601 date string
}

/**
 * ============================================
 * DTOs DE ENTRADA (Request Bodies)
 * ============================================
 */

/**
 * DTO para crear un nuevo usuario
 * 
 * Endpoint: POST /api/users
 * Rol requerido: superadmin
 * 
 * Todos los campos son obligatorios
 */
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

/**
 * DTO para actualizar el perfil propio
 * 
 * Endpoint: PUT /api/users/me
 * Rol requerido: Cualquier usuario autenticado
 * 
 * Todos los campos son opcionales (permite actualizar parcialmente)
 */
export interface UpdateProfileDto {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * DTO para actualizar cualquier usuario (admin)
 * 
 * Endpoint: PUT /api/users/:id
 * Rol requerido: superadmin
 * 
 * Incluye el campo 'role' que UpdateProfileDto no tiene
 * Todos los campos son opcionales
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

/**
 * ============================================
 * RESPUESTAS DEL BACKEND (Responses)
 * ============================================
 */

/**
 * Respuesta de GET /api/users (lista completa)
 * 
 * Endpoint: GET /api/users
 * Rol requerido: superadmin
 * 
 * NOTA: El backend devuelve todos los usuarios de una vez
 * (no usa paginación porque no se esperan más de 100 usuarios)
 */
export interface GetUsersResponse {
  users: User[];
  total: number;
}

/**
 * ============================================
 * TIPOS AUXILIARES PARA EL FRONTEND
 * ============================================
 * 
 * Estos tipos NO vienen del backend.
 * Los creamos para estructurar el estado de hooks y formularios.
 */

/**
 * Estado del hook useUsers()
 * 
 * Combina:
 * - Datos del backend (users, total)
 * - Estados de UI (isLoading, error)
 * 
 * @example
 * const { users, isLoading, error } = useUsers();
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <UserTable users={users} />;
 */
export interface UsersState {
  users: User[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Estado del formulario de usuario (crear/editar)
 * 
 * Combina:
 * - Datos del formulario (data)
 * - Estado de envío (isSubmitting)
 * - Errores de validación por campo (errors)
 * 
 * @example
 * const { data, isSubmitting, errors } = useUserForm();
 * <Input value={data.email} error={errors.email} />
 * <Button isLoading={isSubmitting}>Guardar</Button>
 */
export interface UserFormState {
  data: CreateUserDto | UpdateUserDto | UpdateProfileDto;
  isSubmitting: boolean;
  errors: Record<string, string>;
}