import {
  Outlet,
  createFileRoute,
  linkOptions,
  redirect,
} from "@tanstack/react-router";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { graphql } from "@/gql";
import { NavTabs } from "@/components/nav-tabs";
import { useMemo } from "react";

const GET_SERVICE_QUERY = graphql(`
  query GetService($id: ID!) {
    service(id: $id) {
      id

      project {
        id
        name
      }

      ...ServiceDetail @unmask
    }
  }

  fragment ServiceDetail on Service {
    id
    name
    image
    ports
    replicas
    environmentVariables {
      key
      value
    }
    createdAt
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId",
)({
  component: RouteComponent,
  beforeLoad: async ({
    context: { apolloClient },
    params: { workspaceId, projectId, serviceId },
  }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_SERVICE_QUERY,
        variables: { id: serviceId },
      });

      if (data?.service) {
        return {
          title: data.service.name,
          service: data.service,
          project: data.service.project,
        };
      }
    } catch {}

    throw redirect({
      to: "/workspaces/$workspaceId/projects/$projectId/services",
      params: { workspaceId, projectId },
    });
  },
});

function RouteComponent() {
  const { workspaceId, projectId, serviceId } = Route.useParams();
  const { project } = Route.useRouteContext();

  const tabs = useMemo(
    () => [
      {
        title: "Overview",
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId",
          params: {
            workspaceId,
            projectId,
            serviceId,
          },
          activeOptions: { exact: true },
        }),
      },
      {
        title: "Environment",
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/environment",
          params: {
            workspaceId,
            projectId,
            serviceId,
          },
        }),
      },
      {
        title: "Domains",
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/domains",
          params: {
            workspaceId,
            projectId,
            serviceId,
          },
        }),
      },
      {
        title: "Volumes",
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/volumes",
          params: {
            workspaceId,
            projectId,
            serviceId,
          },
        }),
      },
      {
        title: "Logs",
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/logs",
          params: {
            workspaceId,
            projectId,
            serviceId,
          },
        }),
      },
      {
        title: "Metrics",
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/metrics",
          params: {
            workspaceId,
            projectId,
            serviceId,
          },
        }),
      },
      {
        title: "Settings",
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/settings",
          params: {
            workspaceId,
            projectId,
            serviceId,
          },
        }),
      },
    ],
    [],
  );

  return (
    <SidebarProvider>
      <WorkspaceSidebar />

      <SidebarInset className="pt-16 group-has-data-[collapsible=icon]/sidebar-wrapper:pt-12">
        <header className="bg-background fixed top-0 right-0 left-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[left,right,width,height] transition-[width,height] duration-200 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:left-(--sidebar-width) md:group-has-data-[collapsible=icon]/sidebar-wrapper:left-(--sidebar-width-icon)">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <Breadcrumbs
              baseItems={[
                {
                  title: "Projects",
                  link: linkOptions({
                    to: "/workspaces/$workspaceId/projects",
                    params: { workspaceId },
                  }),
                },
                {
                  title: project.name,
                  link: linkOptions({
                    to: "/workspaces/$workspaceId/projects/$projectId",
                    params: { workspaceId, projectId },
                  }),
                },
                {
                  title: "Services",
                  link: linkOptions({
                    to: "/workspaces/$workspaceId/projects/$projectId/services",
                    params: { workspaceId, projectId },
                  }),
                },
              ]}
            />
          </div>
        </header>

        <NavTabs tabs={tabs} />

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
