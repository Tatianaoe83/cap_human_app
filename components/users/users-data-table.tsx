"use client";

import { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { DataTable } from "@/components/ui/data-table";
import { createUserColumns } from "@/components/users/user-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Trash2, Mail, Calendar, User as UserIcon, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  createUserSchema,
  updateUserSchema,
} from "@/lib/validators/usersValidator/userValidators";
import type { User } from "@/types/user.types";
import { ZodError } from "zod";

export function UsersDataTable() {
  const { users, loading, error, fetchUsers, deleteUser, updateUser, createUser } =
    useUsers();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para diálogos
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Estados para errores de validación
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Estados del formulario de edición
  const [editForm, setEditForm] = useState({
    name: "",
    password: "",
    password_confirmation: "",
  });

  // Estados del formulario de creación
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      password: "",
      password_confirmation: "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;

    // Limpiar errores previos
    setEditErrors({});
    setApiError(null);

    // Validación con Zod
    try {
      const validatedData = updateUserSchema.parse(editForm);

      setIsSaving(true);

      const updateData: any = { name: validatedData.name };
      if (validatedData.password) {
        updateData.password = validatedData.password;
        updateData.password_confirmation = validatedData.password_confirmation;
      }

      const result = await updateUser(selectedUser.id, updateData);
      setIsSaving(false);

      if (result.success) {
        setEditDialogOpen(false);
        setSelectedUser(null);
        console.log("Usuario actualizado exitosamente");
      } else {
        setApiError(result.message || "Error al actualizar el usuario");
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setEditErrors(fieldErrors);
      }
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    const result = await deleteUser(selectedUser.id);
    setIsDeleting(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      console.log(`Usuario "${selectedUser.name}" eliminado exitosamente`);
    } else {
      console.error(`Error al eliminar usuario: ${result.message}`);
    }
    setSelectedUser(null);
  };

  const handleCreate = () => {
    setCreateForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setCreateErrors({});
    setApiError(null);
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async () => {
    // Limpiar errores previos
    setCreateErrors({});
    setApiError(null);

    // Validación con Zod
    try {
      const validatedData = createUserSchema.parse(createForm);

      setIsSaving(true);
      const result = await createUser(validatedData);
      setIsSaving(false);

      if (result.success) {
        setCreateDialogOpen(false);
        setCreateForm({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
        console.log("Usuario creado exitosamente");
      } else {
        setApiError(result.message || "No se pudo crear el usuario");
        if (result.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field] = messages[0];
            }
          });
          setCreateErrors(fieldErrors);
        }
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setCreateErrors(fieldErrors);
      }
      setIsSaving(false);
    }
  };

  const columns = createUserColumns(handleView, handleEdit, handleDeleteClick);

  if (loading && users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
          </div>
        </div>
        <div className="space-y-3">
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-600 font-medium">Error al cargar usuarios</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <Button onClick={fetchUsers} className="mt-4" variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
            <p className="text-muted-foreground">
              Gestiona los usuarios del sistema
            </p>
          </div>
          <Button onClick={handleCreate} disabled={isDeleting}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          searchPlaceholder="Buscar por nombre..."
        />
      </div>

      {/* Dialog Ver Usuario - Mejorado */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Detalles del Usuario
            </DialogTitle>
            <DialogDescription>
              Información completa del usuario seleccionado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                ID
              </span>
              <Badge variant="secondary" className="font-mono">
                #{selectedUser?.id}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                Nombre Completo
              </div>
              <p className="text-base font-medium pl-6">{selectedUser?.name}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Correo Electrónico
              </div>
              <p className="text-base pl-6">{selectedUser?.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Fecha de Registro
              </div>
              <p className="text-base pl-6">
                {selectedUser &&
                  new Date(selectedUser.created_at).toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Editar Usuario */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualiza la información del usuario. Los campos vacíos no serán
              modificados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => {
                  setEditForm({ ...editForm, name: e.target.value });
                  if (editErrors.name) {
                    setEditErrors({ ...editErrors, name: "" });
                  }
                }}
                placeholder="Nombre del usuario"
                className={editErrors.name ? "border-red-500" : ""}
              />
              {editErrors.name && (
                <p className="text-sm text-red-500">{editErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">
                Nueva Contraseña (opcional)
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(e) => {
                  setEditForm({ ...editForm, password: e.target.value });
                  if (editErrors.password) {
                    setEditErrors({ ...editErrors, password: "" });
                  }
                }}
                placeholder="Dejar vacío para no cambiar"
                className={editErrors.password ? "border-red-500" : ""}
              />
              {editErrors.password ? (
                <p className="text-sm text-red-500">{editErrors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres
                </p>
              )}
            </div>
            {editForm.password && (
              <div className="space-y-2">
                <Label htmlFor="edit-password-confirm">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-password-confirm"
                  type="password"
                  value={editForm.password_confirmation}
                  onChange={(e) => {
                    setEditForm({
                      ...editForm,
                      password_confirmation: e.target.value,
                    });
                    if (editErrors.password_confirmation) {
                      setEditErrors({
                        ...editErrors,
                        password_confirmation: "",
                      });
                    }
                  }}
                  placeholder="Confirma la nueva contraseña"
                  className={
                    editErrors.password_confirmation ? "border-red-500" : ""
                  }
                />
                {editErrors.password_confirmation && (
                  <p className="text-sm text-red-500">
                    {editErrors.password_confirmation}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Crear Usuario */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear Nuevo Usuario
            </DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo usuario. Todos los campos son
              obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="create-name">
                Nombre Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) => {
                  setCreateForm({ ...createForm, name: e.target.value });
                  if (createErrors.name) {
                    setCreateErrors({ ...createErrors, name: "" });
                  }
                }}
                placeholder="Ej: Juan Pérez"
                className={createErrors.name ? "border-red-500" : ""}
              />
              {createErrors.name && (
                <p className="text-sm text-red-500">{createErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">
                Correo Electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => {
                  setCreateForm({ ...createForm, email: e.target.value });
                  if (createErrors.email) {
                    setCreateErrors({ ...createErrors, email: "" });
                  }
                }}
                placeholder="usuario@example.com"
                className={createErrors.email ? "border-red-500" : ""}
              />
              {createErrors.email && (
                <p className="text-sm text-red-500">{createErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => {
                  setCreateForm({ ...createForm, password: e.target.value });
                  if (createErrors.password) {
                    setCreateErrors({ ...createErrors, password: "" });
                  }
                }}
                placeholder="Mínimo 8 caracteres"
                className={createErrors.password ? "border-red-500" : ""}
              />
              {createErrors.password ? (
                <p className="text-sm text-red-500">{createErrors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  La contraseña debe tener al menos 8 caracteres
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password-confirm">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-password-confirm"
                type="password"
                value={createForm.password_confirmation}
                onChange={(e) => {
                  setCreateForm({
                    ...createForm,
                    password_confirmation: e.target.value,
                  });
                  if (createErrors.password_confirmation) {
                    setCreateErrors({
                      ...createErrors,
                      password_confirmation: "",
                    });
                  }
                }}
                placeholder="Repite la contraseña"
                className={
                  createErrors.password_confirmation ? "border-red-500" : ""
                }
              />
              {createErrors.password_confirmation && (
                <p className="text-sm text-red-500">
                  {createErrors.password_confirmation}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isSaving}>
              {isSaving ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Usuario */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              ¿Eliminar Usuario?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <br />
              <br />
              Esta acción no se puede deshacer y eliminará permanentemente todos
              los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
