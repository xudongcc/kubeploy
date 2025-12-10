import { createFileRoute } from "@tanstack/react-router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client/react";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

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
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const { data } = useQuery(GET_FIRST_WORKSPACE_QUERY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.workspaces.edges) {
      const workspace = data.workspaces.edges[0]?.node;

      if (workspace) {
        navigate({
          to: "/workspaces/$workspaceId",
          params: {
            workspaceId: workspace.id,
          },
        });
      } else {
        navigate({
          to: "/workspaces/create",
        });
      }
    }
  }, [data]);

  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  );
}
