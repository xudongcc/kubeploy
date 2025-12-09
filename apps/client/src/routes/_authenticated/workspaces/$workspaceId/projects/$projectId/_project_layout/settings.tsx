import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";

import {
  DeleteProjectDialog,
  type DeleteProjectItem,
} from "@/components/delete-project-dialog";
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

const UPDATE_PROJECT_MUTATION = graphql(`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      ...ProjectDetail
    }
  }
`);

const DELETE_PROJECT_MUTATION = graphql(`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/_project_layout/settings",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { project } = Route.useRouteContext();

  const [deletingProject, setDeletingProject] =
    useState<DeleteProjectItem | null>(null);

  const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION);
  const [deleteProject, { loading: deleting }] = useMutation(
    DELETE_PROJECT_MUTATION,
    {
      update(cache, result) {
        if (result.data?.deleteProject) {
          cache.evict({ id: cache.identify(result.data.deleteProject) });
          cache.gc();
        }
      },
    },
  );

  const form = useForm({
    defaultValues: {
      name: project?.name ?? "",
    },
    onSubmit: async ({ value }) => {
      await updateProject({
        variables: {
          id: projectId,
          input: {
            name: value.name.trim(),
          },
        },
      });
    },
  });

  const handleDelete = async (id: string) => {
    await deleteProject({
      variables: { id },
    });
    navigate({
      to: "/workspaces/$workspaceId/projects",
      params: { workspaceId },
    });
  };

  if (!project) {
    return <div>{t("project.notFound")}</div>;
  }

  return (
    <Page
      title={t("project.settings.title")}
      description={t("project.settings.description")}
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
              <CardTitle>{t("project.updateForm.title")}</CardTitle>
              <CardDescription>
                {t("project.updateForm.description")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? t("project.updateForm.name.required")
                      : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">
                      {t("project.updateForm.name.label")}
                    </FieldLabel>
                    <Input
                      id="name"
                      placeholder={t("project.updateForm.name.placeholder")}
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
              {t("project.settings.dangerZone.title")}
            </CardTitle>
            <CardDescription>
              {t("project.settings.dangerZone.description")}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() => setDeletingProject(project)}
            >
              {t("project.settings.dangerZone.deleteButton")}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <DeleteProjectDialog
        project={deletingProject}
        deleting={deleting}
        onOpenChange={() => setDeletingProject(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
