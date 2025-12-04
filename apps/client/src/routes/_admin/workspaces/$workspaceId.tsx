import { WorkspaceSidebar } from '@/components/workspace-sidebar'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/workspaces/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId } = Route.useParams()

  return (
    <SidebarProvider>
      <WorkspaceSidebar workspaceId={workspaceId} />

      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
