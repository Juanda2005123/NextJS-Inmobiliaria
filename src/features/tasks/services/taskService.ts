import { apiClient } from "@/shared/lib/apiClient";
import type {
  CreateTaskByAgentDto,
  UpdateTaskByAgentDto,
  CreateTaskByAdminDto,
  UpdateTaskByAdminDto,
  TaskListResponseDto,
  TaskResponseDto,
} from "../types";

const TASKS_ENDPOINT = "/tasks";

export const taskService = {
  // AGENT
  async getForAgent(): Promise<TaskListResponseDto> {
    return apiClient.get<TaskListResponseDto>(`${TASKS_ENDPOINT}/agent`);
  },
  async createForAgent(data: CreateTaskByAgentDto): Promise<TaskResponseDto> {
    return apiClient.post<TaskResponseDto>(`${TASKS_ENDPOINT}/agent`, data);
  },
  async getForAgentById(id: string): Promise<TaskResponseDto> {
    return apiClient.get<TaskResponseDto>(`${TASKS_ENDPOINT}/agent/${id}`);
  },
  async listByPropertyForAgent(
    propertyId: string
  ): Promise<TaskListResponseDto> {
    return apiClient.get<TaskListResponseDto>(
      `${TASKS_ENDPOINT}/agent/property/${propertyId}`
    );
  },
  async updateForAgent(
    id: string,
    data: UpdateTaskByAgentDto
  ): Promise<TaskResponseDto> {
    return apiClient.put<TaskResponseDto>(
      `${TASKS_ENDPOINT}/agent/${id}`,
      data
    );
  },
  async removeForAgent(id: string): Promise<void> {
    return apiClient.delete(`${TASKS_ENDPOINT}/agent/${id}`);
  },

  // ADMIN
  async getForAdmin(): Promise<TaskListResponseDto> {
    return apiClient.get<TaskListResponseDto>(`${TASKS_ENDPOINT}/admin`);
  },
  async createForAdmin(data: CreateTaskByAdminDto): Promise<TaskResponseDto> {
    console.log("taskService.createForAdmin - Payload:", data);
    return apiClient.post<TaskResponseDto>(`${TASKS_ENDPOINT}/admin`, data);
  },
  async getForAdminById(id: string): Promise<TaskResponseDto> {
    return apiClient.get<TaskResponseDto>(`${TASKS_ENDPOINT}/admin/${id}`);
  },
  async listByPropertyForAdmin(
    propertyId: string
  ): Promise<TaskListResponseDto> {
    return apiClient.get<TaskListResponseDto>(
      `${TASKS_ENDPOINT}/admin/property/${propertyId}`
    );
  },
  async updateForAdmin(
    id: string,
    data: UpdateTaskByAdminDto
  ): Promise<TaskResponseDto> {
    console.log("taskService.updateForAdmin - ID:", id, "Payload:", data);
    return apiClient.put<TaskResponseDto>(
      `${TASKS_ENDPOINT}/admin/${id}`,
      data
    );
  },
  async removeForAdmin(id: string): Promise<void> {
    return apiClient.delete(`${TASKS_ENDPOINT}/admin/${id}`);
  },
};
