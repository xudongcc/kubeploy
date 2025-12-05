import { WorkspaceSidebar } from '@/components/workspace-sidebar'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { graphql } from '@/gql'
import { Separator } from '@/components/ui/separator'
import { Breadcrumbs } from '@/components/breadcrumbs'

const GET_CURRENT_WORKSPACE_QUERY = graphql(`
  query GetCurrentWorkspace($id: ID!) {
    workspace(id: $id) {
      id
      ...CurrentWorkspace @unmask
    }
  }

  fragment CurrentWorkspace on Workspace {
    id
    name
  }
`)

export const Route = createFileRoute('/_authenticated/workspaces/$workspaceId')(
  {
    component: RouteComponent,
    beforeLoad: async ({
      context: { apolloClient },
      params: { workspaceId },
    }) => {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_WORKSPACE_QUERY,
        variables: { id: workspaceId },
      })

      if (!data?.workspace) {
        throw redirect({
          to: '/auth/login',
        })
      }

      return { workspace: data.workspace }
    },
  },
)

function RouteComponent() {
  return (
    <SidebarProvider>
      <WorkspaceSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <Breadcrumbs />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
