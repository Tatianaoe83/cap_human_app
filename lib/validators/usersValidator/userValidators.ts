import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(6, "El nombre debe tener al menos 6 caracteres")
      .max(255, "El nombre no puede exceder 255 caracteres"),
    email: z
      .email()
      .min(1, "El email es requerido")
      .max(255, "El email no puede exceder 255 caracteres"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(255, "El nombre no puede exceder 255 caracteres"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .optional()
      .or(z.literal("")),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Si se ingresó una contraseña, debe confirmarla
      if (data.password && data.password.length > 0) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"],
    }
  );

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
