'use client';

import { useAuth } from './useAuth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import type { Role } from '@/shared/types';

interface UseRequireAuthOptions {
  /**
   * Rol requerido para acceder a la página
   * Si no se especifica, cualquier usuario autenticado puede acceder
   */
  requiredRole?: Role;
  
  /**
   * URL a donde redirigir si el usuario NO está autenticado
   * @default '/auth/login'
   */
  unauthorizedRedirect?: string;
  
  /**
   * URL a donde redirigir si el usuario NO tiene el rol requerido
   * @default '/unauthorized'
   */
  forbiddenRedirect?: string;
}

/**
 * Hook que fuerza autenticación en una página
 * 
 * Redirige automáticamente si:
 * - El usuario no está autenticado → `unauthorizedRedirect`
 * - El usuario no tiene el rol requerido → `forbiddenRedirect`
 * 
 * @param options - Configuración del hook
 * @returns Estado de carga y usuario actual
 * 
 * @example
 * // Solo superadmin, con redirects personalizados
 * function UsersPage() {
 *   const { isLoading, user } = useRequireAuth({ 
 *     requiredRole: 'superadmin',
 *     unauthorizedRedirect: '/auth/admin-login',
 *     forbiddenRedirect: '/dashboard'
 *   });
 *   
 *   if (isLoading) return <div>Cargando...</div>;
 *   
 *   return <div>Panel de Admin</div>;
 * }
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { 
    requiredRole, 
    unauthorizedRedirect = '/auth/login',
    forbiddenRedirect = '/unauthorized'
  } = options;
  
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // 1. Espera a que termine de verificar la sesión
    //    No redirige hasta estar seguro del estado de autenticación
    if (isLoading) return;

    // 2. Si no está autenticado, redirige al login
    //    Usa `unauthorizedRedirect` (default: '/auth/login')
    if (!isAuthenticated) {
      redirect(unauthorizedRedirect);
    }

    // 3. Si requiere un rol específico y el usuario no lo tiene
    //    Usa `forbiddenRedirect` (default: '/unauthorized')
    if (requiredRole && user?.role !== requiredRole) {
      redirect(forbiddenRedirect);
    }
  }, [isLoading, isAuthenticated, requiredRole, user, unauthorizedRedirect, forbiddenRedirect]);

  return { isLoading, user };
}