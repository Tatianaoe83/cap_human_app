import { Permission } from "./permission.types";

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  permissions?: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name: string;
  permissions: string[];
}

export interface SyncPermissionsRequest {
  permissions: string[];
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export type RolesListResponse = Role[];

export type RoleDetailResponse = Role;

export interface CreateRoleResponse {
  message: string;
  role: Role;
}

export interface UpdateRoleResponse {
  message: string;
  role: Role;
}

export interface DeleteRoleResponse {
  message: string;
}

export interface SyncPermissionsResponse {
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

