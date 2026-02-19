import { http } from "./http";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UserDetailResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  ApiErrorResponse,
} from "@/types/user.types";

export const userService = {
  // Obtener lista de todos los usuarios
  async getUsers(): Promise<UsersListResponse> {
    const { data } = await http.get<UsersListResponse>("/users");
    return data;
  },

  // Obtener un usuario específico por ID
  async getUser(id: number): Promise<UserDetailResponse> {
    const { data } = await http.get<UserDetailResponse>(`/users/${id}`);
    return data;
  },

  // Crear un nuevo usuario
  async createUser(
    userData: CreateUserRequest
  ): Promise<CreateUserResponse | ApiErrorResponse> {
    try {
      const { data } = await http.post<CreateUserResponse>("/users", userData);
      return data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiErrorResponse;
      }
      throw error;
    }
  },

  // Actualizar un usuario existente
  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<UpdateUserResponse | ApiErrorResponse> {
    try {
      const { data } = await http.put<UpdateUserResponse>(
        `/users/${id}`,
        userData
      );
      return data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiErrorResponse;
      }
      throw error;
    }
  },

  // Eliminar un usuario
  async deleteUser(
    id: number
  ): Promise<DeleteUserResponse | ApiErrorResponse> {
    try {
      const { data } = await http.delete<DeleteUserResponse>(`/users/${id}`);
      return data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data as ApiErrorResponse;
      }
      throw error;
    }
  },
};
