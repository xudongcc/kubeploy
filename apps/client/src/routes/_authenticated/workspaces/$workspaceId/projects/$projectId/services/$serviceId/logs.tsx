import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/page";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/logs",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page title="Logs" description="View your service logs.">
      Hello
      "/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId/logs"!
    </Page>
  );
}
