import { authStorage } from './authStorage';
import { ApiError } from '@/shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  parseJson?: boolean;
}

class ApiClient {
  constructor(private readonly baseURL: string) {}

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, parseJson = true, headers, ...rest } = options;

    const token = skipAuth ? null : authStorage.getToken();

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...rest,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      let errorBody: ApiError | null = null;

      try {
        errorBody = await response.json();
      } catch {
        errorBody = {
          message: response.statusText,
          statusCode: response.status,
        };
      }

      throw errorBody;
    }

    if (response.status === 204 || !parseJson) {
      return null as T;
    }

    return (await response.json()) as T;
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, 'POST', body, options);
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, 'PUT', body, options);
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, 'PATCH', body, options);
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
}

export const apiClient = new ApiClient(API_URL);