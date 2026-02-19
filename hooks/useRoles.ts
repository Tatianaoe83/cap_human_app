"use client";

import { useState, useCallback } from "react";
import { roleService } from "@/services/role.service";
import { parseApiError } from "@/lib/errors";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  SyncPermissionsResponse,
} from "@/types/role.types";

interface OperationResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtiene la lista de todos los roles con sus permisos
  const fetchRoles = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await roleService.getRoles();
      setRoles(response);
    } catch (err) {
      const errorMessage = parseApiError(err);
      setError(errorMessage);
      console.error("Error fetching roles:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  //Obtiene un rol específico por ID con sus permisos
  const getRole = useCallback(
    async (id: number): Promise<Role | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await roleService.getRoleByID(id);
        return response;
      } catch (err) {
        const errorMessage = parseApiError(err);
        setError(errorMessage);
        console.error(`Error fetching role ${id}:`, errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Crea un nuevo rol
  const createRole = useCallback(
    async (roleData: CreateRoleRequest): Promise<OperationResult> => {
      setLoading(true);
      setError(null);
      try {
        const response = await roleService.createRole(roleData);
        await fetchRoles();
        return {
          success: true,
          message: "Rol creado correctamente",
        };
      } catch (err: any) {
        const errorMessage = parseApiError(err);
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: err?.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [fetchRoles]
  );

  //Actualiza un rol existente
  const updateRole = useCallback(
    async (
      id: number,
      roleData: UpdateRoleRequest
    ): Promise<OperationResult> => {
      setLoading(true);
      setError(null);
      try {
        await roleService.updateRole(id, roleData);
        await fetchRoles();
        return {
          success: true,
          message: "Rol actualizado correctamente",
        };
      } catch (err: any) {
        const errorMessage = parseApiError(err);
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: err?.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [fetchRoles]
  );

  //Elimina un rol
  const deleteRole = useCallback(
    async (id: number): Promise<OperationResult> => {
      setLoading(true);
      setError(null);
      try {
        await roleService.deleteRole(id);
        await fetchRoles();
        return {
          success: true,
          message: "Rol eliminado correctamente",
        };
      } catch (err: any) {
        const errorMessage = parseApiError(err);
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: err?.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [fetchRoles]
  );

  // Sincroniza los permisos de un rol
  const syncPermissions = useCallback(
    async (
      roleId: number,
      permissions: string[]
    ): Promise<OperationResult> => {
      setLoading(true);
      setError(null);
      try {
        await roleService.syncPermissions(roleId, permissions);
        await fetchRoles();
        return {
          success: true,
          message: "Permisos actualizados correctamente",
        };
      } catch (err: any) {
        const errorMessage = parseApiError(err);
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: err?.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [fetchRoles]
  );

  // Limpia el estado de error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Busca un rol por nombre (útil para filtros)
  const findRoleByName = useCallback(
    (name: string): Role | undefined => {
      return roles.find(
        (role) => role.name.toLowerCase() === name.toLowerCase()
      );
    },
    [roles]
  );

  // Obtiene roles que contienen un permiso específico
  const getRolesWithPermission = useCallback(
    (permissionName: string): Role[] => {
      return roles.filter((role) =>
        role.permissions?.some((p) => p.name === permissionName)
      );
    },
    [roles]
  );

  return {
    roles,
    loading,
    error,

    fetchRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
    syncPermissions,

    clearError,
    findRoleByName,
    getRolesWithPermission,
  };
}
