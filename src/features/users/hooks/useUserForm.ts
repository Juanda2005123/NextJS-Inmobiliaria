'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '../services/userService';
import type { CreateUserDto } from '../types';
import type { ApiError } from '@/shared/types/common';

/**
 * Hook para crear nuevos usuarios (solo superadmin)
 * 
 * Funcionalidades:
 * - Crear nuevo usuario con nombre, email, contraseña y rol
 * - Validaciones de formulario
 * - Manejo de estados de carga y errores
 * - Redirección automática a /users después de crear
 * 
 * @example
 * function CreateUserPage() {
 *   const { formData, errors, isSubmitting, handleChange, handleSubmit } = useUserForm();
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <Input name="name" value={formData.name} onChange={handleChange} error={errors.name} />
 *       <Input name="email" value={formData.email} onChange={handleChange} error={errors.email} />
 *       <Input name="password" value={formData.password} onChange={handleChange} error={errors.password} />
 *       <select name="role" value={formData.role} onChange={handleChange}>
 *         <option value="agent">Agente</option>
 *         <option value="superadmin">Superadministrador</option>
 *       </select>
 *       <Button type="submit" isLoading={isSubmitting}>Crear</Button>
 *     </form>
 *   );
 * }
 */
export function useUserForm() {
  const router = useRouter();

  // Estado del formulario
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    password: '',
    role: 'agent',
  });

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
   * Validar el formulario antes de enviar
   * 
   * @returns true si el formulario es válido
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Enviar el formulario (crear usuario)
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validar antes de enviar
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Crear usuario
      await userService.create(formData);
      
      // Redirigir a la lista de usuarios
      router.push('/users');
    } catch (err) {
      const apiError = err as ApiError;
      setErrors({
        submit: apiError.message || 'Error al crear usuario',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,       // Datos del formulario
    isSubmitting,   // true mientras envía el formulario
    errors,         // Errores de validación por campo
    handleChange,   // Función para manejar cambios en inputs
    handleSubmit,   // Función para enviar el formulario
  };
}