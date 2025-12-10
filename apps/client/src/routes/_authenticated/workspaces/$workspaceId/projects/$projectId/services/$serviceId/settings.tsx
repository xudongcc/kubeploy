import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";

import type { DeleteServiceItem } from "@/components/delete-service-dialog";
import { DeleteServiceDialog } from "@/components/delete-service-dialog";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { graphql } from "@/gql";

const UPDATE_SERVICE_MUTATION = graphql(`
  mutation UpdateServiceResources($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      ...ServiceDetail
    }
  }
`);

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
  const { workspaceId, projectId, serviceId } = Route.useParams();
  const { service } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const [deletingService, setDeletingService] =
    useState<DeleteServiceItem | null>(null);

  const [updateService] = useMutation(UPDATE_SERVICE_MUTATION);

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

  const form = useForm({
    defaultValues: {
      // Convert millicores to cores for display (e.g., 1500 -> 1.5)
      cpu: service.resourceUsage?.cpu
        ? service.resourceUsage.cpu / 1000
        : null,
      memory: service.resourceUsage?.memory ?? null,
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            resourceUsage: {
              // Convert cores back to millicores (e.g., 1.5 -> 1500)
              cpu: value.cpu ? Math.round(value.cpu * 1000) : null,
              memory: value.memory || null,
            },
          },
        },
      });
    },
  });

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
      <div className="flex flex-col gap-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("service.resources.title")}</CardTitle>
              <CardDescription>
                {t("service.resources.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="cpu">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="cpu"
                        className="text-sm font-medium leading-none"
                      >
                        {t("service.resources.form.cpu.label")}
                      </label>
                      <InputGroup>
                        <InputGroupInput
                          id="cpu"
                          type="number"
                          min={0}
                          step={0.1}
                          placeholder={t(
                            "service.resources.form.cpu.placeholder",
                          )}
                          value={field.state.value ?? ""}
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : null,
                            )
                          }
                        />
                        <InputGroupAddon align="inline-end">
                          {t("service.resources.form.cpu.unit")}
                        </InputGroupAddon>
                      </InputGroup>
                      <p className="text-muted-foreground text-xs">
                        {t("service.resources.form.cpu.hint")}
                      </p>
                    </div>
                  )}
                </form.Field>

                <form.Field name="memory">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="memory"
                        className="text-sm font-medium leading-none"
                      >
                        {t("service.resources.form.memory.label")}
                      </label>
                      <InputGroup>
                        <InputGroupInput
                          id="memory"
                          type="number"
                          min={0}
                          placeholder={t(
                            "service.resources.form.memory.placeholder",
                          )}
                          value={field.state.value ?? ""}
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value
                                ? parseInt(e.target.value, 10)
                                : null,
                            )
                          }
                        />
                        <InputGroupAddon align="inline-end">
                          {t("service.resources.form.memory.unit")}
                        </InputGroupAddon>
                      </InputGroup>
                      <p className="text-muted-foreground text-xs">
                        {t("service.resources.form.memory.hint")}
                      </p>
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? t("common.saving") : t("common.save")}
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </Card>
        </form>

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
      </div>

      <DeleteServiceDialog
        service={deletingService}
        deleting={deleting}
        onOpenChange={() => setDeletingService(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
