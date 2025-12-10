import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { graphql } from "@/gql";

const CREATE_WORKSPACE_MUTATION = graphql(`
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
    }
  }
`);

export const Route = createFileRoute("/_authenticated/workspaces/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const navigate = Route.useNavigate();

  const [createWorkspace, { loading }] = useMutation(CREATE_WORKSPACE_MUTATION);

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      const { data } = await createWorkspace({
        variables: {
          input: {
            name: value.name,
          },
        },
      });

      if (data?.createWorkspace.id) {
        navigate({
          to: "/workspaces/$workspaceId",
          params: { workspaceId: data.createWorkspace.id },
        });
      }
    },
  });

  return (
    <div className="mx-auto flex h-full w-full items-center justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Create Workspace</FieldLegend>
              <FieldDescription>
                Create a new workspace to start managing your projects.
              </FieldDescription>
              <FieldGroup>
                <form.Field name="name">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="My Workspace"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.history.back()}
              >
                Back
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
