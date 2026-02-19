"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useUser } from "@/hooks/useUserLogged";

const data = {
  teams: [
    {
      name: "Proser",
      plan: "CapHuman",
      logoExpandedSrc: "/LogoAzul.png",
      logoCollapsedSrc: "/LogoAzul.png",
    },
  ],
  navMain: [
    { title: "Dashboard", url: "/dashboard" },
    { title: "Usuarios", url: "/users" },
    { title: "Roles", url: "/roles" },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

  const userData = {
    name: user?.name || "Usuario",
    email: user?.email || "correo@example.com",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
