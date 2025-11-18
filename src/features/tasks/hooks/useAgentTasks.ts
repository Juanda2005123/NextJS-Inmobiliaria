"use client";

import { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import type { TaskListResponseDto } from "../types";
import type { ApiError } from "@/shared/types/common";

export function useAgentTasks() {
  const [tasks, setTasks] = useState<TaskListResponseDto["tasks"]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getForAgent();
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Error al cargar tareas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { tasks, total, isLoading, error, refetch: fetch };
}
