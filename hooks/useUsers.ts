"use client";

import { useState } from "react";
import { userService } from "@/services/user.service";
import { parseApiError } from "@/lib/errors";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user.types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError("Error al cargar usuarios");
      }
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUser(id);
      if (response.success) {
        return response.data;
      } else {
        setError("Usuario no encontrado");
        return null;
      }
    } catch (e) {
      setError(parseApiError(e));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.createUser(userData);
      if (response.success) {
        await fetchUsers();
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || "Error al crear usuario";
        setError(errorMsg);
        return { success: false, message: errorMsg, errors: response.errors };
      }
    } catch (e) {
      const errorMsg = parseApiError(e);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.updateUser(id, userData);
      if (response.success) {
        await fetchUsers();
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || "Error al actualizar usuario";
        setError(errorMsg);
        return { success: false, message: errorMsg, errors: response.errors };
      }
    } catch (e) {
      const errorMsg = parseApiError(e);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.deleteUser(id);
      if (response.success) {
        await fetchUsers();
        return { success: true, message: response.message };
      } else {
        const errorMsg = response.message || "Error al eliminar usuario";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (e) {
      const errorMsg = parseApiError(e);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
}
