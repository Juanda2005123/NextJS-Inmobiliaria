"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/shared/components/ui";
import type {
  CreateTaskByAgentDto,
  CreateTaskByAdminDto,
  UpdateTaskByAgentDto,
  UpdateTaskByAdminDto,
  Task,
} from "../types";

type PropertyOption = { id: string; title?: string; ownerId?: string | null };
type AgentOption = { id: string; name: string };

interface Props {
  initial?: Partial<Task>;
  properties?: PropertyOption[];
  agents?: AgentOption[];
  onSubmit: (
    data:
      | CreateTaskByAgentDto
      | CreateTaskByAdminDto
      | UpdateTaskByAgentDto
      | UpdateTaskByAdminDto
  ) => Promise<void> | void;
  onCancel?: () => void;
  isAdmin?: boolean;
  isEdit?: boolean;
}

export function TaskForm({
  initial = {},
  properties = [],
  agents = [],
  onSubmit,
  onCancel,
  isAdmin = false,
  isEdit = false,
}: Props) {
  // Convertir fecha ISO a formato YYYY-MM-DD para el input
  const formatDateForInput = (dateStr?: string | null): string | null => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toISOString().split("T")[0];
    } catch {
      return null;
    }
  };

  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [dueDate, setDueDate] = useState<string | null>(
    formatDateForInput(initial.dueDate)
  );
  const [propertyId, setPropertyId] = useState(
    initial.propertyId || (properties[0]?.id ?? "")
  );
  const [assignedTo, setAssignedTo] = useState(initial.assignedToId || "");
  const [isCompleted, setIsCompleted] = useState(initial.isCompleted || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Auto-asignar el agente dueño de la propiedad cuando el superadmin selecciona una propiedad
  useEffect(() => {
    if (isAdmin && !isEdit && propertyId) {
      const selectedProperty = properties.find((p) => p.id === propertyId);
      if (selectedProperty && selectedProperty.ownerId) {
        setAssignedTo(selectedProperty.ownerId);
      }
    }
  }, [propertyId, isAdmin, isEdit, properties]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError("El título es requerido");
      return;
    }
    if (!propertyId && !isEdit) {
      setError("Selecciona una propiedad");
      return;
    }
    // Validar que la fecha no sea del pasado (solo al crear)
    if (!isEdit && dueDate && dueDate < today) {
      setError("La fecha de vencimiento no puede ser anterior a hoy");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        // Modo edición (UPDATE) - sin propertyId
        if (isAdmin) {
          const updateAdminPayload: UpdateTaskByAdminDto = {
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate || undefined,
            assignedToId:
              assignedTo && assignedTo.trim() ? assignedTo : undefined,
            isCompleted,
          };
          console.log(
            "Updating task as admin with payload:",
            updateAdminPayload
          );
          await onSubmit(updateAdminPayload);
        } else {
          const updateAgentPayload: UpdateTaskByAgentDto = {
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate || undefined,
            isCompleted,
          };
          console.log(
            "Updating task as agent with payload:",
            updateAgentPayload
          );
          await onSubmit(updateAgentPayload);
        }
      } else {
        // Modo creación (CREATE) - con propertyId
        if (isAdmin) {
          const adminPayload: CreateTaskByAdminDto = {
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate || undefined,
            propertyId,
            assignedToId:
              assignedTo && assignedTo.trim() ? assignedTo : undefined,
          };
          console.log("Creating task as admin with payload:", adminPayload);
          await onSubmit(adminPayload);
        } else {
          const agentPayload: CreateTaskByAgentDto = {
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate || undefined,
            propertyId,
          };
          console.log("Creating task as agent with payload:", agentPayload);
          await onSubmit(agentPayload);
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError((e && e.message) || "Error al crear/actualizar tarea");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Título */}
      <Input
        id="task-title"
        name="title"
        label="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej: Inspección mensual de la propiedad"
        required
        disabled={isSubmitting}
      />

      {/* Descripción */}
      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-gray-900 mb-1.5"
        >
          Descripción
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={4}
          className="block w-full px-4 py-3.5 text-base text-gray-900 border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:border-gray-900 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe los detalles de la tarea..."
          disabled={isSubmitting}
        />
      </div>

      {/* Fecha de vencimiento */}
      <div>
        <label
          htmlFor="task-dueDate"
          className="block text-sm font-medium text-gray-900 mb-1.5"
        >
          Fecha de vencimiento
        </label>
        <input
          id="task-dueDate"
          name="dueDate"
          type="date"
          className="block w-full px-4 py-3.5 text-base text-gray-900 border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:border-gray-900 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
          value={dueDate ?? ""}
          min={!isEdit ? today : undefined}
          onChange={(e) => setDueDate(e.target.value || null)}
          disabled={isSubmitting}
        />
        {!isEdit && (
          <p className="mt-1.5 text-xs text-gray-600">
            La fecha debe ser hoy o posterior
          </p>
        )}
      </div>

      {/* Propiedad */}
      <div>
        <label
          htmlFor="task-property"
          className="block text-sm font-medium text-gray-900 mb-1.5"
        >
          Propiedad <span className="text-red-500">*</span>
        </label>
        <select
          id="task-property"
          className="block w-full px-4 py-3.5 text-base text-gray-900 border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:border-gray-900 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          disabled={isSubmitting || isEdit}
          required
        >
          <option value="" className="text-gray-500">
            Selecciona una propiedad...
          </option>
          {properties.map((p) => (
            <option key={p.id} value={p.id} className="text-gray-900">
              {p.title ?? p.id}
            </option>
          ))}
        </select>
        {isEdit && (
          <p className="mt-1.5 text-sm text-gray-600">
            La propiedad no se puede cambiar una vez creada la tarea
          </p>
        )}
      </div>

      {/* Checkbox de completada (solo en edición) */}
      {isEdit && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="task-completed"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            disabled={isSubmitting}
            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
          />
          <label
            htmlFor="task-completed"
            className="text-sm font-medium text-gray-900"
          >
            Marcar como completada
          </label>
        </div>
      )}

      {/* Asignar a (solo admin) */}
      {isAdmin && (
        <div>
          <label
            htmlFor="task-assigned"
            className="block text-sm font-medium text-gray-900 mb-1.5"
          >
            Asignar a
          </label>
          <select
            id="task-assigned"
            className="block w-full px-4 py-3.5 text-base text-gray-900 border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:border-gray-900 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={isSubmitting || (!isEdit && !!propertyId)}
          >
            <option value="" className="text-gray-500">
              Sin asignar...
            </option>
            {agents.map((a) => (
              <option key={a.id} value={a.id} className="text-gray-900">
                {a.name}
              </option>
            ))}
          </select>
          {!isEdit && propertyId && assignedTo && (
            <p className="mt-1.5 text-sm text-gray-600">
              Se asignó automáticamente al agente dueño de la propiedad
            </p>
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
          {isEdit ? "Actualizar" : "Crear Tarea"}
        </Button>
      </div>
    </form>
  );
}
