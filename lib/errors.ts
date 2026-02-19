import { ZodError } from "zod";
import axios, { AxiosError } from "axios";

// Modelo de errores que podrian venir del backend de Laravel

interface LaravelError {
  message?: string;
  errors?: Record<string, string[]>;
  success?: boolean;
  code?: string;
}

export function parseApiError(error: unknown): string {
  // Errores de Zod (validación de formularios)
  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return firstError?.message ?? "Error de validación";
  }

  // Errores de axios
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<LaravelError>;

    if (axiosError.response?.data) {
      const data = axiosError.response.data;

      // Errores de Laravel
      if (data.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        return firstError ?? "Error de validación";
      }

      // Mensaje directo
      if (data.message) {
        return data.message;
      }
    }

    // Errores HTTP
    switch (axiosError.response?.status) {
      case 400:
        return "Solicitud inválida";
      case 401:
        return "No autenticado";
      case 403:
        return "No autorizado";
      case 404:
        return "Recurso no encontrado";
      case 422:
        return "Datos inválidos";
      case 500:
        return "Error interno del servidor";
      default:
        break;
    }

    if (axiosError.code === "ECONNABORTED") {
      return "Tiempo de espera agotado";
    }

    if (axiosError.code === "ERR_NETWORK") {
      return "Error de red";
    }

    return "Error inesperado en la comunicación con el servidor";
  }

  // Errores genéricos
  if (error instanceof Error) {
    return error.message;
  }

  return "Error inesperado del servidor";
}
