import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ProjectSidebar } from "@/components/project-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_project-layout",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <ProjectSidebar />

      <SidebarInset className="pt-16 group-has-data-[collapsible=icon]/sidebar-wrapper:pt-12">
        <header className="bg-background fixed top-0 right-0 left-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[left,right,width,height] transition-[width,height] duration-200 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:left-(--sidebar-width) md:group-has-data-[collapsible=icon]/sidebar-wrapper:left-(--sidebar-width-icon)">
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
