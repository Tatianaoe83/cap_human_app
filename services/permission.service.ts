import { http } from "./http";

import type { permissionResponse } from "@/types/permission.types";

export const permissionService = {
  async getPermissions(): Promise<permissionResponse> {
    const { data } = await http.get<permissionResponse>("/permissions");
    return data;
  }
};