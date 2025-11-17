'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { authStorage } from '@/shared/lib/authStorage';
import { authService } from '@/features/auth/services/authService';
import { userService } from '@/features/users/services/userService';
import type { User } from '@/features/users/types';
import type { AuthState, LoginDto, RegisterDto } from '@/features/auth/types';

interface AuthContextValue extends AuthState {
  login: (payload: LoginDto) => Promise<User>;
  register: (payload: RegisterDto) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getToken();
      const user = authStorage.getUser();

      if (token && user) {
        try {
          const freshUser = await userService.getProfile();
          setAuthState({
            user: freshUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          authStorage.setUser(freshUser);
        } catch {
          authStorage.clear();
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (payload: LoginDto): Promise<User> => {
    const { token, user } = await authService.login(payload);
    authStorage.setToken(token);
    authStorage.setUser(user);
    setAuthState({ user, token, isAuthenticated: true, isLoading: false });
    return user;
  };

  //Se puede cambiar, se realiza un auto login para que el usuario no tenga que logearse manualmente despues de registrarse
  const register = async (payload: RegisterDto): Promise<User> => {
    // Limpiar cualquier sesión anterior antes de registrar
    authStorage.clear();
    
    await authService.register(payload);
    const loginResult = await login({ email: payload.email, password: payload.password });
    return loginResult;
  };

  const logout = () => {
    authStorage.clear();
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  const updateUser = (user: User) => {
    authStorage.setUser(user);
    setAuthState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}