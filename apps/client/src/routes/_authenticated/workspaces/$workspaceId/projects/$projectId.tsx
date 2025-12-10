import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";

import { graphql } from "@/gql";
import { useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";

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
    createdAt
    updatedAt
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId",
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
  const router = useRouter();
  const apolloClient = useApolloClient();
  const project = Route.useRouteContext({
    select: (context) => context.project,
  });

  useEffect(() => {
    const subscription = apolloClient
      .watchQuery({
        query: GET_PROJECT_QUERY,
        variables: { id: project.id },
        fetchPolicy: "cache-only",
      })
      .subscribe({
        next(result) {
          if (result.data?.project?.updatedAt !== project.updatedAt) {
            router.invalidate();
          }
        },
      });

    return () => subscription.unsubscribe();
  }, [apolloClient, project]);

  return <Outlet />;
}
