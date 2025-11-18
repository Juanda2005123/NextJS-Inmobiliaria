"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { TaskForm } from "@/features/tasks/components";
import { taskService } from "@/features/tasks/services";
import { CheckSquare, ListTodo, AlertCircle, Loader2 } from "lucide-react";
import {
  useAgentProperties,
  useAdminProperties,
} from "@/features/properties/hooks";
import { useUsers } from "@/features/users/hooks/useUsers";
import type {
  Task,
  UpdateTaskByAgentDto,
  UpdateTaskByAdminDto,
} from "@/features/tasks/types";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const isAdmin = user.role === "superadmin";

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const agentPropsResult = !isAdmin ? useAgentProperties() : { properties: [] };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const adminPropsResult = isAdmin ? useAdminProperties() : { properties: [] };
  const { users } = useUsers();

  const properties = isAdmin
    ? adminPropsResult.properties || []
    : agentPropsResult.properties || [];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data =
          user?.role === "superadmin"
            ? await taskService.getForAdminById(taskId)
            : await taskService.getForAgentById(taskId);

        setTask(data as Task);
        setError(null);
      } catch (err: unknown) {
        const e = err as Error;
        setError((e && e.message) || "Error al cargar la tarea");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) load();
  }, [taskId, user?.role]);

  const handleSubmit = async (
    payload: UpdateTaskByAgentDto | UpdateTaskByAdminDto
  ) => {
    setError(null);
    try {
      if (user?.role === "superadmin") {
        await taskService.updateForAdmin(taskId, payload);
      } else {
        await taskService.updateForAgent(taskId, payload);
      }

      router.push("/dashboard/tasks");
    } catch (err: unknown) {
      const e = err as Error;
      setError((e && e.message) || "Error al guardar la tarea");
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
            <span className="text-white font-medium">Editar</span>
          </nav>

          {/* Título */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <CheckSquare className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Editar Tarea</h1>
              <p className="text-gray-300 text-lg">
                Modifica los detalles de la tarea
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
                  Actualiza los campos necesarios
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
                    Error al guardar tarea
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">Cargando tarea...</span>
              </div>
            ) : task ? (
              <TaskForm
                initial={{
                  ...task,
                  dueDate: task.dueDate ?? undefined,
                  assignedToId: task.assignedToId ?? undefined,
                }}
                properties={properties.map((p) => ({
                  id: p.id,
                  title: p.title,
                  ownerId: p.ownerId,
                }))}
                agents={users.map((u) => ({ id: u.id, name: u.name }))}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isAdmin={user.role === "superadmin"}
                isEdit={true}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
