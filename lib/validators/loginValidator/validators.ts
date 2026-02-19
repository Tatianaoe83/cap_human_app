import { z } from "zod";

// Validación del forms del login usando Zod

export const loginSchema = z.object({
  email: z.email().min(1, "El correo es requerido"),
  password: z.string().min(1, "La contraseña es requerida").min(8, "Mínimo 8 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
