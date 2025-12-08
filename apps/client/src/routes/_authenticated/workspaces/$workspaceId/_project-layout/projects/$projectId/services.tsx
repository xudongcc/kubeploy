import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId/services",
)({
  component: Outlet,
  beforeLoad: () => {
    return { title: "Services" };
  },
});
