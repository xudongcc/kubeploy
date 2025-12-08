import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/page";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/logs",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: "Logs" };
  },
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
