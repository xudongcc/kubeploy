import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_workspace-layout/settings",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: "Settings" };
  },
});

function RouteComponent() {
  return <div>Hello "/_authenticated/workspaces/$workspaceId/settings"!</div>;
}
