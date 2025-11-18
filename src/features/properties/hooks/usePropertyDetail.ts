"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { propertyService } from "../services/propertyService";
import type {
  Property,
  UpdatePropertyByAgentDto,
  UpdatePropertyByAdminDto,
} from "../types";
import type { ApiError } from "@/shared/types/common";

/**
 * Hook MIXTO para ver/editar/eliminar una propiedad específica
 *
 * Este hook funciona en DOS modos:
 *
 * 1. **MODO PÚBLICO** (sin autenticación):
 *    - Carga la propiedad con skipAuth: true
 *    - canEdit = false, canDelete = false
 *    - handleSubmit y handleDelete no hacen nada
 *    - Usado en /properties/[id] (página pública)
 *
 * 2. **MODO AUTENTICADO** (con autenticación):
 *    - Carga la propiedad normalmente
 *    - canEdit y canDelete dependen del rol y ownership
 *    - handleSubmit usa updateAsAgent() o updateAsAdmin()
 *    - handleDelete usa deleteAsAgent() o deleteAsAdmin()
 *    - Usado en /dashboard/properties/[id] (página protegida)
 *
 * Permisos:
 * - **Agente**: Solo puede editar/eliminar sus propias propiedades (ownerId === user.id)
 * - **Superadmin**: Puede editar/eliminar cualquier propiedad
 * - **Usuario no autenticado**: Solo puede ver (read-only)
 *
 * @param propertyId - UUID de la propiedad a cargar
 *
 * @returns Estado con propiedad, form data, funciones de edición/eliminación y permisos
 *
 * @example
 * // Página pública /properties/[id] (read-only)
 * export default function PublicPropertyPage({ params }) {
 *   const { id } = use(params);
 *   const { property, isLoading, error, canEdit } = usePropertyDetail(id);
 *
 *   // canEdit será false, solo muestra los datos
 *   return <PropertyView property={property} readOnly />;
 * }
 *
 * @example
 * // Página protegida /dashboard/properties/[id] (editable)
 * export default function EditPropertyPage({ params }) {
 *   const { id } = use(params);
 *   const {
 *     formData,
 *     canEdit,
 *     canDelete,
 *     handleChange,
 *     handleSubmit,
 *     handleDelete,
 *     isSaving,
 *     isDeleting
 *   } = usePropertyDetail(id);
 *
 *   if (!canEdit) return <Navigate to="/dashboard" />;
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <Input name="title" value={formData.title} onChange={handleChange} />
 *       <Button type="submit" disabled={isSaving}>Guardar</Button>
 *       {canDelete && (
 *         <Button onClick={handleDelete} disabled={isDeleting}>Eliminar</Button>
 *       )}
 *     </form>
 *   );
 * }
 */
export function usePropertyDetail(propertyId: string) {
  const router = useRouter();
  const { user } = useAuth(); // Puede ser null si no está autenticado

  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<UpdatePropertyByAgentDto>({
    title: "",
    description: "",
    price: 0,
    location: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar propiedad por ID
   *
   * Flujo:
   * 1. Llamar a GET /api/properties/:id (público, skipAuth: true)
   * 2. Actualizar estado con la propiedad
   * 3. Inicializar formData con los valores de la propiedad
   *
   * Nota: Siempre usa skipAuth para que funcione en páginas públicas y protegidas
   */
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await propertyService.getById(propertyId);
        setProperty(data);

        // Inicializar formData con los datos de la propiedad (sin ownerId para agentes)
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
        });

        setIsLoading(false);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        console.error("usePropertyDetail.loadProperty error:", apiError);
        setError(apiError.message || "Error al cargar la propiedad");
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  /**
   * Permisos calculados dinámicamente
   *
   * canEdit:
   * - Superadmin: Siempre puede editar
   * - Agente: Solo si property.ownerId === user.id
   * - No autenticado: false
   *
   * canDelete:
   * - Superadmin: Siempre puede eliminar
   * - Agente: Solo si property.ownerId === user.id
   * - No autenticado: false
   */
  const canEdit = user
    ? user.role === "superadmin" || property?.ownerId === user.id
    : false;

  const canDelete = user
    ? user.role === "superadmin" || property?.ownerId === user.id
    : false;

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Convertir a número los campos numéricos
    const numericFields = ["price", "bedrooms", "bathrooms", "area"];
    const parsedValue = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  /**
   * Actualizar propiedad con datos (para usar desde PropertyForm)
   *
   * Flujo:
   * 1. Verificar si tiene permisos (canEdit)
   * 2. Si superadmin: usar updateAsAdmin() con ownerId opcional
   * 3. Si agente: usar updateAsAgent() sin ownerId
   * 4. Actualizar estado local con los nuevos datos
   *
   * Nota: El agente NO puede cambiar el ownerId de una propiedad
   */
  const updateProperty = async (
    data: UpdatePropertyByAgentDto | UpdatePropertyByAdminDto
  ) => {
    if (!canEdit) {
      setError("No tienes permisos para editar esta propiedad");
      throw new Error("No tienes permisos para editar esta propiedad");
    }

    setIsSaving(true);
    setError(null);

    try {
      let updatedProperty: Property;

      if (user?.role === "superadmin") {
        // Superadmin puede usar updateAsAdmin (con ownerId opcional)
        updatedProperty = await propertyService.updateAsAdmin(propertyId, data);
      } else {
        // Agente usa updateAsAgent (sin ownerId)
        updatedProperty = await propertyService.updateAsAgent(
          propertyId,
          data as UpdatePropertyByAgentDto
        );
      }

      setProperty(updatedProperty);
      setFormData({
        title: updatedProperty.title,
        description: updatedProperty.description,
        price: updatedProperty.price,
        location: updatedProperty.location,
        bedrooms: updatedProperty.bedrooms,
        bathrooms: updatedProperty.bathrooms,
        area: updatedProperty.area,
      });
      setIsSaving(false);
    } catch (err) {
      const apiError = err as ApiError;
      console.error("usePropertyDetail.updateProperty error:", apiError);
      setError(apiError.message || "Error al actualizar la propiedad");
      setIsSaving(false);
      throw err;
    }
  };

  /**
   * Guardar cambios (handler de formulario tradicional)
   * Mantener para compatibilidad si alguien usa el form directamente
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProperty(formData);
  };

  /**
   * Eliminar propiedad
   *
   * Flujo:
   * 1. Verificar si tiene permisos (canDelete)
   * 2. Si superadmin: usar deleteAsAdmin() (puede eliminar cualquier propiedad)
   * 3. Si agente: usar deleteAsAgent() (solo puede eliminar las suyas)
   * 4. Redirigir a /properties después de eliminar
   *
   * Nota: La eliminación es SOFT DELETE (backend marca isDeleted: true)
   * Nota: La confirmación se maneja en el componente, no en el hook
   */
  const handleDelete = async () => {
    if (!canDelete) {
      setError("No tienes permisos para eliminar esta propiedad");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      if (user?.role === "superadmin") {
        // Superadmin puede eliminar cualquier propiedad
        await propertyService.deleteAsAdmin(propertyId);
      } else {
        // Agente solo puede eliminar las suyas
        await propertyService.deleteAsAgent(propertyId);
      }

      // Redirigir después de eliminar exitosamente
      router.push("/properties");
    } catch (err) {
      const apiError = err as ApiError;
      console.error("usePropertyDetail.handleDelete error:", apiError);
      setError(apiError.message || "Error al eliminar la propiedad");
      setIsDeleting(false);
    }
  };

  return {
    // Datos
    property, // Propiedad cargada (null mientras carga)
    formData, // Datos del formulario para edición

    // Permisos
    canEdit, // true si puede editar (superadmin o owner)
    canDelete, // true si puede eliminar (superadmin o owner)

    // Estados
    isLoading, // true mientras carga la propiedad
    isSaving, // true mientras guarda cambios
    isDeleting, // true mientras elimina
    error, // Mensaje de error si falla

    // Acciones
    handleChange, // Manejar cambios en inputs
    handleSubmit, // Guardar cambios (handler de form event)
    updateProperty, // Actualizar con datos directos (para PropertyForm)
    handleDelete, // Eliminar propiedad
  };
}
