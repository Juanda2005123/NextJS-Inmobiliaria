import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { Role } from '@/features/users/types';
import type { ReactNode } from 'react';

// Mock de authService
jest.mock('@/features/auth/services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

// Mock de authStorage
jest.mock('@/shared/lib/authStorage', () => ({
  authStorage: {
    getToken: jest.fn(() => null),
    getUser: jest.fn(() => null),
    setToken: jest.fn(),
    setUser: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('useAuth', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('lanza error cuando se usa fuera de AuthProvider', () => {
    // Suprimir console.error para esta prueba
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleErrorSpy.mockRestore();
  });

  it('devuelve el contexto cuando se usa dentro de AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.updateUser).toBe('function');
  });

  it('expone isAuthenticated como false cuando no hay usuario', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('expone user como null cuando no hay usuario autenticado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
  });

  it('expone todas las funciones necesarias del contexto', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Verificar que existen todas las funciones
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('register');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('updateUser');
    
    // Verificar que son funciones
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.updateUser).toBe('function');
  });
});
