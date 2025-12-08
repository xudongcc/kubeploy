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

const GET_PROJECT_QUERY = graphql(`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      ...ProjectDetail @unmask
    }
  }

  fragment ProjectDetail on Project {
    id
    name
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId",
)({
  component: RouteComponent,
  beforeLoad: async ({
    context: { apolloClient },
    params: { workspaceId, projectId },
  }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_PROJECT_QUERY,
        variables: { id: projectId },
      });

      if (data?.project) {
        return {
          title: data.project.name,
          project: data.project,
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
  const { workspaceId, projectId } = Route.useParams();

  const tabs = useMemo(
    () => [
      {
        title: t("project.tabs.services"),
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services",
          params: {
            workspaceId,
            projectId,
          },
        }),
      },
      {
        title: t("project.tabs.settings"),
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/settings",
          params: {
            workspaceId,
            projectId,
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
