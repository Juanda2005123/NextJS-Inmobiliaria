import { authService } from '../authService';
import { apiClient } from '@/shared/lib/apiClient';

// Mock del apiClient
jest.mock('@/shared/lib/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('llama a POST /auth/login con las credenciales correctas', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'AGENT',
          isActive: true,
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials,
        { skipAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it('utiliza skipAuth: true para login', async () => {
      const mockResponse = {
        token: 'token',
        user: {
          id: '1',
          name: 'User',
          email: 'user@test.com',
          role: 'AGENT',
          isActive: true,
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await authService.login({
        email: 'user@test.com',
        password: 'pass',
      });

      const callArgs = (apiClient.post as jest.Mock).mock.calls[0];
      expect(callArgs[2]).toEqual({ skipAuth: true });
    });

    it('maneja errores del servidor', async () => {
      const mockError = {
        statusCode: 401,
        message: 'Invalid credentials',
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrongpass',
        })
      ).rejects.toEqual(mockError);
    });

    it('retorna el token y usuario correctamente', async () => {
      const mockResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'SUPERADMIN',
          isActive: true,
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'john@example.com',
        password: 'admin123',
      });

      expect(result.token).toBe(mockResponse.token);
      expect(result.user).toEqual(mockResponse.user);
    });
  });

  describe('register', () => {
    it('llama a POST /auth/register con los datos correctos', async () => {
      const mockResponse = {
        id: '1',
        name: 'New User',
        email: 'new@example.com',
        role: 'AGENT',
        isActive: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const registerData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const result = await authService.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/register',
        registerData,
        { skipAuth: true }
      );
      expect(result).toEqual(mockResponse);
    });

    it('utiliza skipAuth: true para register', async () => {
      const mockResponse = {
        id: '1',
        name: 'User',
        email: 'user@test.com',
        role: 'AGENT',
        isActive: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await authService.register({
        name: 'User',
        email: 'user@test.com',
        password: 'pass',
      });

      const callArgs = (apiClient.post as jest.Mock).mock.calls[0];
      expect(callArgs[2]).toEqual({ skipAuth: true });
    });

    it('maneja errores de validación', async () => {
      const mockError = {
        statusCode: 400,
        message: 'Email already exists',
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        authService.register({
          name: 'Test',
          email: 'existing@example.com',
          password: 'pass',
        })
      ).rejects.toEqual(mockError);
    });

    it('retorna el usuario creado sin el token', async () => {
      const mockResponse = {
        id: '456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'AGENT',
        isActive: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.register({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'secure123',
      });

      expect(result).toEqual(mockResponse);
      expect(result).not.toHaveProperty('token');
    });

    it('crea usuarios con rol AGENT por defecto', async () => {
      const mockResponse = {
        id: '1',
        name: 'Agent User',
        email: 'agent@example.com',
        role: 'AGENT',
        isActive: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.register({
        name: 'Agent User',
        email: 'agent@example.com',
        password: 'pass123',
      });

      expect(result.role).toBe('AGENT');
    });
  });

  describe('Casos de uso combinados', () => {
    it('permite registrar y luego hacer login', async () => {
      const registerResponse = {
        id: '1',
        name: 'New User',
        email: 'new@example.com',
        role: 'AGENT',
        isActive: true,
      };

      const loginResponse = {
        token: 'jwt-token',
        user: registerResponse,
      };

      (apiClient.post as jest.Mock)
        .mockResolvedValueOnce(registerResponse) // Primera llamada: register
        .mockResolvedValueOnce(loginResponse);   // Segunda llamada: login

      const registerData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      await authService.register(registerData);
      const loginResult = await authService.login({
        email: registerData.email,
        password: registerData.password,
      });

      expect(loginResult.token).toBeDefined();
      expect(loginResult.user.email).toBe(registerData.email);
    });
  });
});
