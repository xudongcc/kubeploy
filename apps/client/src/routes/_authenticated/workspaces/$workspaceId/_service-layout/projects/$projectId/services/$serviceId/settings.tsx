import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";

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
import { Page } from "@/components/page";

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
    return { title: "Settings" };
  },
});

function RouteComponent() {
  const { workspaceId, projectId, serviceId } = Route.useParams();
  const { service } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const [deleteConfirmName, setDeleteConfirmName] = useState("");

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

  const handleDelete = async () => {
    await removeService({
      variables: { id: serviceId },
    });
    navigate({
      to: "/workspaces/$workspaceId/projects/$projectId/services",
      params: { workspaceId, projectId },
    });
  };

  if (!service) {
    return <div>Service not found</div>;
  }

  const canDelete = deleteConfirmName === service.name;

  return (
    <Page title="Settings" description="Update your service settings.">
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
              <CardTitle>Service Settings</CardTitle>
              <CardDescription>
                Update your service name and other settings.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "Service name is required" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="my-service"
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
                    !value.trim() ? "Image is required" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="image">Image</FieldLabel>
                    <Input
                      id="image"
                      placeholder="nginx:latest"
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
                    value < 0 ? "Replicas must be at least 0" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="replicas">Replicas</FieldLabel>
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
              Once you delete a service, there is no going back. This will
              permanently delete the service and its associated Kubernetes
              resources.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Service</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Service</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the service <strong>{service.name}</strong> and its
                    associated Kubernetes Deployment and Service.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <p className="text-muted-foreground mb-2 text-sm">
                    Please type <strong>{service.name}</strong> to confirm.
                  </p>
                  <Input
                    placeholder={service.name}
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
                    {removing ? "Deleting..." : "Delete Service"}
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
