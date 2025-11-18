"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePropertyDetail } from "@/features/properties/hooks/usePropertyDetail";
import { PropertyForm } from "@/features/properties/components";
import {
  Building2,
  Loader2,
  AlertCircle,
  Trash2,
  ArrowLeft,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";
import type {
  UpdatePropertyByAgentDto,
  UpdatePropertyByAdminDto,
} from "@/features/properties/types";

/**
 * Página de edición/eliminación de propiedad
 *
 * Acceso:
 * - Agente: Solo puede editar/eliminar sus propias propiedades (ownerId === user.id)
 * - Superadmin: Puede editar/eliminar cualquier propiedad
 *
 * Características:
 * - Verificación de permisos con usePropertyDetail
 * - Form con valores iniciales de la propiedad
 * - Vista previa de la propiedad antes del form
 * - Zona de peligro para eliminar (confirmación)
 * - Redirección a /properties tras eliminar
 *
 * Ruta: /properties/[id]
 */
export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const {
    property,
    canEdit,
    canDelete,
    isLoading,
    error: hookError,
    handleDelete: deleteProperty,
    updateProperty,
    isSaving,
    isDeleting,
  } = usePropertyDetail(id);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Manejar envío del formulario desde PropertyForm
   * PropertyForm pasa el DTO directamente (no un evento)
   */
  const handleFormSubmit = async (
    data: UpdatePropertyByAgentDto | UpdatePropertyByAdminDto
  ) => {
    try {
      await updateProperty(data);
      router.refresh();
    } catch (err: unknown) {
      // Error ya manejado por el hook y mostrado en hookError
    }
  };

  /**
   * Manejar eliminación con confirmación
   */
  const handleDeleteClick = async () => {
    setDeleteError(null);

    try {
      await deleteProperty();
      // El hook ya redirige a /properties después de eliminar
    } catch (err: unknown) {
      const e = err as Error;
      const errorMessage = e?.message || "Error al eliminar la propiedad";
      setDeleteError(errorMessage);
    }
  };

  /**
   * Volver a lista de propiedades
   */
  const handleBack = () => {
    router.push("/properties");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hookError || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Error al cargar
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {hookError || "No se pudo encontrar la propiedad"}
          </p>
          <button
            onClick={handleBack}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Volver a Propiedades
          </button>
        </div>
      </div>
    );
  }

  // No tiene permisos
  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-yellow-200 p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 text-center mb-6">
            No tienes permisos para editar esta propiedad
          </p>
          <button
            onClick={handleBack}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Volver a Propiedades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Botón Volver */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Propiedades
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href="/properties"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Propiedades
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{property.title}</span>
          </nav>

          {/* Título */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Editar Propiedad</h1>
              <p className="text-gray-300 text-lg">{property.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Vista previa */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Vista Previa
              </h3>

              <div className="space-y-4">
                {/* Precio */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Precio</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(property.price)}
                    </p>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Ubicación</p>
                    <p className="text-sm text-gray-900">{property.location}</p>
                  </div>
                </div>

                {/* Características */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-3">Características</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="p-2 bg-purple-50 rounded-lg mx-auto w-fit mb-1">
                        <Bed className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-500">Habitaciones</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {property.bedrooms}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="p-2 bg-orange-50 rounded-lg mx-auto w-fit mb-1">
                        <Bath className="w-4 h-4 text-orange-600" />
                      </div>
                      <p className="text-xs text-gray-500">Baños</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {property.bathrooms}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="p-2 bg-teal-50 rounded-lg mx-auto w-fit mb-1">
                        <Maximize className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="text-xs text-gray-500">Área</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {property.area}m²
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {property.ownerId && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="w-4 h-4" />
                      <span>ID Propietario: {property.ownerId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Creada:{" "}
                      {new Date(property.createdAt).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Formulario y zona de peligro */}
          <div className="lg:col-span-2 space-y-8">
            {/* Card del formulario */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Información de la Propiedad
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Actualiza los datos de la propiedad
                </p>
              </div>

              <div className="px-8 py-8">
                {/* Error de submit (provisto por el hook) */}
                {hookError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-red-900 mb-1">
                        Error al actualizar
                      </h3>
                      <p className="text-sm text-red-700">{hookError}</p>
                    </div>
                  </div>
                )}

                <PropertyForm
                  mode="edit"
                  initialValues={{
                    title: property.title,
                    description: property.description,
                    price: property.price,
                    location: property.location,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    area: property.area,
                  }}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSaving}
                  submitLabel={isSaving ? "Guardando..." : "Guardar Cambios"}
                />
              </div>
            </div>

            {/* Zona de peligro (solo si puede eliminar) */}
            {canDelete && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-white px-8 py-6 border-b-2 border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-red-900">
                        Zona de Peligro
                      </h2>
                      <p className="text-sm text-red-700 mt-0.5">
                        Acciones irreversibles
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-8">
                  {/* Error de delete */}
                  {deleteError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-red-900 mb-1">
                          Error al eliminar
                        </h3>
                        <p className="text-sm text-red-700">{deleteError}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        Eliminar esta propiedad
                      </h3>
                      <p className="text-sm text-gray-600">
                        Una vez eliminada, esta propiedad no podrá ser
                        recuperada. Esta acción es permanente y eliminará toda
                        la información asociada.
                      </p>
                    </div>

                    {/* Modal de confirmación */}
                    {showDeleteConfirm ? (
                      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-semibold text-red-900 mb-1">
                              ¿Estás absolutamente seguro?
                            </h4>
                            <p className="text-sm text-red-700 mb-2">
                              Se eliminará la propiedad{" "}
                              <span className="font-semibold">
                                {property.title}
                              </span>{" "}
                              de forma inmediata.
                            </p>
                            <p className="text-sm text-red-700">
                              Esta acción no se puede deshacer.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Eliminando...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-5 h-5" />
                                Sí, eliminar propiedad
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                            className="px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                        Eliminar Propiedad
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
