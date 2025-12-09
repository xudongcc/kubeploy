import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { t } from "i18next";

import {
  DeleteWorkspaceDialog,
  type DeleteWorkspaceItem,
} from "@/components/delete-workspace-dialog";
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

const UPDATE_WORKSPACE_MUTATION = graphql(`
  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {
    updateWorkspace(input: $input) {
      id
      name
    }
  }
`);

const DELETE_WORKSPACE_MUTATION = graphql(`
  mutation DeleteWorkspace {
    deleteWorkspace {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/settings",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      title: t("workspace.title"),
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const workspace = Route.useRouteContext({
    select: (context) => context.workspace,
  });

  const [deletingWorkspace, setDeletingWorkspace] =
    useState<DeleteWorkspaceItem | null>(null);

  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE_MUTATION);
  const [deleteWorkspace, { loading: deleting }] = useMutation(
    DELETE_WORKSPACE_MUTATION,
    {
      update(cache, result) {
        if (result.data?.deleteWorkspace) {
          cache.evict({ id: cache.identify(result.data.deleteWorkspace) });
          cache.gc();
        }
      },
    },
  );

  const form = useForm({
    defaultValues: {
      name: workspace.name,
    },
    onSubmit: async ({ value }) => {
      await updateWorkspace({
        variables: {
          input: {
            name: value.name.trim(),
          },
        },
      });
    },
  });

  const handleDelete = async () => {
    await deleteWorkspace();
    navigate({
      to: "/workspaces",
    });
  };

  return (
    <Page
      title={t("workspace.title")}
      description={t("workspace.settings.description")}
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
              <CardTitle>{t("workspace.settings.title")}</CardTitle>
              <CardDescription>
                {t("workspace.settings.description")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? t("workspace.settings.form.name.required")
                      : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">
                      {t("workspace.settings.form.name.label")}
                    </FieldLabel>
                    <Input
                      id="name"
                      placeholder={t(
                        "workspace.settings.form.name.placeholder",
                      )}
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
              {t("workspace.settings.dangerZone.title")}
            </CardTitle>
            <CardDescription>
              {t("workspace.settings.dangerZone.description")}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() => setDeletingWorkspace(workspace)}
            >
              {t("workspace.settings.dangerZone.deleteButton")}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <DeleteWorkspaceDialog
        workspace={deletingWorkspace}
        deleting={deleting}
        onOpenChange={() => setDeletingWorkspace(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
