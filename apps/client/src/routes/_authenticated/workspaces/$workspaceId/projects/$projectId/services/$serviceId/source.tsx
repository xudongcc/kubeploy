import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ExternalLinkIcon, KeyIcon } from "lucide-react";

import {
  GitBranchSelect,
} from "@/components/git-branch-select";
import { GitProviderSelect } from "@/components/git-provider-select";
import {
  GitRepository,
  GitRepositorySelect,
} from "@/components/git-repository-select";
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
import { Skeleton } from "@/components/ui/skeleton";
import { graphql } from "@/gql";

const GET_GIT_PROVIDER_AUTHORIZED_QUERY = graphql(`
  query GetGitProviderAuthorized($gitProviderId: ID!) {
    gitProvider(id: $gitProviderId) {
      id
      authorized
    }
  }
`);

const UPDATE_SERVICE_MUTATION = graphql(`
  mutation UpdateServiceSource($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      ...ServiceDetail
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/source",
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const { workspaceId, serviceId } = Route.useParams();
  const { service } = Route.useRouteContext();

  const [updateService] = useMutation(UPDATE_SERVICE_MUTATION);

  // State for selected values
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    service.gitSource?.provider.id ?? null,
  );
  const [selectedRepo, setSelectedRepo] = useState<GitRepository | null>(
    service.gitSource
      ? {
          id: "",
          name: service.gitSource.repo,
          fullName: `${service.gitSource.owner}/${service.gitSource.repo}`,
          owner: service.gitSource.owner,
          defaultBranch: service.gitSource.branch,
          htmlUrl: "",
        }
      : null,
  );

  // Check if provider is authorized
  const { data: authorizedData, loading: authorizedLoading } = useQuery(
    GET_GIT_PROVIDER_AUTHORIZED_QUERY,
    {
      variables: { gitProviderId: selectedProviderId! },
      skip: !selectedProviderId,
    },
  );

  const isAuthorized = authorizedData?.gitProvider?.authorized ?? false;

  const form = useForm({
    defaultValues: {
      enabled: !!service.gitSource,
      providerId: service.gitSource?.provider.id ?? "",
      owner: service.gitSource?.owner ?? "",
      repo: service.gitSource?.repo ?? "",
      branch: service.gitSource?.branch ?? "",
      path: service.gitSource?.path ?? "/",
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            gitSource: value.enabled
              ? {
                  providerId: value.providerId,
                  owner: value.owner,
                  repo: value.repo,
                  branch: value.branch,
                  path: value.path || "/",
                }
              : null,
          },
        },
      });
    },
  });

  // Update form when selections change
  useEffect(() => {
    if (selectedProviderId) {
      form.setFieldValue("providerId", selectedProviderId);
    }
  }, [selectedProviderId]);

  useEffect(() => {
    if (selectedRepo) {
      form.setFieldValue("owner", selectedRepo.owner);
      form.setFieldValue("repo", selectedRepo.name);
      // Set default branch when repo is selected
      if (selectedRepo.defaultBranch && !form.getFieldValue("branch")) {
        form.setFieldValue("branch", selectedRepo.defaultBranch);
      }
    }
  }, [selectedRepo]);

  // Reset downstream selections when provider changes
  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId);
    setSelectedRepo(null);
    form.setFieldValue("owner", "");
    form.setFieldValue("repo", "");
    form.setFieldValue("branch", "");
  };

  // Handle repository selection
  const handleRepoSelect = (repo: GitRepository) => {
    setSelectedRepo(repo);
    form.setFieldValue("branch", repo.defaultBranch);
  };

  // Handle authorize click
  const handleAuthorize = () => {
    if (!selectedProviderId) return;
    const redirectUri = encodeURIComponent(window.location.href);
    window.location.href = `/api/git-providers/${selectedProviderId}/authorize?workspace_id=${workspaceId}&redirect_uri=${redirectUri}`;
  };

  if (!service) {
    return <div>{t("service.notFound")}</div>;
  }

  return (
    <Page
      title={t("service.source.title")}
      description={t("service.source.description")}
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
            <CardTitle>{t("service.source.title")}</CardTitle>
            <CardDescription>{t("service.source.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Enable Source */}
              <form.Field name="enabled">
                {(field) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="sourceEnabled"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                    <label
                      htmlFor="sourceEnabled"
                      className="text-sm leading-none font-medium"
                    >
                      {t("service.source.form.enabled.label")}
                    </label>
                  </div>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.values.enabled}>
                {(enabled) =>
                  enabled && (
                    <div className="flex flex-col gap-4">
                      {/* Git Provider Selection */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm leading-none font-medium">
                          {t("service.source.form.provider.label")}
                        </label>
                        <GitProviderSelect
                          value={selectedProviderId ?? undefined}
                          onChange={handleProviderChange}
                          placeholder={t(
                            "service.source.form.provider.placeholder",
                          )}
                        />
                      </div>

                      {/* Authorization Status */}
                      {selectedProviderId && (
                        <div className="flex flex-col gap-2">
                          {authorizedLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : !isAuthorized ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-muted-foreground text-sm">
                                {t(
                                  "service.source.form.authorization.notAuthorized",
                                )}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleAuthorize}
                              >
                                <KeyIcon className="mr-2 h-4 w-4" />
                                {t("service.source.form.authorization.authorize")}
                              </Button>
                            </div>
                          ) : (
                            <>
                              {/* Repository Selection */}
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm leading-none font-medium">
                                    {t("service.source.form.repository.label")}
                                  </label>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAuthorize}
                                  >
                                    <KeyIcon className="mr-1 h-3 w-3" />
                                    {t(
                                      "service.source.form.authorization.reauthorize",
                                    )}
                                  </Button>
                                </div>
                                <GitRepositorySelect
                                  gitProviderId={selectedProviderId}
                                  value={selectedRepo}
                                  onChange={handleRepoSelect}
                                />
                                {selectedRepo?.htmlUrl && (
                                  <a
                                    href={selectedRepo.htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary flex items-center gap-1 text-sm hover:underline"
                                  >
                                    <ExternalLinkIcon className="h-3 w-3" />
                                    {t(
                                      "service.source.form.repository.viewRepository",
                                    )}
                                  </a>
                                )}
                              </div>

                              {/* Branch Selection */}
                              {selectedRepo && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm leading-none font-medium">
                                      {t("service.source.form.branch.label")}
                                    </label>
                                    <form.Field name="branch">
                                      {(field) => (
                                        <GitBranchSelect
                                          gitProviderId={selectedProviderId}
                                          owner={selectedRepo.owner}
                                          repo={selectedRepo.name}
                                          value={field.state.value}
                                          onChange={field.handleChange}
                                        />
                                      )}
                                    </form.Field>
                                  </div>

                                  <form.Field name="path">
                                    {(field) => (
                                      <div className="flex flex-col gap-2">
                                        <label className="text-sm leading-none font-medium">
                                          {t("service.source.form.path.label")}
                                        </label>
                                        <Input
                                          placeholder={t(
                                            "service.source.form.path.placeholder",
                                          )}
                                          value={field.state.value}
                                          onChange={(e) =>
                                            field.handleChange(e.target.value)
                                          }
                                        />
                                        <p className="text-muted-foreground text-xs">
                                          {t("service.source.form.path.hint")}
                                        </p>
                                      </div>
                                    )}
                                  </form.Field>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }
              </form.Subscribe>
            </div>
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
