import { userService } from '../userService';
import { apiClient } from '@/shared/lib/apiClient';
import type { User, CreateUserDto, UpdateUserDto, UpdateProfileDto } from '../../types';

// Mock de apiClient
jest.mock('@/shared/lib/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('userService', () => {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'agent',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Profile endpoints (/users/me)', () => {
    it('getProfile - obtiene el perfil del usuario autenticado', async () => {
      mockApiClient.get.mockResolvedValue(mockUser);

      const result = await userService.getProfile();

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('updateProfile - actualiza el perfil del usuario autenticado', async () => {
      const updateData: UpdateProfileDto = {
        name: 'Updated Name',
      };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      mockApiClient.put.mockResolvedValue(updatedUser);

      const result = await userService.updateProfile(updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/users/me', updateData);
      expect(result).toEqual(updatedUser);
    });

    it('updateProfile - actualiza email y password', async () => {
      const updateData: UpdateProfileDto = {
        email: 'newemail@example.com',
        password: 'newpassword123',
      };
      const updatedUser = { ...mockUser, email: 'newemail@example.com' };
      mockApiClient.put.mockResolvedValue(updatedUser);

      const result = await userService.updateProfile(updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/users/me', updateData);
      expect(result.email).toBe('newemail@example.com');
    });

    it('deleteProfile - elimina la cuenta propia', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await userService.deleteProfile();

      expect(mockApiClient.delete).toHaveBeenCalledWith('/users/me');
    });
  });

  describe('Admin endpoints (CRUD usuarios)', () => {
    it('getAll - lista todos los usuarios', async () => {
      const mockResponse = {
        users: [mockUser],
        total: 1,
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getAll();

      expect(mockApiClient.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockResponse);
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('getById - obtiene un usuario específico por ID', async () => {
      mockApiClient.get.mockResolvedValue(mockUser);

      const result = await userService.getById('1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockUser);
    });

    it('create - crea un nuevo usuario', async () => {
      const createData: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'agent',
      };
      const newUser = { ...mockUser, ...createData, id: '2' };
      mockApiClient.post.mockResolvedValue(newUser);

      const result = await userService.create(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/users', createData);
      expect(result).toEqual(newUser);
    });

    it('create - crea un superadmin', async () => {
      const createData: CreateUserDto = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpass123',
        role: 'superadmin',
      };
      const adminUser = { ...mockUser, ...createData, role: 'superadmin' };
      mockApiClient.post.mockResolvedValue(adminUser);

      const result = await userService.create(createData);

      expect(result.role).toBe('superadmin');
    });

    it('update - actualiza un usuario específico', async () => {
      const updateData: UpdateUserDto = {
        name: 'Updated User',
        role: 'superadmin',
      };
      const updatedUser = { ...mockUser, ...updateData };
      mockApiClient.put.mockResolvedValue(updatedUser);

      const result = await userService.update('1', updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/users/1', updateData);
      expect(result).toEqual(updatedUser);
    });

    it('update - cambia el rol de un usuario', async () => {
      const updateData: UpdateUserDto = {
        role: 'superadmin',
      };
      const updatedUser = { ...mockUser, role: 'superadmin' };
      mockApiClient.put.mockResolvedValue(updatedUser);

      const result = await userService.update('1', updateData);

      expect(result.role).toBe('superadmin');
    });

    it('delete - elimina un usuario específico', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await userService.delete('1');

      expect(mockApiClient.delete).toHaveBeenCalledWith('/users/1');
    });
  });

  describe('Manejo de errores', () => {
    it('propaga errores de apiClient en getProfile', async () => {
      const error = { statusCode: 401, message: 'Unauthorized' };
      mockApiClient.get.mockRejectedValue(error);

      await expect(userService.getProfile()).rejects.toEqual(error);
    });

    it('propaga errores de apiClient en updateProfile', async () => {
      const error = { statusCode: 400, message: 'Bad Request' };
      mockApiClient.put.mockRejectedValue(error);

      await expect(userService.updateProfile({ name: 'Test' })).rejects.toEqual(error);
    });

    it('propaga errores de apiClient en getAll', async () => {
      const error = { statusCode: 403, message: 'Forbidden' };
      mockApiClient.get.mockRejectedValue(error);

      await expect(userService.getAll()).rejects.toEqual(error);
    });

    it('propaga errores de apiClient en create', async () => {
      const error = { statusCode: 409, message: 'Email already exists' };
      mockApiClient.post.mockRejectedValue(error);

      const createData: CreateUserDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
        role: 'agent',
      };

      await expect(userService.create(createData)).rejects.toEqual(error);
    });

    it('propaga errores de apiClient en update', async () => {
      const error = { statusCode: 404, message: 'User not found' };
      mockApiClient.put.mockRejectedValue(error);

      await expect(userService.update('999', { name: 'Test' })).rejects.toEqual(error);
    });

    it('propaga errores de apiClient en delete', async () => {
      const error = { statusCode: 404, message: 'User not found' };
      mockApiClient.delete.mockRejectedValue(error);

      await expect(userService.delete('999')).rejects.toEqual(error);
    });
  });

  describe('Casos de uso complejos', () => {
    it('flujo completo: crear usuario y luego actualizarlo', async () => {
      const createData: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'agent',
      };
      const newUser = { ...mockUser, ...createData, id: '2' };
      mockApiClient.post.mockResolvedValue(newUser);

      const createdUser = await userService.create(createData);
      expect(createdUser.id).toBe('2');

      const updateData: UpdateUserDto = { role: 'superadmin' };
      const updatedUser = { ...newUser, role: 'superadmin' };
      mockApiClient.put.mockResolvedValue(updatedUser);

      const result = await userService.update('2', updateData);
      expect(result.role).toBe(Role.SUPERADMIN);
    });

    it('flujo completo: obtener todos los usuarios y luego uno específico', async () => {
      const mockResponse = {
        users: [mockUser],
        total: 1,
      };
      mockApiClient.get.mockResolvedValueOnce(mockResponse);

      const allUsers = await userService.getAll();
      expect(allUsers.total).toBe(1);

      mockApiClient.get.mockResolvedValueOnce(mockUser);
      const specificUser = await userService.getById('1');
      expect(specificUser).toEqual(mockUser);
    });
  });
});
