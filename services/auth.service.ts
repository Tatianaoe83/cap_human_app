import Cookies from "js-cookie";
import { http } from "./http";
import type { LoginResponse } from "@/types/auth.types";

// Servicio de autenticación para manejar login, logout y estado de autenticación del usuario

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    // Guardar token y datos del usuario
    if (data.success && data.data.token) {
      Cookies.set("token", data.data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.data.user), { expires: 7 });
      Cookies.set("roles", JSON.stringify(data.data.roles), { expires: 7 });
    }

    return data;
  },

  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout en el backend
      await http.post("/auth/logout");
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      // Siempre eliminar cookies locales
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("roles");
    }
  },

  isAuthenticated(): boolean {
    const token = Cookies.get("token");
    return !!token;
  },

  getUser() {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        return JSON.parse(userCookie);
      } catch (error) {
        return null;
      }
    }
    return null;
  },
};
