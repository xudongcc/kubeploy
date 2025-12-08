import { createFileRoute, redirect } from "@tanstack/react-router";
import { graphql } from "@/gql";

const GET_FIRST_WORKSPACE_QUERY = graphql(`
  query GetFirstWorkspace {
    workspaces(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
      edges {
        node {
          id
        }
      }
    }
  }
`);

export const Route = createFileRoute("/_authenticated/workspaces/")({
  beforeLoad: async ({ context: { apolloClient } }) => {
    const { data } = await apolloClient.query({
      query: GET_FIRST_WORKSPACE_QUERY,
    });

    if (data?.workspaces.edges && data.workspaces.edges.length > 0) {
      throw redirect({
        to: "/workspaces/$workspaceId",
        params: {
          workspaceId: data.workspaces.edges[0].node.id,
        },
      });
    } else {
      throw redirect({
        to: "/workspaces/create",
      });
    }
  },
});
