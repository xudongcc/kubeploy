import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { graphql } from "@/gql";
import { t } from "i18next";

const CREATE_SERVICE_MUTATION = graphql(`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId/services/create",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: t("createService.title") };
  },
});

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams();
  const navigate = Route.useNavigate();

  const [createService] = useMutation(CREATE_SERVICE_MUTATION);

  const form = useForm({
    defaultValues: {
      name: "",
      image: "",
      replicas: 1,
      ports: [] as Array<number>,
      environmentVariables: [] as Array<{ key: string; value: string }>,
    },
    onSubmit: async ({ value }) => {
      const { data } = await createService({
        variables: {
          input: {
            name: value.name.trim(),
            image: value.image.trim(),
            replicas: value.replicas,
            ports: value.ports.length > 0 ? value.ports : undefined,
            environmentVariables:
              value.environmentVariables.length > 0
                ? value.environmentVariables
                : undefined,
            projectId,
          },
        },
      });

      if (data?.createService.id) {
        navigate({
          to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId",
          params: { workspaceId, projectId, serviceId: data.createService.id },
        });
      }
    },
  });

  return (
    <Page
      title={t("createService.title")}
      description={t("createService.description")}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Configure the basic settings for your service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <form.Field name="replicas">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="replicas">Replicas</FieldLabel>
                  <Input
                    id="replicas"
                    type="number"
                    min={1}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value, 10) || 1)
                    }
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ports</CardTitle>
            <CardDescription>
              Configure the ports your service exposes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="ports" mode="array">
              {(field) => (
                <div className="space-y-2">
                  {field.state.value.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <form.Field name={`ports[${index}]`}>
                        {(portField) => (
                          <Input
                            type="number"
                            min={1}
                            max={65535}
                            placeholder="Port number"
                            value={portField.state.value}
                            onChange={(e) =>
                              portField.handleChange(
                                parseInt(e.target.value, 10) || 0,
                              )
                            }
                          />
                        )}
                      </form.Field>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => field.removeValue(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.pushValue(80)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Port
                  </Button>
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Set environment variables for your container
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="environmentVariables" mode="array">
              {(field) => (
                <div className="space-y-2">
                  {field.state.value.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <form.Field name={`environmentVariables[${index}].key`}>
                        {(keyField) => (
                          <Input
                            placeholder="KEY"
                            value={keyField.state.value}
                            onChange={(e) =>
                              keyField.handleChange(e.target.value)
                            }
                          />
                        )}
                      </form.Field>
                      <form.Field name={`environmentVariables[${index}].value`}>
                        {(valueField) => (
                          <Input
                            placeholder="value"
                            value={valueField.state.value}
                            onChange={(e) =>
                              valueField.handleChange(e.target.value)
                            }
                          />
                        )}
                      </form.Field>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => field.removeValue(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.pushValue({ key: "", value: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Environment Variable
                  </Button>
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate({
                to: "/workspaces/$workspaceId/projects/$projectId/services",
                params: { workspaceId, projectId },
              })
            }
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Service"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </Page>
  );
}
