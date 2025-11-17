'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '../services/userService';
import type { User, UpdateUserDto } from '../types';
import type { ApiError } from '@/shared/types/common';

/**
 * Hook para gestionar el detalle de un usuario específico (solo superadmin)
 * 
 * Funcionalidades:
 * - Cargar datos del usuario por ID
 * - Editar usuario (nombre, email, contraseña opcional, rol)
 * - Eliminar usuario
 * - Validaciones de formulario
 * - Manejo de estados de carga y errores
 * - Redirección automática después de guardar o eliminar
 * 
 * Diferencias con useProfile:
 * - useProfile: gestiona el perfil del usuario autenticado (no puede cambiar rol)
 * - useUserDetail: gestiona cualquier usuario (puede cambiar rol, solo superadmin)
 * 
 * @param userId - ID del usuario a gestionar
 * 
 * @example
 * function UserDetailPage({ params }: { params: { id: string } }) {
 *   const {
 *     user,
 *     formData,
 *     errors,
 *     isLoading,
 *     isSaving,
 *     isDeleting,
 *     handleChange,
 *     handleSubmit,
 *     handleDelete
 *   } = useUserDetail(params.id);
 *   
 *   if (isLoading) return <div>Cargando...</div>;
 *   if (!user) return <div>Usuario no encontrado</div>;
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <Input name="name" value={formData.name} onChange={handleChange} />
 *       <select name="role" value={formData.role} onChange={handleChange}>
 *         <option value="agent">Agente</option>
 *         <option value="superadmin">Superadministrador</option>
 *       </select>
 *       <Button type="submit" isLoading={isSaving}>Guardar</Button>
 *       <Button onClick={handleDelete} isLoading={isDeleting}>Eliminar</Button>
 *     </form>
 *   );
 * }
 */
export function useUserDetail(userId: string) {
  const router = useRouter();

  // Datos del usuario original (para mostrar info y comparar cambios)
  const [user, setUser] = useState<User | null>(null);

  // Estado del formulario de edición
  const [formData, setFormData] = useState<UpdateUserDto>({
    name: '',
    email: '',
    password: '', // Opcional: si se deja vacío, no se cambia
    role: 'agent',
  });

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);  // Cargando datos iniciales
  const [isSaving, setIsSaving] = useState(false);   // Guardando cambios
  const [isDeleting, setIsDeleting] = useState(false); // Eliminando usuario
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Cargar los datos del usuario al montar el componente
   * 
   * Flujo:
   * 1. Hacer GET /api/users/:id
   * 2. Guardar en estado `user`
   * 3. Pre-llenar el formulario con los datos (excepto password)
   * 4. Si falla, mostrar error
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getById(userId);
        
        setUser(userData);
        
        // Pre-llenar el formulario con los datos del usuario
        setFormData({
          name: userData.name,
          email: userData.email,
          password: '', // No cargamos la contraseña por seguridad
          role: userData.role,
        });
      } catch (err) {
        const apiError = err as ApiError;
        setErrors({
          load: apiError.message || 'Error al cargar el usuario',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  /**
   * Manejar cambios en los inputs
   * 
   * @example
   * <Input name="name" value={formData.name} onChange={handleChange} />
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
   * Validar el formulario antes de guardar
   * 
   * Reglas:
   * - Nombre: requerido, mínimo 2 caracteres
   * - Email: requerido, formato válido
   * - Contraseña: OPCIONAL, pero si se proporciona, mínimo 6 caracteres
   * - Rol: requerido
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

    // Validar contraseña (solo si se proporciona)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar rol
    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Guardar cambios del usuario
   * 
   * Flujo:
   * 1. Validar formulario
   * 2. Preparar datos (omitir password si está vacío)
   * 3. Hacer PUT /api/users/:id
   * 4. Redirigir a /users
   * 
   * @param e - Evento del formulario (opcional)
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validar antes de enviar
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      // Preparar datos para actualizar
      const updateData: UpdateUserDto = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      // Solo incluir password si se proporcionó uno nuevo
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Actualizar usuario
      const updatedUser = await userService.update(userId, updateData);
      
      // Actualizar el estado local con los nuevos datos
      setUser(updatedUser);
      
      // Redirigir a la lista de usuarios
      router.push('/users');
    } catch (err) {
      const apiError = err as ApiError;
      setErrors({
        submit: apiError.message || 'Error al actualizar el usuario',
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Eliminar el usuario
   * 
   * Flujo:
   * 1. Hacer DELETE /api/users/:id
   * 2. Redirigir a /users
   * 
   * Nota: Esta función debe ser llamada DESPUÉS de confirmar con el usuario
   * (el componente debe mostrar un modal o confirmación)
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    setErrors({});

    try {
      await userService.delete(userId);
      
      // Redirigir a la lista de usuarios
      router.push('/users');
    } catch (err) {
      const apiError = err as ApiError;
      setErrors({
        delete: apiError.message || 'Error al eliminar el usuario',
      });
      setIsDeleting(false); // Solo resetear si falla (si tiene éxito, redirige)
    }
  };

  return {
    // Datos
    user,           // Usuario original (con todos los datos como createdAt, updatedAt, etc.)
    formData,       // Datos del formulario (para editar)
    
    // Estados
    isLoading,      // true mientras carga los datos iniciales del usuario
    isSaving,       // true mientras guarda los cambios
    isDeleting,     // true mientras elimina el usuario
    errors,         // Errores de validación o de la API
    
    // Funciones
    handleChange,   // Manejar cambios en inputs
    handleSubmit,   // Guardar cambios del usuario
    handleDelete,   // Eliminar usuario (requiere confirmación previa)
  };
}
