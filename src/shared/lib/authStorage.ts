import { User } from '@/features/users/types';

/**
 * Claves para localStorage
 * Centralizadas para evitar typos
 */
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

/**
 * Utilidad para manejar la persistencia de autenticación
 * en localStorage.
 * 
 * IMPORTANTE: Solo funciona en el cliente (navegador).
 * En SSR (Server-Side Rendering), window y localStorage no existen.
 */
export const authStorage = {
  /**
   * Guarda el token JWT en localStorage
   * 
   * @param token - JWT recibido del backend
   * @example
   * authStorage.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   */
  setToken: (token: string): void => {
    // Verifica que estamos en el navegador (no en SSR)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }
  },

  /**
   * Obtiene el token JWT de localStorage
   * 
   * @returns Token JWT o null si no existe
   * @example
   * const token = authStorage.getToken();
   * if (token) {
   *   // Hacer petición con token
   * }
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }
    return null;
  },

  /**
   * Elimina el token JWT de localStorage
   * 
   * @example
   * authStorage.removeToken(); // Útil en logout
   */
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  /**
   * Guarda los datos del usuario en localStorage
   * 
   * @param user - Objeto User recibido del backend
   * @example
   * authStorage.setUser({
   *   id: '123',
   *   name: 'Juan',
   *   email: 'juan@example.com',
   *   role: Role.AGENT,
   *   createdAt: '2024-01-01',
   *   updatedAt: '2024-01-01'
   * });
   */
  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      // JSON.stringify convierte el objeto a string para guardarlo
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  /**
   * Obtiene los datos del usuario de localStorage
   * 
   * @returns Objeto User o null si no existe
   * @example
   * const user = authStorage.getUser();
   * if (user) {
   *   console.log(`Bienvenido ${user.name}`);
   * }
   */
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        try {
          // JSON.parse convierte el string de vuelta a objeto
          return JSON.parse(userStr) as User;
        } catch (error) {
          // Si el JSON está corrupto, eliminar y devolver null
          console.error('Error parsing user from localStorage:', error);
          authStorage.removeUser();
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Elimina los datos del usuario de localStorage
   * 
   * @example
   * authStorage.removeUser(); // Útil en logout
   */
  removeUser: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  /**
   * Limpia TODA la información de autenticación
   * (token y usuario)
   * 
   * @example
   * // En logout:
   * authStorage.clear();
   */
  clear: (): void => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};