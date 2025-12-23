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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { graphql } from "@/gql";
import { HealthCheckType } from "@/gql/graphql";

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

  const resourceForm = useForm({
    defaultValues: {
      // Convert millicores to cores for display (e.g., 1500 -> 1.5)
      cpu: service.resourceLimits?.cpu
        ? service.resourceLimits.cpu / 1000
        : null,
      memory: service.resourceLimits?.memory ?? null,
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            resourceLimits: {
              // Convert cores back to millicores (e.g., 1.5 -> 1500)
              cpu: value.cpu ? Math.round(value.cpu * 1000) : null,
              memory: value.memory || null,
            },
          },
        },
      });
    },
  });

  const healthCheckForm = useForm({
    defaultValues: {
      enabled: !!service.healthCheck,
      type: service.healthCheck?.type ?? HealthCheckType.HTTP,
      path: service.healthCheck?.path ?? "/",
      port: service.healthCheck?.port ?? 8080,
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            healthCheck: value.enabled
              ? {
                  type: value.type,
                  path: value.type === HealthCheckType.HTTP ? value.path : null,
                  port: value.port,
                }
              : null,
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
            resourceForm.handleSubmit();
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
                <resourceForm.Field name="cpu">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="cpu"
                        className="text-sm leading-none font-medium"
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
                </resourceForm.Field>

                <resourceForm.Field name="memory">
                  {(field) => (
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="memory"
                        className="text-sm leading-none font-medium"
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
                </resourceForm.Field>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <resourceForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? t("common.saving") : t("common.save")}
                  </Button>
                )}
              </resourceForm.Subscribe>
            </CardFooter>
          </Card>
        </form>

        {/* Health Check Configuration */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            healthCheckForm.handleSubmit();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("service.healthCheck.title")}</CardTitle>
              <CardDescription>
                {t("service.healthCheck.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Enable Health Check */}
                <healthCheckForm.Field name="enabled">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="healthCheckEnabled"
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                      />
                      <label
                        htmlFor="healthCheckEnabled"
                        className="text-sm leading-none font-medium"
                      >
                        {t("service.healthCheck.form.enabled.label")}
                      </label>
                    </div>
                  )}
                </healthCheckForm.Field>

                <healthCheckForm.Subscribe
                  selector={(state) => state.values.enabled}
                >
                  {(enabled) =>
                    enabled && (
                      <div className="flex flex-col gap-4">
                        {/* Probe Type and Port */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <healthCheckForm.Field name="type">
                            {(field) => (
                              <div className="flex flex-col gap-2">
                                <label
                                  htmlFor="probeType"
                                  className="text-sm leading-none font-medium"
                                >
                                  {t("service.healthCheck.form.type.label")}
                                </label>
                                <Select
                                  value={field.state.value}
                                  onValueChange={(value) =>
                                    field.handleChange(value as HealthCheckType)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={HealthCheckType.HTTP}>
                                      HTTP
                                    </SelectItem>
                                    <SelectItem value={HealthCheckType.TCP}>
                                      TCP
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </healthCheckForm.Field>

                          <healthCheckForm.Field
                            name="port"
                            validators={{
                              onChange: ({ value }) => {
                                if (value < 1 || value > 65535) {
                                  return "Port must be between 1 and 65535";
                                }
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <div className="flex flex-col gap-2">
                                <label
                                  htmlFor="probePort"
                                  className="text-sm leading-none font-medium"
                                >
                                  {t("service.healthCheck.form.port.label")}
                                </label>
                                <Input
                                  id="probePort"
                                  type="number"
                                  min={1}
                                  max={65535}
                                  placeholder={t(
                                    "service.healthCheck.form.port.placeholder",
                                  )}
                                  value={field.state.value ?? ""}
                                  onChange={(e) =>
                                    field.handleChange(
                                      e.target.value
                                        ? parseInt(e.target.value, 10)
                                        : 8080,
                                    )
                                  }
                                />
                                {field.state.meta.errors.length > 0 && (
                                  <p className="text-destructive text-xs">
                                    {field.state.meta.errors[0]}
                                  </p>
                                )}
                              </div>
                            )}
                          </healthCheckForm.Field>
                        </div>

                        {/* HTTP Path (only for HTTP type) */}
                        <healthCheckForm.Subscribe
                          selector={(state) => state.values.type}
                        >
                          {(type) =>
                            type === HealthCheckType.HTTP && (
                              <healthCheckForm.Field name="path">
                                {(field) => (
                                  <div className="flex flex-col gap-2">
                                    <label
                                      htmlFor="probePath"
                                      className="text-sm leading-none font-medium"
                                    >
                                      {t("service.healthCheck.form.path.label")}
                                    </label>
                                    <Input
                                      id="probePath"
                                      type="text"
                                      placeholder={t(
                                        "service.healthCheck.form.path.placeholder",
                                      )}
                                      value={field.state.value ?? ""}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                    />
                                    <p className="text-muted-foreground text-xs">
                                      {t("service.healthCheck.form.path.hint")}
                                    </p>
                                  </div>
                                )}
                              </healthCheckForm.Field>
                            )
                          }
                        </healthCheckForm.Subscribe>
                      </div>
                    )
                  }
                </healthCheckForm.Subscribe>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <healthCheckForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? t("common.saving") : t("common.save")}
                  </Button>
                )}
              </healthCheckForm.Subscribe>
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
