'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { userService } from '../services/userService';
import type { UpdateProfileDto } from '../types';
import type { ApiError } from '@/shared/types/common';

/**
 * Hook para gestionar el perfil del usuario autenticado
 * 
 * Funcionalidades:
 * - Pre-carga automática de datos del usuario
 * - Actualizar nombre, email o contraseña
 * - Eliminar cuenta propia
 * - Validaciones de formulario
 * - Manejo de estados de carga y errores
 * 
 * @example
 * function ProfilePage() {
 *   const { formData, errors, isLoading, handleChange, handleSubmit, deleteAccount } = useProfile();
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <Input name="name" value={formData.name} onChange={handleChange} error={errors.name} />
 *       <Button type="submit" isLoading={isLoading}>Guardar</Button>
 *     </form>
 *   );
 * }
 */
export function useProfile() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  
  // Estado del formulario (pre-cargado con datos del usuario)
  const [formData, setFormData] = useState<UpdateProfileDto>({
    name: '',
    email: '',
    password: '',
  });

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Pre-cargar los datos del usuario en el formulario
   * Se ejecuta cuando el usuario cambia (login, actualización)
   */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // No pre-llenamos la contraseña por seguridad
      });
    }
  }, [user]);

  /**
   * Manejar cambios en los inputs
   * 
   * @example
   * <Input name="name" value={formData.name} onChange={handleChange} />
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Validar el formulario antes de enviar
   * 
   * @returns true si el formulario es válido
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar contraseña (solo si se está cambiando)
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Actualizar el perfil del usuario
   * 
   * Flujo:
   * 1. Valida los datos
   * 2. Llama al backend para actualizar
   * 3. Actualiza el AuthContext con los nuevos datos
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validar antes de enviar
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Preparar datos: solo enviar campos que se cambiaron
      const updateData: UpdateProfileDto = {
        name: formData.name,
        email: formData.email,
      };

      // Solo incluir password si se cambió
      if (formData.password) {
        updateData.password = formData.password;
      }

      // 1. Actualizar en el backend
      const updatedUser = await userService.updateProfile(updateData);
      
      // 2. Actualizar el contexto de auth (para que Navbar vea el nuevo nombre)
      updateUser(updatedUser);

      // 3. Limpiar el campo de contraseña después de actualizar
      setFormData(prev => ({
        ...prev,
        password: '',
      }));

      return updatedUser;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Error al actualizar el perfil';
      setErrors({ submit: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Eliminar la cuenta propia
   * 
   * Flujo:
   * 1. Llama al backend para soft delete
   * 2. Hace logout (limpia token y AuthContext)
   * 3. Redirige al home
   * 
   * @returns true si se eliminó exitosamente, false si hubo error
   */
  const deleteAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    setErrors({});

    try {
      // 1. Soft delete en el backend
      await userService.deleteProfile();
      
      // 2. Logout (limpia localStorage y AuthContext)
      logout();
      
      // 3. Redirigir al home
      router.push('/');
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Error al eliminar la cuenta';
      setErrors({ delete: errorMessage });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,              // Usuario actual (desde AuthContext)
    formData,          // Datos del formulario (pre-cargados)
    errors,            // Errores de validación por campo
    isLoading,         // true mientras hace la petición
    handleChange,      // Función para manejar cambios en inputs
    handleSubmit,      // Función para enviar el formulario (como updateProfile)
    deleteAccount,     // Función para eliminar cuenta
    setFormData,       // Por si necesitas cambiar el formulario manualmente
  };
}