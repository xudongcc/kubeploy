import {
  ChartLine,
  Code,
  FileText,
  Folder,
  Globe,
  HardDrive,
  LayoutDashboard,
  Server,
  Settings,
  Users,
} from "lucide-react";

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

export const ServiceSidebar: FC<ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  const workspace = useRouteContext({
    from: "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId",
    select: (context) => context.workspace,
  });

  const project = useRouteContext({
    from: "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId",
    select: (context) => context.project,
  });

  const service = useRouteContext({
    from: "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId",
    select: (context) => context.service,
  });

  const sidebarGroups: Array<{
    title: string;
    items: Array<SidebarItem>;
  }> = [
    {
      title: "Service",
      items: [
        {
          title: "Overview",
          icon: LayoutDashboard,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId",
            params: {
              workspaceId: workspace.id,
              projectId: project.id,
              serviceId: service.id,
            },
            activeOptions: { exact: true },
          }),
        },
        {
          title: "Environment",
          icon: Code,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/environment",
            params: {
              workspaceId: workspace.id,
              projectId: project.id,
              serviceId: service.id,
            },
          }),
        },
        {
          title: "Domains",
          icon: Globe,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/domains",
            params: {
              workspaceId: workspace.id,
              projectId: project.id,
              serviceId: service.id,
            },
          }),
        },
        {
          title: "Volumes",
          icon: HardDrive,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/volumes",
            params: {
              workspaceId: workspace.id,
              projectId: project.id,
              serviceId: service.id,
            },
          }),
        },
        {
          title: "Logs",
          icon: FileText,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/logs",
            params: {
              workspaceId: workspace.id,
              projectId: project.id,
              serviceId: service.id,
            },
          }),
        },
        {
          title: "Metrics",
          icon: ChartLine,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/metrics",
            params: {
              workspaceId: workspace.id,
              projectId: project.id,
              serviceId: service.id,
            },
          }),
        },
        {
          title: "Settings",
          icon: Settings,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/settings",
            params: {
              workspaceId: workspace.id,
              projectId: project.id,
              serviceId: service.id,
            },
          }),
        },
      ],
    },
    {
      title: "Project",
      items: [
        {
          title: "Services",
          icon: Server,
          link: linkOptions({
            to: "/workspaces/$workspaceId/projects/$projectId/services",
            params: { workspaceId: workspace.id, projectId: project.id },
            activeOptions: { exact: true },
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
    <Sidebar collapsible="icon" {...props}>
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
