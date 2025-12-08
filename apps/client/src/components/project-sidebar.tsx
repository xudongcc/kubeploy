import { Folder, Server, Settings, Users } from "lucide-react";

import { linkOptions, useRouteContext } from "@tanstack/react-router";
import { SidebarLogo } from "./sidebar-logo";
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

type SidebarItem = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  link: LinkProps;
};

export const ProjectSidebar: FC<ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  const workspace = useRouteContext({
    from: "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId",
    select: (context) => context.workspace,
  });

  const project = useRouteContext({
    from: "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId",
    select: (context) => context.project,
  });

  const sidebarGroups: Array<{
    title: string;
    items: Array<SidebarItem>;
  }> = [
    {
      title: "Project",
      items: [
        {
          title: "Services",
          icon: Server,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services",
            params: { workspaceId: workspace.id, projectId: project.id },
          }),
        },
        {
          title: "Settings",
          icon: Settings,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/settings",
            params: { workspaceId: workspace.id, projectId: project.id },
          }),
        },
      ],
    },
    {
      title: "Platform",
      items: [
        {
          title: "Projects",
          icon: Folder,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects",
            params: { workspaceId: workspace.id },
            activeOptions: { exact: true },
          }),
        },
        {
          title: "Clusters",
          icon: Server,
          link: linkOptions({
            to: "/workspaces/$workspaceId/clusters",
            params: { workspaceId: workspace.id },
          }),
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Members",
          icon: Users,
          link: linkOptions({
            to: "/workspaces/$workspaceId/members",
            params: { workspaceId: workspace.id },
          }),
        },
        {
          title: "Settings",
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
    <Sidebar collapsible="icon" className="z-11" {...props}>
      <SidebarLogo />

      <SidebarHeader>
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
