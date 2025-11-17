'use client';

import { useState } from 'react';
import { Input, Button } from '@/shared/components/ui';
import type { CreatePropertyByAgentDto, CreatePropertyByAdminDto } from '../types';

interface PropertyFormProps {
  /**
   * Modo del formulario
   * - 'create-agent': Crear como agente (sin ownerId)
   * - 'create-admin': Crear como superadmin (con ownerId)
   * - 'edit': Editar existente (sin ownerId en form)
   */
  mode: 'create-agent' | 'create-admin' | 'edit';
  
  /**
   * Valores iniciales del formulario
   * Si es create, puede ser undefined (usará defaults)
   * Si es edit, debe tener los valores actuales
   */
  initialValues?: Partial<CreatePropertyByAgentDto | CreatePropertyByAdminDto>;
  
  /**
   * Lista de agentes disponibles (solo para mode="create-admin")
   * Cada agente debe tener { id: string, name: string }
   */
  agents?: Array<{ id: string; name: string; email: string }>;
  
  /**
   * Función que se ejecuta al enviar el formulario
   */
  onSubmit: (data: CreatePropertyByAgentDto | CreatePropertyByAdminDto) => Promise<void>;
  
  /**
   * Estado de loading mientras se envía
   * @default false
   */
  isSubmitting?: boolean;
  
  /**
   * Texto del botón de submit
   * @default 'Guardar'
   */
  submitLabel?: string;
  
  /**
   * Función que se ejecuta al cancelar (opcional)
   */
  onCancel?: () => void;
}

/**
 * Componente PropertyForm - Formulario reutilizable para crear/editar propiedades
 * 
 * Características:
 * - Modo agente: Sin selector de propietario (auto-asignado)
 * - Modo admin: Con selector de propietario (manual)
 * - Modo edit: Para actualizar propiedad existente
 * - Validación básica de campos requeridos
 * - Formateo de números (precio, área, habitaciones, baños)
 * 
 * Campos:
 * - title (text, max 120)
 * - description (textarea)
 * - price (number)
 * - location (text)
 * - bedrooms (number, positivo)
 * - bathrooms (number, positivo)
 * - area (number, positivo)
 * - ownerId (select, solo admin)
 * 
 * NOTA: NO incluye campo de imágenes (el backend las tiene pero no las usamos)
 * 
 * @example
 * // Crear como agente
 * <PropertyForm 
 *   mode="create-agent"
 *   onSubmit={handleCreateAsAgent}
 *   isSubmitting={isSubmitting}
 * />
 * 
 * @example
 * // Crear como admin
 * <PropertyForm 
 *   mode="create-admin"
 *   agents={agentsList}
 *   onSubmit={handleCreateAsAdmin}
 *   isSubmitting={isSubmitting}
 * />
 * 
 * @example
 * // Editar existente
 * <PropertyForm 
 *   mode="edit"
 *   initialValues={property}
 *   onSubmit={handleUpdate}
 *   isSubmitting={isSubmitting}
 * />
 */
export function PropertyForm({
  mode,
  initialValues,
  agents = [],
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Guardar',
  onCancel,
}: PropertyFormProps) {
  // Estado del formulario
  const [formData, setFormData] = useState<CreatePropertyByAgentDto | CreatePropertyByAdminDto>({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    price: initialValues?.price || 0,
    location: initialValues?.location || '',
    bedrooms: initialValues?.bedrooms || 1,
    bathrooms: initialValues?.bathrooms || 1,
    area: initialValues?.area || 0,
    ...(mode === 'create-admin' && { ownerId: (initialValues as CreatePropertyByAdminDto)?.ownerId || '' }),
  });

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validar formulario antes de enviar
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar campos requeridos
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length > 120) {
      newErrors.title = 'El título no puede tener más de 120 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (formData.bedrooms < 1) {
      newErrors.bedrooms = 'Debe tener al menos 1 habitación';
    }

    if (formData.bathrooms < 1) {
      newErrors.bathrooms = 'Debe tener al menos 1 baño';
    }

    if (formData.area <= 0) {
      newErrors.area = 'El área debe ser mayor a 0';
    }

    // Validar ownerId solo en modo create-admin
    if (mode === 'create-admin' && !(formData as CreatePropertyByAdminDto).ownerId) {
      newErrors.ownerId = 'Debes seleccionar un agente propietario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar cambios en inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Convertir a número los campos numéricos
    const numericFields = ['price', 'bedrooms', 'bathrooms', 'area'];
    const parsedValue = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Manejar submit del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validate()) {
      return;
    }

    // Enviar datos
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <Input
        id="title"
        name="title"
        label="Título de la propiedad"
        type="text"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Ej: Casa moderna en el norte de Bogotá"
        maxLength={120}
        required
        disabled={isSubmitting}
      />

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`
            block w-full px-4 py-3.5 text-base text-gray-900
            border rounded-md transition-all duration-200
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
            ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
            }
          `}
          placeholder="Describe las características, acabados, ubicación, servicios cercanos..."
          rows={5}
          required
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Precio */}
      <Input
        id="price"
        name="price"
        label="Precio (COP)"
        type="number"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        placeholder="Ej: 350000000"
        min={0}
        step={1000000}
        required
        disabled={isSubmitting}
      />

      {/* Ubicación */}
      <Input
        id="location"
        name="location"
        label="Ubicación"
        type="text"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
        placeholder="Ej: Carrera 15 #85-40, Chapinero, Bogotá"
        required
        disabled={isSubmitting}
      />

      {/* Grid de características */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Habitaciones */}
        <Input
          id="bedrooms"
          name="bedrooms"
          label="Habitaciones"
          type="number"
          value={formData.bedrooms}
          onChange={handleChange}
          error={errors.bedrooms}
          min={1}
          required
          disabled={isSubmitting}
        />

        {/* Baños */}
        <Input
          id="bathrooms"
          name="bathrooms"
          label="Baños"
          type="number"
          value={formData.bathrooms}
          onChange={handleChange}
          error={errors.bathrooms}
          min={1}
          required
          disabled={isSubmitting}
        />

        {/* Área */}
        <Input
          id="area"
          name="area"
          label="Área (m²)"
          type="number"
          value={formData.area}
          onChange={handleChange}
          error={errors.area}
          placeholder="Ej: 120"
          min={0}
          step={1}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Selector de agente (solo para superadmin) */}
      {mode === 'create-admin' && (
        <div>
          <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1.5">
            Agente Propietario <span className="text-red-500">*</span>
          </label>
          <select
            id="ownerId"
            name="ownerId"
            value={(formData as CreatePropertyByAdminDto).ownerId || ''}
            onChange={handleChange}
            className={`
              block w-full px-4 py-3.5 text-base
              border rounded-md transition-all duration-200
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
              ${
                errors.ownerId
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
              }
            `}
            required
            disabled={isSubmitting}
          >
            <option value="">Selecciona un agente...</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
          {errors.ownerId && (
            <p className="mt-1.5 text-sm text-red-600">{errors.ownerId}</p>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
