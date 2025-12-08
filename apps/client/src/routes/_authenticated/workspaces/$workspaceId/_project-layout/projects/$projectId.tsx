import { createFileRoute, redirect } from "@tanstack/react-router";
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
    createdAt
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId",
)({
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
        return { title: data.project.name, project: data.project };
      }
    } catch {}

    throw redirect({
      to: "/workspaces/$workspaceId/projects",
      params: { workspaceId },
    });
  },
});
