"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseApiError } from "@/lib/errors";
import { authService } from "@/services/auth.service";
import type { LoginFormValues } from "@/lib/validators/loginValidator/validators";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (values: LoginFormValues) => {
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(values.email, values.password);

      if (res.success) {
        // Ir al dashboard después del loguearse exitosamente
        router.push("/dashboard");
      } else {
        setError(res.message || "Error al iniciar sesión");
      }
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      // Ir a login después de cerrar sesión
      router.push("/");
    } catch (error) {
      console.error("Error en logout:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return { login, logout, loading, error };
}
