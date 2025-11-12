import { apiClient } from '@/shared/lib/apiClient';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
} from '@/features/auth/types';

const AUTH_ENDPOINT = '/auth';

/**
 * Servicio para manejo de autenticación
 * Endpoints: /auth/login, /auth/register
 */
export const authService = {
  /**
   * Inicia sesión con email y password
   *
   * @param payload - Credenciales del usuario
   * @returns Token JWT y datos del usuario
   *
   * @example
   * const { token, user } = await authService.login({
   *   email: 'juan@example.com',
   *   password: 'pass123'
   * });
   */
  login(payload: LoginDto): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(`${AUTH_ENDPOINT}/login`, payload, {
      skipAuth: true, // No requiere token porque aún no estás logueado
    });
  },

  /**
   * Registra un nuevo agente en el sistema
   *
   * @param payload - Datos del nuevo usuario
   * @returns Usuario creado (sin token, debe hacer login después)
   *
   * @example
   * const user = await authService.register({
   *   name: 'Juan Pérez',
   *   email: 'juan@example.com',
   *   password: 'pass123'
   * });
   */
  register(payload: RegisterDto): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(
      `${AUTH_ENDPOINT}/register`,
      payload,
      { skipAuth: true } // No requiere token para registrarse
    );
  },
};