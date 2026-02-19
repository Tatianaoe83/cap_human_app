"use client";

import * as React from "react";
import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Team = {
  name: string;
  plan: string;
  logoExpandedSrc: string;
  logoCollapsedSrc: string;
};

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { state, isMobile } = useSidebar();
  const [activeTeam] = React.useState(() => teams[0]);

  if (!activeTeam) return null;

  const isCollapsed = !isMobile && state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="text-sidebar-primary-foreground flex size-8 items-center justify-center overflow-hidden">
            <Image
              src={isCollapsed ? activeTeam.logoCollapsedSrc : activeTeam.logoExpandedSrc}
              alt={`Logo ${activeTeam.name}`}
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
