"use client";

import { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import type { TaskListResponseDto } from "../types";
import type { ApiError } from "@/shared/types/common";

export function useAgentTasksByProperty(propertyId?: string) {
  const [tasks, setTasks] = useState<TaskListResponseDto["tasks"]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!propertyId) {
        setTasks([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await taskService.listByPropertyForAgent(propertyId);
        setTasks(data.tasks);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Error al cargar tareas de la propiedad");
        setTasks([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [propertyId]);

  return { tasks, total, isLoading, error };
}
