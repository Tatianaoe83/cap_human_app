"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function Main() {
  const { login, loading, error } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        <LoginForm onSubmit={login} loading={loading} error={error} />
      </div>
    </div>
  );
}
