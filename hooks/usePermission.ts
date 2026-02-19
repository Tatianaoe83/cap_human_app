"use client";

import { useState } from "react";
import { permissionService } from "@/services/permission.service";
import { parseApiError } from "@/lib/errors";
import type { Permission } from "@/types/permission.types";

export function usePermission() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionService.getPermissions();
      if (response.success) {
        setPermissions(response.data);
      } else {
        setError("Error al obtener los permisos");
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
  };
}