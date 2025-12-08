import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/page";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId/services/$serviceId/logs",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { service } = Route.useRouteContext();

  return (
    <Page title="Logs" description="View your service logs.">
      Hello
      "/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId/logs"!
    </Page>
  );
}
