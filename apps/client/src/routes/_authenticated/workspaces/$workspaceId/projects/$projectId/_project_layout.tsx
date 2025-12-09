import { Outlet, createFileRoute, linkOptions } from "@tanstack/react-router";

import { NavTabs } from "@/components/nav-tabs";
import { t } from "i18next";
import { useMemo } from "react";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/_project_layout",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams();

  const tabs = useMemo(
    () => [
      {
        title: t("project.tabs.services"),
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/services",
          params: {
            workspaceId,
            projectId,
          },
        }),
      },
      {
        title: t("project.tabs.settings"),
        link: linkOptions({
          to: "/workspaces/$workspaceId/projects/$projectId/settings",
          params: {
            workspaceId,
            projectId,
          },
        }),
      },
    ],
    [],
  );

  return (
    <>
      <NavTabs tabs={tabs} />

      <Outlet />
    </>
  );
}
