import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../AuthContext';
import { authService } from '@/features/auth/services/authService';
import { userService } from '@/features/users/services/userService';
import { authStorage } from '@/shared/lib/authStorage';
import { useContext } from 'react';

// Mocks
jest.mock('@/features/auth/services/authService');
jest.mock('@/features/users/services/userService');
jest.mock('@/shared/lib/authStorage');

describe('AuthContext', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'AGENT' as const,
    isActive: true,
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
    (authStorage.getToken as jest.Mock).mockReturnValue(null);
    (authStorage.getUser as jest.Mock).mockReturnValue(null);
  });

  describe('Estado inicial', () => {
    it('inicia con estado no autenticado cuando no hay token', async () => {
      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      expect(result.current?.user).toBeNull();
      expect(result.current?.token).toBeNull();
      expect(result.current?.isAuthenticated).toBe(false);
    });

    it('carga el usuario desde storage si hay token válido', async () => {
      (authStorage.getToken as jest.Mock).mockReturnValue(mockToken);
      (authStorage.getUser as jest.Mock).mockReturnValue(mockUser);
      (userService.getProfile as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      expect(result.current?.user).toEqual(mockUser);
      expect(result.current?.token).toBe(mockToken);
      expect(result.current?.isAuthenticated).toBe(true);
    });

    it('limpia el storage si el token es inválido', async () => {
      (authStorage.getToken as jest.Mock).mockReturnValue('invalid-token');
      (authStorage.getUser as jest.Mock).mockReturnValue(mockUser);
      (userService.getProfile as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      expect(authStorage.clear).toHaveBeenCalled();
      expect(result.current?.user).toBeNull();
      expect(result.current?.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('autentica al usuario correctamente', async () => {
      const loginResponse = { token: mockToken, user: mockUser };
      (authService.login as jest.Mock).mockResolvedValue(loginResponse);

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      const credentials = { email: 'test@example.com', password: 'password123' };
      const user = await result.current!.login(credentials);

      expect(authService.login).toHaveBeenCalledWith(credentials);
      expect(authStorage.setToken).toHaveBeenCalledWith(mockToken);
      expect(authStorage.setUser).toHaveBeenCalledWith(mockUser);
      expect(user).toEqual(mockUser);
      expect(result.current?.isAuthenticated).toBe(true);
    });

    it('actualiza el estado después de login exitoso', async () => {
      const loginResponse = { token: mockToken, user: mockUser };
      (authService.login as jest.Mock).mockResolvedValue(loginResponse);

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      await result.current!.login({ email: 'test@example.com', password: 'pass' });

      expect(result.current?.user).toEqual(mockUser);
      expect(result.current?.token).toBe(mockToken);
      expect(result.current?.isAuthenticated).toBe(true);
      expect(result.current?.isLoading).toBe(false);
    });

    it('propaga errores de autenticación', async () => {
      const error = { statusCode: 401, message: 'Invalid credentials' };
      (authService.login as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      await expect(
        result.current!.login({ email: 'wrong@example.com', password: 'wrong' })
      ).rejects.toEqual(error);
    });
  });

  describe('register', () => {
    it('registra y autentica al usuario automáticamente', async () => {
      const registerData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      (authService.register as jest.Mock).mockResolvedValue(mockUser);
      (authService.login as jest.Mock).mockResolvedValue({ token: mockToken, user: mockUser });

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      const user = await result.current!.register(registerData);

      expect(authService.register).toHaveBeenCalledWith(registerData);
      expect(authService.login).toHaveBeenCalledWith({
        email: registerData.email,
        password: registerData.password,
      });
      expect(user).toEqual(mockUser);
      expect(result.current?.isAuthenticated).toBe(true);
    });

    it('limpia el storage antes de registrar', async () => {
      const registerData = {
        name: 'User',
        email: 'user@example.com',
        password: 'pass',
      };

      (authService.register as jest.Mock).mockResolvedValue(mockUser);
      (authService.login as jest.Mock).mockResolvedValue({ token: mockToken, user: mockUser });

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      await result.current!.register(registerData);

      expect(authStorage.clear).toHaveBeenCalled();
    });

    it('propaga errores de registro', async () => {
      const error = { statusCode: 400, message: 'Email already exists' };
      (authService.register as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      await expect(
        result.current!.register({
          name: 'User',
          email: 'existing@example.com',
          password: 'pass',
        })
      ).rejects.toEqual(error);
    });
  });

  describe('logout', () => {
    it('cierra sesión y limpia el estado', async () => {
      (authStorage.getToken as jest.Mock).mockReturnValue(mockToken);
      (authStorage.getUser as jest.Mock).mockReturnValue(mockUser);
      (userService.getProfile as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isAuthenticated).toBe(true);
      });

      result.current!.logout();

      expect(authStorage.clear).toHaveBeenCalled();
      expect(result.current?.user).toBeNull();
      expect(result.current?.token).toBeNull();
      expect(result.current?.isAuthenticated).toBe(false);
      expect(result.current?.isLoading).toBe(false);
    });

    it('puede hacer logout incluso sin estar autenticado', () => {
      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      expect(() => result.current!.logout()).not.toThrow();
      expect(authStorage.clear).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('actualiza el usuario en el estado y storage', async () => {
      const loginResponse = { token: mockToken, user: mockUser };
      (authService.login as jest.Mock).mockResolvedValue(loginResponse);

      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      await result.current!.login({ email: 'test@example.com', password: 'pass' });

      const updatedUser = { ...mockUser, name: 'Updated Name' };
      result.current!.updateUser(updatedUser);

      expect(authStorage.setUser).toHaveBeenCalledWith(updatedUser);
      expect(result.current?.user).toEqual(updatedUser);
    });
  });

  describe('Proveedor de contexto', () => {
    it('lanza error si se usa fuera del provider', () => {
      // Suprimir console.error para esta prueba
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => {
          const context = useContext(AuthContext);
          if (context === null) {
            throw new Error('useAuth must be used within an AuthProvider');
          }
          return context;
        });
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('proporciona el contexto correctamente a los hijos', async () => {
      const { result } = renderHook(() => useContext(AuthContext), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current?.isLoading).toBe(false);
      });

      expect(result.current).not.toBeNull();
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('register');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('updateUser');
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('token');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('isLoading');
    });
  });
});
