import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";

import type { DeleteServiceItem } from "@/components/delete-service-dialog";
import { DeleteServiceDialog } from "@/components/delete-service-dialog";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { graphql } from "@/gql";

const DELETE_SERVICE_MUTATION = graphql(`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/settings",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams();
  const { service } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const [deletingService, setDeletingService] =
    useState<DeleteServiceItem | null>(null);

  const [deleteService, { loading: deleting }] = useMutation(
    DELETE_SERVICE_MUTATION,
    {
      update(cache, result) {
        if (result.data?.deleteService) {
          cache.evict({ id: cache.identify(result.data.deleteService) });
          cache.gc();
        }
      },
    },
  );

  const handleDelete = async (id: string) => {
    await deleteService({
      variables: { id },
    });
    navigate({
      to: "/workspaces/$workspaceId/projects/$projectId/services",
      params: { workspaceId, projectId },
    });
  };

  if (!service) {
    return <div>{t("service.notFound")}</div>;
  }

  return (
    <Page
      title={t("service.tabs.settings")}
      description={t("service.settings.description")}
    >
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            {t("service.settings.dangerZone.title")}
          </CardTitle>
          <CardDescription>
            {t("service.settings.dangerZone.description")}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={() => setDeletingService(service)}
          >
            {t("service.settings.dangerZone.deleteButton")}
          </Button>
        </CardFooter>
      </Card>

      <DeleteServiceDialog
        service={deletingService}
        deleting={deleting}
        onOpenChange={() => setDeletingService(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
