'use client';

import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types';
import type { ApiError } from '@/shared/types/common';

/**
 * Hook para gestionar la lista de usuarios (solo superadmin)
 * 
 * Funcionalidades:
 * - Obtener lista completa de usuarios
 * - Eliminar un usuario específico
 * - Auto-fetch al montar el componente
 * - Manejo de estados de carga y errores
 * 
 * @example
 * function UsersPage() {
 *   const { users, total, isLoading, error, deleteUser, refetch } = useUsers();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   
 *   return <UserTable users={users} onDelete={deleteUser} />;
 * }
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener todos los usuarios del backend
   * 
   * Se ejecuta automáticamente al montar el componente
   * También se puede llamar manualmente con refetch()
   */
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getAll();
      setUsers(response.users);
      setTotal(response.total);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Error al cargar usuarios';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Eliminar un usuario específico
   * 
   * Flujo:
   * 1. Llama al backend para hacer soft delete
   * 2. Actualiza la lista local (sin hacer refetch)
   * 
   * @param id - UUID del usuario a eliminar
   */
  const deleteUser = async (id: string) => {
    try {
      await userService.delete(id);
      
      // Actualizar la lista local (filtrar el usuario eliminado)
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setTotal(prevTotal => prevTotal - 1);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Error al eliminar usuario';
      setError(errorMessage);
      throw err; // Re-lanzamos para que el componente maneje el error
    }
  };

  /**
   * Re-fetch manual de la lista
   * 
   * Útil después de crear o actualizar un usuario
   */
  const refetch = () => {
    fetchUsers();
  };

  // Auto-fetch al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []); // Array vacío = solo se ejecuta una vez al montar

  return {
    users,       // Lista de usuarios
    total,       // Total de usuarios
    isLoading,   // true mientras carga
    error,       // Mensaje de error si falla
    deleteUser,  // Función para eliminar
    refetch,     // Función para recargar la lista
  };
}