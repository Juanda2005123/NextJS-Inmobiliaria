"use client";

import { TaskCard } from "./TaskCard";
import type { Task } from "../types";

export function TaskList({
  tasks,
  propertyMap,
  userMap,
  onToggleStatus,
}: {
  tasks: Task[];
  propertyMap?: Map<string, string>;
  userMap?: Map<string, string>;
  onToggleStatus?: (id: string, newStatus: Task["status"]) => Promise<void>;
}) {
  if (!tasks || tasks.length === 0) {
    return <div>No hay tareas.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          propertyTitle={propertyMap?.get(t.propertyId)}
          assignedToName={t.assignedTo ? userMap?.get(t.assignedTo) : undefined}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
}
