"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/validators/loginValidator/validators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

interface Props {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function LoginForm({ onSubmit, loading, error }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold text-neutral-700">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@empresa.com"
          className="h-10 rounded-lg border-neutral-300 bg-neutral-50 px-4 text-sm transition-all placeholder:text-neutral-400 hover:border-neutral-400 focus-visible:border-neutral-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900/20"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-semibold text-neutral-700">
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            className="h-10 rounded-lg border-neutral-300 bg-neutral-50 px-4 pr-10 text-sm transition-all placeholder:text-neutral-400 hover:border-neutral-400 focus-visible:border-neutral-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-900"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <label className="inline-flex cursor-pointer items-center gap-2 text-neutral-600 transition-colors hover:text-neutral-900">
          <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border-neutral-300 bg-white transition-all checked:bg-neutral-900 checked:border-neutral-900" />
          <span className="font-medium">Recuérdame</span>
        </label>
        <a href="#" className="font-medium text-neutral-900 transition-colors hover:text-neutral-700 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Button
        type="submit"
        className="group h-10 w-full rounded-lg bg-neutral-900 text-sm font-semibold text-white shadow-lg shadow-neutral-900/25 transition-all hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/30 active:scale-[0.98]"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          <>
            Iniciar sesión
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}
