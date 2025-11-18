export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  propertyId: string;
  assignedToId?: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskByAgentDto {
  title: string;
  description?: string;
  dueDate?: string;
  propertyId: string; // debe pertenecer al agente
}

export interface CreateTaskByAdminDto {
  title: string;
  description?: string;
  dueDate?: string;
  propertyId: string;
  assignedToId?: string | null;
}

export interface UpdateTaskByAgentDto {
  title?: string;
  description?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
}

export interface UpdateTaskByAdminDto {
  title?: string;
  description?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
  assignedToId?: string | null;
}

export interface TaskListResponseDto {
  tasks: Task[];
  total: number;
}

export type TaskResponseDto = Task;
