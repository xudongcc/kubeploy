import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { t } from "i18next";
import { Cpu, HardDrive, HelpCircle, MemoryStick, Server } from "lucide-react";

import {
  DeleteClusterDialog,
  type DeleteClusterItem,
} from "@/components/delete-cluster-dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ClusterNodeStatus } from "@/gql/graphql";
import { graphql } from "@/gql";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

const GET_CLUSTER_QUERY = graphql(`
  query GetCluster($id: ID!) {
    cluster(id: $id) {
      id
      ...ClusterDetail @unmask
    }
  }

  fragment ClusterDetail on Cluster {
    id
    name
    server
    createdAt
    nodes {
      name
      ip
      status
      allocatableCpuCores
      allocatableMemoryBytes
      allocatableDiskBytes
      capacityCpuCores
      capacityMemoryBytes
      capacityDiskBytes
    }
  }
`);

const UPDATE_CLUSTER_MUTATION = graphql(`
  mutation UpdateCluster($id: ID!, $input: UpdateClusterInput!) {
    updateCluster(id: $id, input: $input) {
      id
      ...ClusterDetail
    }
  }
`);

const DELETE_CLUSTER_MUTATION = graphql(`
  mutation DeleteCluster($id: ID!) {
    deleteCluster(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/clusters/$clusterId",
)({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      tab: z.enum(["overview", "settings"]).default("overview"),
    }),
  ),
  beforeLoad: async ({
    context: { apolloClient },
    params: { workspaceId, clusterId },
  }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_CLUSTER_QUERY,
        variables: { id: clusterId },
      });

      if (data?.cluster) {
        return { title: data.cluster.name, cluster: data.cluster };
      }
    } catch {}

    throw redirect({
      to: "/workspaces/$workspaceId/clusters",
      params: { workspaceId },
    });
  },
});

function RouteComponent() {
  const { tab } = Route.useSearch();
  const { workspaceId, clusterId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { cluster } = Route.useRouteContext();

  const [deletingCluster, setDeletingCluster] =
    useState<DeleteClusterItem | null>(null);

  const [updateCluster] = useMutation(UPDATE_CLUSTER_MUTATION);
  const [deleteCluster, { loading: deleting }] = useMutation(
    DELETE_CLUSTER_MUTATION,
    {
      update(cache, result) {
        if (result.data?.deleteCluster) {
          cache.evict({ id: cache.identify(result.data.deleteCluster) });
          cache.gc();
        }
      },
    },
  );

  const form = useForm({
    defaultValues: {
      name: cluster?.name ?? "",
      server: cluster?.server ?? "",
      certificateAuthorityData: "",
      token: "",
    },
    onSubmit: async ({ value }) => {
      const input: {
        name?: string;
        server?: string;
        certificateAuthorityData?: string;
        token?: string;
      } = {
        name: value.name.trim(),
        server: value.server.trim(),
      };

      if (value.certificateAuthorityData.trim()) {
        input.certificateAuthorityData = value.certificateAuthorityData.trim();
      }

      if (value.token.trim()) {
        input.token = value.token.trim();
      }

      await updateCluster({
        variables: {
          id: clusterId,
          input,
        },
      });
    },
  });

  const handleDelete = async (id: string) => {
    await deleteCluster({
      variables: { id },
    });
    navigate({
      to: "/workspaces/$workspaceId/clusters",
      params: { workspaceId },
    });
  };

  if (!cluster) {
    return <div>{t("cluster.notFound")}</div>;
  }

  const nodes = cluster.nodes ?? [];
  const activeNodeCount = nodes.filter(
    (node) => node.status === ClusterNodeStatus.ACTIVE,
  ).length;
  const totalCapacityCpu = nodes.reduce(
    (sum, node) => sum + node.capacityCpuCores,
    0,
  );
  const totalReservedCpu = nodes.reduce(
    (sum, node) => sum + (node.capacityCpuCores - node.allocatableCpuCores),
    0,
  );
  const totalCapacityMemory = nodes.reduce(
    (sum, node) => sum + node.capacityMemoryBytes,
    0,
  );
  const totalReservedMemory = nodes.reduce(
    (sum, node) =>
      sum + (node.capacityMemoryBytes - node.allocatableMemoryBytes),
    0,
  );
  const totalCapacityDisk = nodes.reduce(
    (sum, node) => sum + node.capacityDiskBytes,
    0,
  );
  const totalReservedDisk = nodes.reduce(
    (sum, node) => sum + (node.capacityDiskBytes - node.allocatableDiskBytes),
    0,
  );

  const formatCpu = (cores: number) => {
    if (Number.isInteger(cores)) return cores.toString();
    const rounded = Math.round(cores * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 ** 4) return `${(bytes / 1024 ** 4).toFixed(2)}TB`;
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)}GB`;
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)}MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    return `${bytes}B`;
  };

  return (
    <Page title={cluster.name} description={t("cluster.detail.description")}>
      <Tabs
        defaultValue={tab}
        onValueChange={(value) => {
          navigate({
            to: "/workspaces/$workspaceId/clusters/$clusterId",
            params: { workspaceId, clusterId },
            search: {
              tab:
                value === "overview" || value === "settings"
                  ? value
                  : "overview",
            },
          });
        }}
      >
        <TabsList>
          <TabsTrigger value="overview">
            {t("cluster.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {t("cluster.tabs.settings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("cluster.overview.nodes")}
                </CardTitle>
                <Server className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeNodeCount} / {nodes.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("cluster.overview.cpu")}
                </CardTitle>
                <Cpu className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCpu(totalReservedCpu)} / {formatCpu(totalCapacityCpu)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("cluster.overview.memory")}
                </CardTitle>
                <MemoryStick className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBytes(totalReservedMemory)} /{" "}
                  {formatBytes(totalCapacityMemory)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("cluster.overview.disk")}
                </CardTitle>
                <HardDrive className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBytes(totalReservedDisk)} /{" "}
                  {formatBytes(totalCapacityDisk)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
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
                  <CardTitle>{t("cluster.settings.title")}</CardTitle>
                  <CardDescription>
                    {t("cluster.settings.description")}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        !value.trim()
                          ? t("cluster.form.name.required")
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="name">
                          {t("cluster.form.name.label")}
                        </FieldLabel>
                        <Input
                          id="name"
                          placeholder={t("cluster.form.name.placeholder")}
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
                    name="server"
                    validators={{
                      onChange: ({ value }) =>
                        !value.trim()
                          ? t("cluster.form.server.required")
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="server">
                          {t("cluster.form.server.label")}
                        </FieldLabel>
                        <Input
                          id="server"
                          placeholder={t("cluster.form.server.placeholder")}
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

                  <form.Field name="certificateAuthorityData">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="certificateAuthorityData">
                          {t(
                            "cluster.form.certificateAuthorityData.labelKeepCurrent",
                          )}
                        </FieldLabel>
                        <Textarea
                          id="certificateAuthorityData"
                          placeholder={t(
                            "cluster.form.certificateAuthorityData.placeholder",
                          )}
                          className="field-sizing-fixed overflow-x-auto font-mono whitespace-pre"
                          rows={4}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="token">
                    {(field) => (
                      <Field>
                        <div className="flex items-center gap-1">
                          <FieldLabel htmlFor="token">
                            {t("cluster.form.token.labelKeepCurrent")}
                          </FieldLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <HelpCircle className="h-4 w-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[520px]" side="right">
                              <div className="space-y-3">
                                <h4 className="font-medium">
                                  {t("cluster.form.token.help.title")}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  {t("cluster.form.token.help.description")}
                                </p>
                                <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">
                                  {`# Create service account
kubectl create serviceaccount kubeploy -n kube-system

# Bind cluster-admin role
kubectl create clusterrolebinding kubeploy-admin \\
  --clusterrole=cluster-admin \\
  --serviceaccount=kube-system:kubeploy

# Create token
kubectl create token kubeploy -n kube-system --duration=8760h`}
                                </pre>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Textarea
                          id="token"
                          placeholder={t("cluster.form.token.placeholder")}
                          className="field-sizing-fixed overflow-x-auto font-mono whitespace-pre"
                          rows={4}
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
                      <Button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                      >
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
                  {t("cluster.settings.dangerZone.title")}
                </CardTitle>
                <CardDescription>
                  {t("cluster.settings.dangerZone.description")}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="destructive"
                  onClick={() => setDeletingCluster(cluster)}
                >
                  {t("cluster.settings.dangerZone.deleteButton")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <DeleteClusterDialog
        cluster={deletingCluster}
        deleting={deleting}
        onOpenChange={() => setDeletingCluster(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
