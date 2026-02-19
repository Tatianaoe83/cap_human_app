
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

// Tipos para solicitudes de creación y actualización de usuario
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
  password_confirmation?: string;
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface UsersListResponse extends ApiResponse<User[]> {
  success: true;
  data: User[];
}

export interface UserDetailResponse extends ApiResponse<User> {
  success: true;
  data: User;
}

export interface CreateUserResponse extends ApiResponse<{ id: number }> {
  success: true;
  message: string;
  data: { id: number };
}

export interface UpdateUserResponse extends ApiResponse<{ id: number }> {
  success: true;
  message: string;
  data: { id: number };
}

export interface DeleteUserResponse extends ApiResponse {
  success: true;
  message: string;
}

// Error response type
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}


