"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { TaskForm } from "@/features/tasks/components";
import { taskService } from "@/features/tasks/services";
import { CheckSquare, ListTodo, AlertCircle, Loader2 } from "lucide-react";

import type { Property } from "@/features/properties/types";
import { useUsers } from "@/features/users/hooks/useUsers";
import type {
  CreateTaskByAgentDto,
  CreateTaskByAdminDto,
  UpdateTaskByAgentDto,
  UpdateTaskByAdminDto,
} from "@/features/tasks/types";
import {
  useAgentProperties,
  useAdminProperties,
} from "@/features/properties/hooks";

export default function CreateTaskPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "superadmin";

  // properties: for agent we use useAgentProperties (only their properties)
  // for admin we use useAdminProperties (all properties)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const agentPropsResult = !isAdmin
    ? useAgentProperties()
    : { properties: [], isLoading: false };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const adminPropsResult = isAdmin
    ? useAdminProperties()
    : { properties: [], isLoading: false };
  const { users, isLoading: usersLoading } = useUsers();

  const [error, setError] = useState<string | null>(null);

  const properties = isAdmin
    ? adminPropsResult.properties || []
    : agentPropsResult.properties || [];
  const agentPropsLoading = isAdmin
    ? adminPropsResult.isLoading
    : agentPropsResult.isLoading;

  const handleSubmit = async (
    data:
      | CreateTaskByAgentDto
      | CreateTaskByAdminDto
      | UpdateTaskByAgentDto
      | UpdateTaskByAdminDto
  ) => {
    setError(null);
    try {
      if (user.role === "superadmin") {
        await taskService.createForAdmin(data as CreateTaskByAdminDto);
      } else {
        await taskService.createForAgent(data as CreateTaskByAgentDto);
      }

      router.push("/dashboard/tasks");
    } catch (err: unknown) {
      const e = err as Error;
      setError((e && e.message) || "Error al crear la tarea");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/tasks");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              href="/dashboard/tasks"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Tareas
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">Crear</span>
          </nav>

          {/* Título */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <CheckSquare className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isAdmin ? "Crear Nueva Tarea" : "Agregar Tarea"}
              </h1>
              <p className="text-gray-300 text-lg">
                {isAdmin
                  ? "Crea y asigna tareas a cualquier agente"
                  : "Agrega una nueva tarea a tu lista"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Card del formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header de la card */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Información de la Tarea
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Completa todos los campos requeridos
                </p>
              </div>
            </div>
          </div>

          {/* Contenido de la card */}
          <div className="px-8 py-8">
            {/* Error global */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Error al crear tarea
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Loading */}
            {agentPropsLoading || usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">Cargando datos...</span>
              </div>
            ) : (
              <TaskForm
                initial={{}}
                properties={properties.map((p: Property) => ({
                  id: p.id,
                  title: p.title,
                  ownerId: p.ownerId,
                }))}
                agents={users.map((u) => ({ id: u.id, name: u.name }))}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isAdmin={user.role === "superadmin"}
                isEdit={false}
              />
            )}
          </div>
        </div>

        {/* Tips de ayuda */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              i
            </div>
            Consejos para crear una buena tarea
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Título claro:</strong> Usa un título descriptivo y
                específico
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Descripción detallada:</strong> Explica qué debe hacerse
                y cómo
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Fecha límite:</strong> Establece un plazo realista para
                completarla
              </span>
            </li>
            {isAdmin && (
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  <strong>Asignación:</strong> Asigna al agente más adecuado
                  para la tarea
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
