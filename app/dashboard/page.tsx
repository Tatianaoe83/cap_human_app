"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/ui/page-transition";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <PageTransition>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Users
              </h3>
              <p className="mt-2 text-3xl font-bold">1,234</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Active Sessions
              </h3>
              <p className="mt-2 text-3xl font-bold">543</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Roles
              </h3>
              <p className="mt-2 text-3xl font-bold">12</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                Permissions
              </h3>
              <p className="mt-2 text-3xl font-bold">48</p>
            </div>
          </div>
          </PageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
