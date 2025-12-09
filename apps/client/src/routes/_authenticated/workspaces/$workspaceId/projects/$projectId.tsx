import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { graphql } from "@/gql";

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
  "/_authenticated/workspaces/$workspaceId/projects/$projectId",
)({
  component: Outlet,
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
