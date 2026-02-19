import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Función para combinar clases de Tailwind de forma eficiente, evitando duplicados y conflictos

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
