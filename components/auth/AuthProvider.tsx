"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const publicRoutes = ["/", "/login"];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthenticated = authService.isAuthenticated();

    // Si no está autenticado y la ruta no es pública
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/");
    }

    // Si está autenticado y está en una ruta pública
    if (isAuthenticated && isPublicRoute) {
      router.push("/dashboard");
    }

    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
