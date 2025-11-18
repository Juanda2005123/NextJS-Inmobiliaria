"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "../services/taskService";
import type { Task, UpdateTaskByAgentDto } from "../types";
import type { ApiError } from "@/shared/types/common";

export function useAgentTaskDetail(taskId: string) {
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<UpdateTaskByAgentDto>({
    title: "",
    description: "",
    dueDate: null,
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await taskService.getForAgentById(taskId);
        setTask(data);
        setFormData({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate ?? null,
          status: data.status,
        });
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Error al cargar la tarea");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [taskId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const parsed = name === "dueDate" ? value || null : value;
    setFormData((prev) => ({ ...prev, [name]: parsed }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (formData.title && formData.title.trim().length === 0) {
      errors.title = "El título es requerido";
    }

    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join(", "));
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    if (!task) {
      setError("Tarea no cargada");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await taskService.updateForAgent(taskId, formData);
      setTask(updated);
      setIsSaving(false);
      return updated;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Error al actualizar la tarea");
      setIsSaving(false);
      return null;
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await taskService.removeForAgent(taskId);
      router.push("/dashboard/tasks");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Error al eliminar la tarea");
      setIsDeleting(false);
    }
  };

  return {
    task,
    formData,
    isLoading,
    isSaving,
    isDeleting,
    error,
    handleChange,
    handleSubmit,
    handleDelete,
    setFormData,
  };
}
