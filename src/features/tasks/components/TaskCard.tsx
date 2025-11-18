"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardBody, Button } from "@/shared/components/ui";
import { Check, RotateCw } from "lucide-react";
import type { Task } from "../types";

export function TaskCard({
  task,
  propertyTitle,
  assignedToName,
  onToggleStatus,
}: {
  task: Task;
  propertyTitle?: string;
  assignedToName?: string;
  onToggleStatus?: (id: string, currentCompleted: boolean) => Promise<void>;
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (!onToggleStatus) return;
    try {
      setIsToggling(true);
      await onToggleStatus(task.id, task.isCompleted);
    } finally {
      setIsToggling(false);
    }
  };

  const isDone = task.isCompleted;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardBody>
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {task.title}
            </h3>
            <div className="space-y-1">
              {task.description && (
                <p className="text-sm text-gray-700 mb-2">{task.description}</p>
              )}
              {task.dueDate && (
                <p className="text-sm font-medium text-gray-900">
                  📅 Vence: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm font-medium text-gray-900">
                {task.isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    ✓ Completada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    ⏳ Pendiente
                  </span>
                )}
              </p>
              <p className="text-sm font-medium text-gray-900">
                🏠 {propertyTitle ?? task.propertyId}
              </p>
              {assignedToName && (
                <p className="text-sm font-medium text-gray-900">
                  👤 Asignado a: {assignedToName}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Link
              href={`/dashboard/tasks/${task.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Ver detalles →
            </Link>

            {onToggleStatus && (
              <Button
                size="sm"
                variant={isDone ? "secondary" : "success"}
                leftIcon={isDone ? <RotateCw size={16} /> : <Check size={16} />}
                isLoading={isToggling}
                onClick={handleToggle}
                aria-pressed={isDone}
                aria-label={
                  isDone ? "Marcar como pendiente" : "Marcar como completada"
                }
                className="whitespace-nowrap"
              >
                {isDone ? "Reabrir" : "Completar"}
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
