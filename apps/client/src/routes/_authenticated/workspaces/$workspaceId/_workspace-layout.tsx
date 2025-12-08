import { Outlet, createFileRoute } from "@tanstack/react-router";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_workspace-layout",
)({
  component: RouteComponent,
});

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
