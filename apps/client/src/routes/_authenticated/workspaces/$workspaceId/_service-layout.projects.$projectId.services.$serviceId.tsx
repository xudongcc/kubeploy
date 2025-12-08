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
import { t } from "i18next";
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
        title: t("service.tabs.overview"),
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
        title: t("service.tabs.environment"),
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
        title: t("service.tabs.domains"),
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
        title: t("service.tabs.volumes"),
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
        title: t("service.tabs.logs"),
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
        title: t("service.tabs.metrics"),
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
        title: t("service.tabs.settings"),
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

      <SidebarInset>
        <header className="bg-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] duration-200 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:left-(--sidebar-width) md:group-has-data-[collapsible=icon]/sidebar-wrapper:left-(--sidebar-width-icon)">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <Breadcrumbs
              baseItems={[
                {
                  title: t("project.title"),
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
                  title: t("service.title"),
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
