import { Folder, Users, Settings, Server } from 'lucide-react'

import { SidebarUser } from '@/components/sidebar-user'
import { WorkspaceSwitcher } from '@/components/workspace-switcher'
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
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { FC } from 'react'

type SidebarItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

export interface WorkspaceSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  workspaceId: string
}

export const WorkspaceSidebar: FC<WorkspaceSidebarProps> = ({
  workspaceId,
  ...props
}) => {
  const sidebarGroups: Array<{
    title: string
    items: SidebarItem[]
  }> = [
    {
      title: 'Platform',
      items: [
        {
          title: 'Projects',
          url: `/workspaces/${workspaceId}/projects`,
          icon: Folder,
        },
        {
          title: 'Clusters',
          url: `/workspaces/${workspaceId}/clusters`,
          icon: Server,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Members',
          url: `/workspaces/${workspaceId}/members`,
          icon: Users,
        },
        {
          title: 'Settings',
          url: `/workspaces/${workspaceId}/settings`,
          icon: Settings,
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
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
                      <Link to={item.url}>
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
  )
}
