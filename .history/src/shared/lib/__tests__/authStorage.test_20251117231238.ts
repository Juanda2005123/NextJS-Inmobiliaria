import { authStorage } from '../authStorage';
import { Role } from '@/features/users/types';
import type { User } from '@/features/users/types';

describe('authStorage', () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: Role.AGENT,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Token management', () => {
    it('guarda el token en localStorage', () => {
      authStorage.setToken(mockToken);
      
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
    });

    it('obtiene el token de localStorage', () => {
      localStorage.setItem('auth_token', mockToken);
      
      const token = authStorage.getToken();
      
      expect(token).toBe(mockToken);
    });

    it('devuelve null si no hay token', () => {
      const token = authStorage.getToken();
      
      expect(token).toBeNull();
    });

    it('elimina el token de localStorage', () => {
      localStorage.setItem('auth_token', mockToken);
      
      authStorage.removeToken();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('User management', () => {
    it('guarda el usuario en localStorage como JSON', () => {
      authStorage.setUser(mockUser);
      
      const storedUser = localStorage.getItem('auth_user');
      expect(storedUser).toBe(JSON.stringify(mockUser));
    });

    it('obtiene el usuario de localStorage y lo parsea', () => {
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      const user = authStorage.getUser();
      
      expect(user).toEqual(mockUser);
    });

    it('devuelve null si no hay usuario', () => {
      const user = authStorage.getUser();
      
      expect(user).toBeNull();
    });

    it('elimina el usuario de localStorage', () => {
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      authStorage.removeUser();
      
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('maneja JSON corrupto en getUser', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem('auth_user', 'invalid-json{not valid}');
      
      const user = authStorage.getUser();
      
      expect(user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(localStorage.getItem('auth_user')).toBeNull(); // Debe eliminarse
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clear()', () => {
    it('limpia tanto el token como el usuario', () => {
      authStorage.setToken(mockToken);
      authStorage.setUser(mockUser);
      
      authStorage.clear();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('no falla si no hay datos que limpiar', () => {
      expect(() => authStorage.clear()).not.toThrow();
    });
  });

  describe('SSR compatibility', () => {
    it('setToken no falla en entorno sin window', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulamos SSR eliminando window
      delete global.window;
      
      expect(() => authStorage.setToken(mockToken)).not.toThrow();
      
      global.window = originalWindow;
    });

    it('getToken devuelve null en entorno sin window', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulamos SSR eliminando window
      delete global.window;
      
      const token = authStorage.getToken();
      
      expect(token).toBeNull();
      
      global.window = originalWindow;
    });

    it('setUser no falla en entorno sin window', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulamos SSR eliminando window
      delete global.window;
      
      expect(() => authStorage.setUser(mockUser)).not.toThrow();
      
      global.window = originalWindow;
    });

    it('getUser devuelve null en entorno sin window', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulamos SSR eliminando window
      delete global.window;
      
      const user = authStorage.getUser();
      
      expect(user).toBeNull();
      
      global.window = originalWindow;
    });

    it('removeToken no falla en entorno sin window', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulamos SSR eliminando window
      delete global.window;
      
      expect(() => authStorage.removeToken()).not.toThrow();
      
      global.window = originalWindow;
    });

    it('removeUser no falla en entorno sin window', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulamos SSR eliminando window
      delete global.window;
      
      expect(() => authStorage.removeUser()).not.toThrow();
      
      global.window = originalWindow;
    });

    it('clear no falla en entorno sin window', () => {
      const originalWindow = global.window;
      // @ts-ignore - Simulamos SSR eliminando window
      delete global.window;
      
      expect(() => authStorage.clear()).not.toThrow();
      
      global.window = originalWindow;
    });
  });

  describe('Casos de uso reales', () => {
    it('flujo completo de login', () => {
      // Login exitoso
      authStorage.setToken(mockToken);
      authStorage.setUser(mockUser);
      
      // Verificar que se guardaron
      expect(authStorage.getToken()).toBe(mockToken);
      expect(authStorage.getUser()).toEqual(mockUser);
    });

    it('flujo completo de logout', () => {
      // Usuario logueado
      authStorage.setToken(mockToken);
      authStorage.setUser(mockUser);
      
      // Logout
      authStorage.clear();
      
      // Verificar que se limpiaron
      expect(authStorage.getToken()).toBeNull();
      expect(authStorage.getUser()).toBeNull();
    });

    it('actualizar usuario sin perder el token', () => {
      authStorage.setToken(mockToken);
      authStorage.setUser(mockUser);
      
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      authStorage.setUser(updatedUser);
      
      expect(authStorage.getToken()).toBe(mockToken); // Token intacto
      expect(authStorage.getUser()).toEqual(updatedUser); // Usuario actualizado
    });
  });
});
