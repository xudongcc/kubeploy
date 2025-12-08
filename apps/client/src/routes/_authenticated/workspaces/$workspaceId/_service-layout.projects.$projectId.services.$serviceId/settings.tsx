import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";

import {
  DeleteServiceDialog,
  type DeleteServiceItem,
} from "@/components/delete-service-dialog";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { graphql } from "@/gql";

const UPDATE_SERVICE_MUTATION = graphql(`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      ...ServiceDetail
    }
  }
`);

const REMOVE_SERVICE_MUTATION = graphql(`
  mutation RemoveService($id: ID!) {
    removeService(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/settings",
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
  const [removeService, { loading: removing }] = useMutation(
    REMOVE_SERVICE_MUTATION,
    {
      update(cache, result) {
        if (result.data?.removeService) {
          cache.evict({ id: cache.identify(result.data.removeService) });
          cache.gc();
        }
      },
    },
  );

  const form = useForm({
    defaultValues: {
      name: service?.name ?? "",
      image: service?.image ?? "",
      replicas: service?.replicas ?? 1,
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            name: value.name.trim(),
            image: value.image.trim(),
            replicas: value.replicas,
          },
        },
      });
    },
  });

  const handleDelete = async (id: string) => {
    await removeService({
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
              <CardTitle>{t("service.settings.title")}</CardTitle>
              <CardDescription>
                {t("service.settings.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? t("service.settings.form.name.required")
                      : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">
                      {t("service.settings.form.name.label")}
                    </FieldLabel>
                    <Input
                      id="name"
                      placeholder={t("service.settings.form.name.placeholder")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="image"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? t("service.settings.form.image.required")
                      : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="image">
                      {t("service.settings.form.image.label")}
                    </FieldLabel>
                    <Input
                      id="image"
                      placeholder={t("service.settings.form.image.placeholder")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="replicas"
                validators={{
                  onChange: ({ value }) =>
                    value < 0
                      ? t("service.settings.form.replicas.required")
                      : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="replicas">
                      {t("service.settings.form.replicas.label")}
                    </FieldLabel>
                    <Input
                      id="replicas"
                      type="number"
                      min={0}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(parseInt(e.target.value, 10) || 0)
                      }
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </Field>
                )}
              </form.Field>
            </CardContent>
            <CardFooter>
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
        deleting={removing}
        onOpenChange={() => setDeletingService(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
