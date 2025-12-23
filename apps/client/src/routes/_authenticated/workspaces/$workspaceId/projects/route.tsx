import { createFileRoute, Outlet } from "@tanstack/react-router";
import { t } from "i18next";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects",
)({
  component: Outlet,
  beforeLoad: () => {
    return { title: t("project.title") };
  },
});
