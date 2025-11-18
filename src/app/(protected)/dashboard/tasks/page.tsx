"use client";

import React from "react";
import Link from "next/link";
import { Plus, ListTodo, AlertCircle } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { TaskList } from "@/features/tasks/components";
import { useAgentTasks, useAdminTasks } from "@/features/tasks/hooks";
import { taskService } from "@/features/tasks/services";
import type {
  Task,
  UpdateTaskByAgentDto,
  UpdateTaskByAdminDto,
} from "@/features/tasks/types";
import {
  useAgentProperties,
  useAdminProperties,
} from "@/features/properties/hooks";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { User } from "@/features/users/types";

export default function DashboardTasksPage() {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "superadmin";

  // Llamar hooks condicionalmente según el rol
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const adminResult = isAdmin
    ? useAdminTasks()
    : { tasks: [], isLoading: false, error: null, refetch: () => {} };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const agentResult = !isAdmin
    ? useAgentTasks()
    : { tasks: [], isLoading: false, error: null, refetch: () => {} };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const adminProps = isAdmin
    ? useAdminProperties()
    : { properties: [], isLoading: false, error: null };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const agentProps = !isAdmin
    ? useAgentProperties()
    : { properties: [], isLoading: false, error: null };
  const usersResult = useUsers();

  const result = isAdmin ? adminResult : agentResult;
  const { tasks, isLoading, error } = result;

  // Construir mapa de propiedades para mostrar título en lugar de id
  const allProperties = isAdmin
    ? adminProps.properties || []
    : agentProps.properties || [];
  const propertyMap = new Map<string, string>();
  allProperties.forEach((p) => propertyMap.set(p.id, p.title));

  // Construir mapa de usuarios para mostrar nombre del asignado
  const userMap = new Map<string, string>();
  (usersResult.users || []).forEach((u: User) =>
    userMap.set(u.id, u.name || u.email || u.id)
  );

  // Toggle status handler (quick action)
  const toggleStatus = async (id: string, currentCompleted: boolean) => {
    try {
      if (user.role === "superadmin") {
        await taskService.updateForAdmin(id, {
          isCompleted: !currentCompleted,
        } as UpdateTaskByAdminDto);
        adminResult.refetch();
      } else {
        await taskService.updateForAgent(id, {
          isCompleted: !currentCompleted,
        } as UpdateTaskByAgentDto);
        agentResult.refetch();
      }
    } catch (err) {
      // swallow or show toast in future
      console.error("Error toggling task status", err);
    }
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
            <span className="text-white font-medium">Tareas</span>
          </nav>

          {/* Título y botón */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <ListTodo className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Mis Tareas</h1>
                <p className="text-gray-300 text-lg">
                  {isAdmin
                    ? "Gestiona todas las tareas del sistema"
                    : "Administra tus tareas asignadas"}
                </p>
              </div>
            </div>

            <Link href="/dashboard/tasks/create">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg shadow-lg transition-all duration-200 font-semibold hover:shadow-xl">
                <Plus size={20} />
                Nueva Tarea
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Cargando tareas...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Error al cargar tareas
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <TaskList
            tasks={tasks}
            propertyMap={propertyMap}
            userMap={userMap}
            onToggleStatus={toggleStatus}
          />
        )}
      </div>
    </div>
  );
}
