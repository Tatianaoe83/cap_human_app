"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoles } from "@/hooks/useRoles";
import { usePermission } from "@/hooks/usePermission";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Save, ShieldCheck, AlertCircle } from "lucide-react";
import type { Role } from "@/types/role.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Permission } from "@/types/permission.types";

export default function EditRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { getRole, updateRole, syncPermissions } = useRoles();
  const { permissions, fetchPermissions } = usePermission();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.push("/roles");
      return;
    }
    loadData();
  }, [id]);

  const loadData = async () => {
    const roleId = Number(id);
    if (isNaN(roleId)) {
      router.push("/roles");
      return;
    }

    setLoading(true);
    try {
      // Cargar rol y permisos en paralelo
      const [roleData] = await Promise.all([
        getRole(roleId),
        fetchPermissions(),
      ]);

      if (roleData) {
        setRole(roleData);
        setName(roleData.name);
        // Precargar permisos seleccionados
        if (roleData.permissions) {
          setSelectedPermissions(roleData.permissions.map((p) => p.name));
        }
      } else {
        router.push("/roles");
      }
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((p) => p.name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("El nombre del rol es requerido");
      return;
    }

    if (name.trim().length < 3) {
      setValidationError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!role) return;

    setSaving(true);

    const updateResult = await updateRole(role.id, {
      name: name.trim(),
      permissions: selectedPermissions
    });

    setSaving(false);

    if (updateResult.success) {
      router.push("/roles");
    } else {
      setValidationError(updateResult.message || "Error al actualizar el rol");
    }
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
          <h1 className="text-lg font-semibold">Editar Rol</h1>
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
                <h2 className="text-3xl font-bold tracking-tight">
                  Editar Rol: {role.name}
                </h2>
                <p className="text-muted-foreground mt-2">
                  Actualiza el nombre del rol y modifica los permisos asignados
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {validationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Información Básica */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Rol</CardTitle>
                    <CardDescription>
                      Actualiza el nombre que identifica este rol en el sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nombre del Rol
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setValidationError(null);
                        }}
                        placeholder="Ej: Administrador, Editor, Moderador"
                        className="max-w-md"
                        disabled={saving}
                        autoFocus
                      />
                      <p className="text-sm text-muted-foreground">
                        Mínimo 3 caracteres
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Permisos */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5" />
                          Permisos del Rol
                        </CardTitle>
                        <CardDescription>
                          Modifica los permisos asignados a este rol
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={saving}
                      >
                        {selectedPermissions.length === permissions.length
                          ? "Deseleccionar Todo"
                          : "Seleccionar Todo"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {permissions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No hay permisos disponibles
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={selectedPermissions.includes(permission.name)}
                              onCheckedChange={() =>
                                handlePermissionToggle(permission.name)
                              }
                              disabled={saving}
                            />
                            <Label
                              htmlFor={`permission-${permission.id}`}
                              className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">
                          {selectedPermissions.length}
                        </span>{" "}
                        de {permissions.length} permisos seleccionados
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/roles")}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </div>
          </PageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
