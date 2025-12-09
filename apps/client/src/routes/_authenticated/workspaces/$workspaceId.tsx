import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { graphql } from "@/gql";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumbs } from "@/components/breadcrumbs";

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
`);

export const Route = createFileRoute("/_authenticated/workspaces/$workspaceId")(
  {
    component: RouteComponent,
    beforeLoad: async ({
      context: { apolloClient },
      params: { workspaceId },
    }) => {
      try {
        const { data } = await apolloClient.query({
          query: GET_CURRENT_WORKSPACE_QUERY,
          variables: { id: workspaceId },
        });

        if (data?.workspace) {
          return { workspace: data.workspace };
        }
      } catch {}

      throw redirect({
        to: "/workspaces",
      });
    },
  },
);

function RouteComponent() {
  return (
    <SidebarProvider>
      <WorkspaceSidebar />

      <SidebarInset>
        <header className="bg-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] duration-200 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:left-(--sidebar-width) md:group-has-data-[collapsible=icon]/sidebar-wrapper:left-(--sidebar-width-icon)">
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
  );
}
