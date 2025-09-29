import { IconContrast2Filled } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { navItems } from "@/lib/constants";
import { NavMain } from "@/modules/global-layout/nav-main";
import { NavUser } from "@/modules/global-layout/nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { email, name, image } = useUser();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconContrast2Filled className="!size-6" />
                <span className="text-base font-semibold">Drift</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email,
            name,
            avatar: image,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
