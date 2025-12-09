import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/clusters",
)({
  component: Outlet,
  beforeLoad: async ({
    context: {
      i18n: { t },
    },
  }) => {
    return { title: t("cluster.title") };
  },
});
