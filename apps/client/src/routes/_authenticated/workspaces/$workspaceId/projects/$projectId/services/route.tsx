import { createFileRoute, Outlet } from "@tanstack/react-router";
import { t } from "i18next";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services",
)({
  component: Outlet,
  beforeLoad: () => {
    return { title: t("service.title") };
  },
});
