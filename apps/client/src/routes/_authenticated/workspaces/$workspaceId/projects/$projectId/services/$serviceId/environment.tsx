import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { graphql } from "@/gql";
import { Page } from "@/components/page";

const UPDATE_SERVICE_MUTATION = graphql(`
  mutation UpdateServiceEnvironment($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      ...ServiceDetail
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/environment",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

interface EnvironmentVariable {
  key: string;
  value: string;
}

function parseRawEnv(raw: string): Array<EnvironmentVariable> {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const eqIndex = line.indexOf("=");
      if (eqIndex === -1) {
        return { key: line, value: "" };
      }
      return {
        key: line.slice(0, eqIndex),
        value: line.slice(eqIndex + 1),
      };
    })
    .filter((env) => env.key);
}

function serializeToRaw(envVars: Array<EnvironmentVariable>): string {
  return envVars.map((env) => `${env.key}=${env.value}`).join("\n");
}

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const { service } = Route.useRouteContext();

  const [activeTab, setActiveTab] = useState<string>("form");
  const [rawValue, setRawValue] = useState(() =>
    serializeToRaw(service?.environmentVariables ?? []),
  );

  const [updateService] = useMutation(UPDATE_SERVICE_MUTATION);

  const form = useForm({
    defaultValues: {
      environmentVariables: (service?.environmentVariables ??
        []) as Array<EnvironmentVariable>,
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            environmentVariables: value.environmentVariables.filter(
              (env) => env.key.trim() !== "",
            ),
          },
        },
      });
    },
  });

  const handleTabChange = (tab: string) => {
    if (tab === "raw" && activeTab === "form") {
      // Switching to raw: serialize form data
      setRawValue(serializeToRaw(form.state.values.environmentVariables));
    } else if (tab === "form" && activeTab === "raw") {
      // Switching to form: parse raw data
      const parsed = parseRawEnv(rawValue);
      form.setFieldValue("environmentVariables", parsed);
    }
    setActiveTab(tab);
  };

  const handleRawSubmit = async () => {
    const parsed = parseRawEnv(rawValue);
    await updateService({
      variables: {
        id: serviceId,
        input: {
          environmentVariables: parsed,
        },
      },
    });
  };

  const rawLineCount = useMemo(() => {
    const lines = rawValue.split("\n").length;
    return Math.max(lines, 10);
  }, [rawValue]);

  return (
    <Page
      title="Environment"
      description="Manage environment variables for your service."
    >
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>
            Configure environment variables that will be available to your
            service at runtime.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <form.Field name="environmentVariables" mode="array">
                  {(field) => (
                    <div className="flex flex-col gap-3">
                      {field.state.value.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center text-sm">
                          No environment variables configured.
                        </p>
                      ) : (
                        <>
                          <div className="text-muted-foreground grid grid-cols-[1fr_1fr_auto] gap-2 text-sm font-medium">
                            <span>Key</span>
                            <span>Value</span>
                            <span className="w-9" />
                          </div>
                          {field.state.value.map((_, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr_1fr_auto] gap-2"
                            >
                              <form.Field
                                name={`environmentVariables[${index}].key`}
                              >
                                {(subField) => (
                                  <Input
                                    placeholder="KEY"
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                )}
                              </form.Field>
                              <form.Field
                                name={`environmentVariables[${index}].value`}
                              >
                                {(subField) => (
                                  <Input
                                    placeholder="value"
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                )}
                              </form.Field>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => field.removeValue(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-fit"
                        onClick={() => field.pushValue({ key: "", value: "" })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Variable
                      </Button>
                    </div>
                  )}
                </form.Field>

                <div className="mt-4">
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <Button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    )}
                  </form.Subscribe>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground text-sm">
                  Enter environment variables in KEY=VALUE format, one per line.
                  Lines starting with # are ignored.
                </p>
                <Textarea
                  className="field-sizing-fixed min-h-[200px] overflow-x-auto font-mono whitespace-pre"
                  placeholder={`# Example:\nDATABASE_URL=postgres://localhost:5432/db\nAPI_KEY=your-api-key`}
                  value={rawValue}
                  onChange={(e) => setRawValue(e.target.value)}
                  rows={rawLineCount}
                />
                <Button
                  type="button"
                  onClick={handleRawSubmit}
                  className="w-fit"
                >
                  Save Changes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Page>
  );
}
