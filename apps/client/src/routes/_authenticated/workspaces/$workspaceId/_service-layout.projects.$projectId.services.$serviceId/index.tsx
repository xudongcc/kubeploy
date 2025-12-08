import { useMutation } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { graphql } from "@/gql";

const DEPLOY_SERVICE_MUTATION = graphql(`
  mutation DeployService($id: ID!) {
    deployService(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const service = Route.useRouteContext({
    select: (context) => context.service,
  });

  const [deployService, { loading: deploying }] = useMutation(
    DEPLOY_SERVICE_MUTATION,
  );

  return (
    <Page
      title="Overview"
      description="Overview of your service."
      actions={
        <Button
          onClick={() => {
            deployService({
              variables: {
                id: service.id,
              },
            });
          }}
          disabled={deploying}
        >
          {deploying ? "Deploying..." : "Deploy"}
        </Button>
      }
    >
      Hello
      "/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId/overview"!
    </Page>
  );
}
