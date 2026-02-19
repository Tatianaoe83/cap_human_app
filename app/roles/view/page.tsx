"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoles } from "@/hooks/useRoles";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, ShieldCheck, Calendar, Hash } from "lucide-react";
import type { Role } from "@/types/role.types";

export default function RoleViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { getRole } = useRoles();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push("/roles");
      return;
    }
    loadRole();
  }, [id]);

  const loadRole = async () => {
    const roleId = Number(id);
    if (isNaN(roleId)) {
      router.push("/roles");
      return;
    }

    setLoading(true);
    const data = await getRole(roleId);
    if (data) {
      setRole(data);
    } else {
      router.push("/roles");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Detalles del Rol</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          <PageTransition>
            <div className="mx-auto w-full max-w-4xl">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/roles")}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Roles
                </Button>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {role.name}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Información completa del rol y sus permisos
                    </p>
                  </div>
                  <Button onClick={() => router.push(`/roles/edit?id=${role.id}`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Rol
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Información Básica */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Rol</CardTitle>
                    <CardDescription>
                      Datos generales del rol en el sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Hash className="h-4 w-4" />
                          ID del Rol
                        </div>
                        <Badge variant="outline" className="font-mono text-base">
                          #{role.id}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Fecha de Creación
                        </div>
                        <p className="text-base font-medium">
                          {new Date(role.created_at).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Nombre del Rol
                      </div>
                      <p className="text-2xl font-semibold">{role.name}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Permisos Asignados */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Permisos Asignados
                    </CardTitle>
                    <CardDescription>
                      Lista de todos los permisos que tiene este rol
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!role.permissions || role.permissions.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Sin permisos asignados</p>
                        <p className="text-sm mt-2">
                          Este rol no tiene ningún permiso configurado
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => router.push(`/roles/edit?id=${role.id}`)}
                        >
                          Asignar Permisos
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {role.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3 p-3 rounded-lg border bg-accent/50"
                            >
                              <ShieldCheck className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">
                                {permission.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {role.permissions.length}
                            </span>{" "}
                            {role.permissions.length === 1
                              ? "permiso asignado"
                              : "permisos asignados"}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </PageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
