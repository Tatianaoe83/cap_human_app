import { http } from "./http";

import type {
  CreateRoleRequest,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  RoleDetailResponse,
  RolesListResponse,
  UpdateRoleRequest,
} from "@/types/role.types";

export const roleService = {
  async getRoles(): Promise<RolesListResponse> {
    const { data } = await http.get<RolesListResponse>("/roles");
    return data;
  },

  async getRoleByID(id: number): Promise<RoleDetailResponse> {
    const { data } = await http.get(`/roles/${id}`);
    return data;
  },

  async createRole(roleData: CreateRoleRequest): Promise<CreateRoleResponse> {
    const { data } = await http.post<CreateRoleResponse>("/roles", roleData);
    return data;
  },

  async updateRole(
    id: number,
    roleData: UpdateRoleRequest,
  ): Promise<UpdateRoleResponse> {
    const { data } = await http.put<UpdateRoleResponse>(
      `/roles/${id}`,
      roleData,
    );
    return data;
  },

  async deleteRole(id: number): Promise<DeleteRoleResponse> {
    const { data } = await http.delete<DeleteRoleResponse>(`/roles/${id}`);
    return data;
  },

  async syncPermissions(roleId: number, permissions: string[]): Promise<void> {
    const role = await this.getRoleByID(roleId);
    await this.updateRole(roleId, {
      name: role.name,
      permissions
    });
  },
};
