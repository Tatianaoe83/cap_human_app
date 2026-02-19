export type Permission = {
  id: number;
  name: string;
  created_at: string;
};

export type permissionResponse = {
    success: boolean;
    data: Permission[];
}