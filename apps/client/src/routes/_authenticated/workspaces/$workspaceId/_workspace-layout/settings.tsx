import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Page } from "@/components/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

const REMOVE_WORKSPACE_MUTATION = graphql(`
  mutation RemoveWorkspace {
    removeWorkspace {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_workspace-layout/settings",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: "Settings" };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

  const workspace = Route.useRouteContext({
    select: (context) => context.workspace,
  });

  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE_MUTATION);
  const [removeWorkspace, { loading: removing }] = useMutation(
    REMOVE_WORKSPACE_MUTATION,
    {
      update(cache, result) {
        if (result.data?.removeWorkspace) {
          cache.evict({ id: cache.identify(result.data.removeWorkspace) });
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
    await removeWorkspace();
    navigate({
      to: "/workspaces",
    });
  };

  const canDelete = deleteConfirmName === workspace.name;

  return (
    <Page
      title="Settings"
      description="Update your workspace name and other settings."
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
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>
                Update your workspace name and other settings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "Workspace name is required" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="My Workspace"
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
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </Card>
        </form>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Once you delete a workspace, there is no going back. This will
              permanently delete the workspace and all associated data including
              projects, services, and clusters.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Workspace</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the workspace <strong>{workspace.name}</strong> and all
                    associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <p className="text-muted-foreground mb-2 text-sm">
                    Please type <strong>{workspace.name}</strong> to confirm.
                  </p>
                  <Input
                    placeholder={workspace.name}
                    value={deleteConfirmName}
                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmName("")}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!canDelete || removing}
                    onClick={handleDelete}
                  >
                    {removing ? "Deleting..." : "Delete Workspace"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </Page>
  );
}
