import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_workspace-layout/members/",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: "Members" };
  },
});

function RouteComponent() {
  return <div>Hello "/_authenticated/workspaces/$workspaceId/members/"!</div>;
}
