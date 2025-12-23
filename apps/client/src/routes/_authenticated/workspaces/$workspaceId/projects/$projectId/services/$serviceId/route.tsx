import {
  Outlet,
  createFileRoute,
  linkOptions,
  redirect,
  useRouter,
} from "@tanstack/react-router";

import { graphql } from "@/gql";
import { NavTabs } from "@/components/nav-tabs";
import { t } from "i18next";
import { useEffect, useMemo } from "react";
import { useApolloClient } from "@apollo/client/react";

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
    image {
      registry
      name
      tag
      username
    }
    ports {
      port
      protocol
    }
    environmentVariables {
      key
      value
    }
    resourceLimits {
      cpu
      memory
    }
    healthCheck {
      type
      path
      port
    }
    createdAt
    updatedAt
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId",
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

  const router = useRouter();
  const apolloClient = useApolloClient();
  const service = Route.useRouteContext({
    select: (context) => context.service,
  });

  useEffect(() => {
    const subscription = apolloClient
      .watchQuery({
        query: GET_SERVICE_QUERY,
        variables: { id: service.id },
        fetchPolicy: "cache-only",
      })
      .subscribe({
        next(result) {
          if (
            result.data?.service?.updatedAt &&
            result.data?.service?.updatedAt !== service.updatedAt
          ) {
            router.invalidate();
          }
        },
      });

    return () => subscription.unsubscribe();
  }, [apolloClient, service]);

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
        title: t("service.tabs.network"),
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/network",
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
        title: t("service.tabs.terminal"),
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/terminal",
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
    <>
      <NavTabs tabs={tabs} />

      <Outlet />
    </>
  );
}
