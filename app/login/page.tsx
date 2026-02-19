"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Users } from "lucide-react";

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center gap-2.5 px-8 pt-8">
        <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
          <Users className="h-5 w-5 text-background" />
        </div>
        <span className="text-lg font-semibold text-foreground">Capital Humano</span>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              Bienvenido
            </h1>
            <p className="text-base text-muted-foreground">
              Inicia sesión en tu cuenta
            </p>
          </div>

          <div className="space-y-6">
            <LoginForm onSubmit={login} loading={loading} error={error} />
            
            <div className="text-center">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <div className="pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <button className="text-foreground hover:underline font-medium">
                Solicitar acceso
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
