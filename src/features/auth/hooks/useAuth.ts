import { useContext } from 'react';
import { AuthContext } from '@/features/auth/context/AuthContext';

/**
 * Hook personalizado para consumir AuthContext
 * 
 * @throws Error si se usa fuera de AuthProvider
 * @returns Estado y funciones de autenticación
 * 
 * @example
 * function Header() {
 *   const { user, isAuthenticated, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <a href="/login">Iniciar sesión</a>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Hola, {user.name}</p>
 *       <button onClick={logout}>Cerrar sesión</button>
 *     </div>
 *   );
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}