import { apiClient } from '../apiClient';
import { authStorage } from '../authStorage';

// Mock de authStorage
jest.mock('../authStorage', () => ({
  authStorage: {
    getToken: jest.fn(),
  },
}));

// Mock de fetch global
global.fetch = jest.fn();

describe('apiClient', () => {
  const mockToken = 'mock-jwt-token';
  const mockGetToken = authStorage.getToken as jest.Mock;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetToken.mockReturnValue(mockToken);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('hace una petición GET exitosa', async () => {
      const mockData = { id: '1', name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      const result = await apiClient.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('hace una petición GET sin token cuando skipAuth es true', async () => {
      const mockData = { message: 'public' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      } as Response);

      await apiClient.get('/public', { skipAuth: true });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });
  });

  describe('POST requests', () => {
    it('hace una petición POST exitosa con body', async () => {
      const mockBody = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { id: '1', email: 'test@example.com' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await apiClient.post('/auth/login', mockBody);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('hace una petición POST sin body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response);

      await apiClient.post('/auth/logout');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('hace una petición PUT exitosa', async () => {
      const mockBody = { name: 'Updated Name' };
      const mockResponse = { id: '1', name: 'Updated Name' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await apiClient.put('/users/1', mockBody);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('PATCH requests', () => {
    it('hace una petición PATCH exitosa', async () => {
      const mockBody = { isActive: false };
      const mockResponse = { id: '1', isActive: false };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await apiClient.patch('/users/1', mockBody);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(mockBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('hace una petición DELETE exitosa', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: 'Deleted' }),
      } as Response);

      const result = await apiClient.delete('/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual({ message: 'Deleted' });
    });

    it('maneja respuesta 204 (No Content)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as Response);

      const result = await apiClient.delete('/users/1');

      expect(result).toBeNull();
    });
  });

  describe('Manejo de errores', () => {
    it('lanza error cuando la respuesta no es ok (JSON válido)', async () => {
      const mockError = {
        statusCode: 404,
        message: 'Not Found',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockError,
      } as Response);

      await expect(apiClient.get('/users/999')).rejects.toEqual(mockError);
    });

    it('lanza error con statusText cuando el JSON de error falla', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(apiClient.get('/error')).rejects.toEqual({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    });

    it('maneja error 401 Unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          statusCode: 401,
          message: 'Unauthorized',
        }),
      } as Response);

      await expect(apiClient.get('/protected')).rejects.toEqual({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('maneja error 403 Forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({
          statusCode: 403,
          message: 'Forbidden',
        }),
      } as Response);

      await expect(apiClient.get('/admin')).rejects.toEqual({
        statusCode: 403,
        message: 'Forbidden',
      });
    });
  });

  describe('Headers personalizados', () => {
    it('permite agregar headers adicionales', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response);

      await apiClient.get('/users', {
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value',
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });

  describe('parseJson option', () => {
    it('no parsea JSON cuando parseJson es false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'plain text response',
      } as Response);

      const result = await apiClient.get('/text', { parseJson: false });

      expect(result).toBeNull();
    });
  });

  describe('Token handling', () => {
    it('no incluye Authorization header cuando no hay token', async () => {
      mockGetToken.mockReturnValue(null);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response);

      await apiClient.get('/public');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });
  });
});
