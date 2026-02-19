"use client";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import type { AuthUser } from "@/types/auth.types";

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Cargar datos del usuario desde cookies para mostrar en el sidebar
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return user;
}
