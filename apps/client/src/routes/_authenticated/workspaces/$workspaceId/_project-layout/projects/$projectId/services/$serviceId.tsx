import {
  Outlet,
  createFileRoute,
  linkOptions,
  redirect,
} from "@tanstack/react-router";
import { graphql } from "@/gql";
import { NavTabs } from "@/components/nav-tabs";
import { useMemo } from "react";

const GET_SERVICE_QUERY = graphql(`
  query GetService($id: ID!) {
    service(id: $id) {
      id
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
  "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId/services/$serviceId",
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
        return { title: data.service.name, service: data.service };
      }
    } catch {}

    throw redirect({
      to: "/workspaces/$workspaceId/projects/$projectId/services",
      params: { workspaceId, projectId },
    });
  },
});

function RouteComponent() {
  const { workspace, project, service } = Route.useRouteContext();

  const tabs = useMemo(
    () => [
      {
        title: "Overview",
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
    [],
  );

  return (
    <>
      <NavTabs tabs={tabs} />

      <Outlet />
    </>
  );
}
