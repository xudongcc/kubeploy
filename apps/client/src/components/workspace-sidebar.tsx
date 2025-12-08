import { Folder, Server, Settings, Users } from "lucide-react";

import { linkOptions, useRouteContext } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import type { ComponentProps, ComponentType, FC } from "react";
import { SidebarUser } from "@/components/sidebar-user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Link } from "@/components/link";
import { SidebarLogo } from "./sidebar-logo";
import { t } from "i18next";

type SidebarItem = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  link: LinkProps;
};

export const WorkspaceSidebar: FC<ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  const workspace = useRouteContext({
    from: "/_authenticated/workspaces/$workspaceId",
    select: (context) => context.workspace,
  });

  const sidebarGroups: Array<{
    title: string;
    items: Array<SidebarItem>;
  }> = [
    {
      title: t("sidebar.platform"),
      items: [
        {
          title: t("sidebar.projects"),
          icon: Folder,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects",
            params: { workspaceId: workspace.id },
          }),
        },
        {
          title: t("sidebar.clusters"),
          icon: Server,
          link: linkOptions({
            to: "/workspaces/$workspaceId/clusters",
            params: { workspaceId: workspace.id },
          }),
        },
      ],
    },
    {
      title: t("sidebar.settings"),
      items: [
        {
          title: t("sidebar.members"),
          icon: Users,
          link: linkOptions({
            to: "/workspaces/$workspaceId/members",
            params: { workspaceId: workspace.id },
          }),
        },
        {
          title: t("sidebar.settings"),
          icon: Settings,
          link: linkOptions({
            to: "/workspaces/$workspaceId/settings",
            params: { workspaceId: workspace.id },
          }),
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
        <WorkspaceSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link {...item.link}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
