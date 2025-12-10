import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

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
  mutation UpdateServiceImage($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      ...ServiceDetail
    }
  }
`);

const DEPLOY_SERVICE_MUTATION = graphql(`
  mutation DeployService($id: ID!) {
    deployService(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const { t } = useTranslation();

  const service = Route.useRouteContext({
    select: (context) => context.service,
  });

  const [updateService] = useMutation(UPDATE_SERVICE_MUTATION);
  const [deployService, { loading: deploying }] = useMutation(
    DEPLOY_SERVICE_MUTATION,
  );

  const form = useForm({
    defaultValues: {
      image: {
        registry: service?.image?.registry ?? "",
        name: service?.image?.name ?? "",
        tag: service?.image?.tag ?? "",
        username: service?.image?.username ?? "",
        password: "",
      },
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            image: {
              registry: value.image.registry.trim() || undefined,
              name: value.image.name.trim(),
              tag: value.image.tag.trim() || undefined,
              username: value.image.username.trim() || undefined,
              password: value.image.password.trim() || undefined,
            },
          },
        },
      });
    },
  });

  return (
    <Page
      title={t("service.tabs.overview")}
      description={t("service.overview.description")}
      actions={
        <Button
          onClick={() => {
            deployService({
              variables: {
                id: service.id,
              },
            });
          }}
          disabled={deploying}
        >
          {deploying ? t("service.deploying") : t("service.deploy")}
        </Button>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("service.image.title")}</CardTitle>
            <CardDescription>{t("service.image.description")}</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4">
            <form.Field name="image.registry">
              {(field) => (
                <Field className="col-span-2">
                  <FieldLabel htmlFor="image.registry">
                    {t("service.image.form.registry.label")}
                  </FieldLabel>
                  <Input
                    id="image.registry"
                    placeholder={t("service.image.form.registry.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="image.name"
              validators={{
                onChange: ({ value }) =>
                  !value.trim()
                    ? t("service.image.form.name.required")
                    : undefined,
              }}
            >
              {(field) => (
                <Field className="col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="image.name">
                    {t("service.image.form.name.label")}
                  </FieldLabel>
                  <Input
                    id="image.name"
                    placeholder={t("service.image.form.name.placeholder")}
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

            <form.Field name="image.tag">
              {(field) => (
                <Field className="col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="image.tag">
                    {t("service.image.form.tag.label")}
                  </FieldLabel>
                  <Input
                    id="image.tag"
                    placeholder={t("service.image.form.tag.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="image.username">
              {(field) => (
                <Field className="col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="image.username">
                    {t("service.image.form.username.label")}
                  </FieldLabel>
                  <Input
                    id="image.username"
                    placeholder={t("service.image.form.username.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="image.password">
              {(field) => (
                <Field className="col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="image.password">
                    {t("service.image.form.password.label")}
                  </FieldLabel>
                  <Input
                    id="image.password"
                    type="password"
                    placeholder={t("service.image.form.password.placeholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>
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
    </Page>
  );
}
