"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoles } from "@/hooks/useRoles";
import { DataTable } from "@/components/ui/data-table";
import { createRoleColumns } from "@/components/roles/role-columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import type { Role } from "@/types/role.types";

export function RolesDataTable() {
  const router = useRouter();
  const { roles, loading, error, fetchRoles, deleteRole } = useRoles();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleView = (role: Role) => {
    router.push(`/roles/view?id=${role.id}`);
  };

  const handleEdit = (role: Role) => {
    router.push(`/roles/edit?id=${role.id}`);
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;

    setIsDeleting(true);
    const result = await deleteRole(selectedRole.id);
    setIsDeleting(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      console.log(`Rol "${selectedRole.name}" eliminado exitosamente`);
    } else {
      console.error(`Error al eliminar rol: ${result.message}`);
    }
    setSelectedRole(null);
  };

  const handleCreate = () => {
    router.push("/roles/create");
  };

  const columns = createRoleColumns(handleView, handleEdit, handleDeleteClick);

  if (loading && roles.length === 0) {
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
        <h3 className="text-lg font-semibold text-red-900">
          Error al cargar roles
        </h3>
        <p className="text-red-700 mt-2">{error}</p>
        <Button onClick={() => fetchRoles()} className="mt-4" variant="outline">
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
            <h2 className="text-2xl font-bold tracking-tight">
              Gestión de Roles
            </h2>
            <p className="text-muted-foreground">
              Administra los roles y permisos del sistema
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Rol
          </Button>
        </div>

        <DataTable columns={columns} data={roles} searchKey="name" />
      </div>

      {/* Dialog Eliminar Rol */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El rol{" "}
              <span className="font-semibold">{selectedRole?.name}</span> será
              eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
