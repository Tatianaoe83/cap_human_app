"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 10);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        mounted
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4"
      }`}
    >
      {children}
    </div>
  );
}
