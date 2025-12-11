import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { DomainItem } from "@/components/update-domain-dialog";
import { CreateDomainDialog } from "@/components/create-domain-dialog";
import { DeleteDomainDialog } from "@/components/delete-domain-dialog";
import { UpdateDomainDialog } from "@/components/update-domain-dialog";
import { Page } from "@/components/page";
import { DataTable } from "@/components/turboost-ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { graphql } from "@/gql";
import {
  DomainOrderField,
  OrderDirection,
  ServicePortProtocol,
} from "@/gql/graphql";
import {
  createConnectionSearchSchema,
  getNextPageSearch,
  getPreviousPageSearch,
} from "@/lib/connection-search";

const GET_DOMAINS_QUERY = graphql(`
  query GetDomains(
    $serviceId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: DomainOrder
  ) {
    service(id: $serviceId) {
      id
      domains(
        after: $after
        before: $before
        first: $first
        last: $last
        orderBy: $orderBy
      ) {
        edges {
          node {
            id
            ...DomainItem @unmask
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }

  fragment DomainItem on Domain {
    id
    host
    path
    servicePort
    createdAt
  }
`);

const CREATE_DOMAIN_MUTATION = graphql(`
  mutation CreateDomain($input: CreateDomainInput!) {
    createDomain(input: $input) {
      id
      ...DomainItem
    }
  }
`);

const UPDATE_DOMAIN_MUTATION = graphql(`
  mutation UpdateDomain($id: ID!, $input: UpdateDomainInput!) {
    updateDomain(id: $id, input: $input) {
      id
      ...DomainItem
    }
  }
`);

const DELETE_DOMAIN_MUTATION = graphql(`
  mutation DeleteDomain($id: ID!) {
    deleteDomain(id: $id) {
      id
    }
  }
`);

const UPDATE_SERVICE_MUTATION = graphql(`
  mutation UpdateServicePorts($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      ...ServiceDetail
    }
  }
`);

interface ServicePort {
  port: number;
  protocol: ServicePortProtocol;
}

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/network",
)({
  component: RouteComponent,
  validateSearch: zodValidator(
    createConnectionSearchSchema({
      pageSize: 20,
      orderField: DomainOrderField,
      defaultOrderField: DomainOrderField.CREATED_AT,
      defaultOrderDirection: OrderDirection.DESC,
    }),
  ),
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const { service } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useTranslation();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainItem | null>(null);
  const [deletingDomain, setDeletingDomain] = useState<DomainItem | null>(null);

  const { data, refetch } = useQuery(GET_DOMAINS_QUERY, {
    variables: { serviceId, ...search },
  });

  const [createDomain] = useMutation(CREATE_DOMAIN_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const [updateDomain] = useMutation(UPDATE_DOMAIN_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const [deleteDomain, { loading: deleting }] = useMutation(
    DELETE_DOMAIN_MUTATION,
    {
      update(cache, result) {
        if (result.data?.deleteDomain) {
          cache.evict({ id: cache.identify(result.data.deleteDomain) });
          cache.gc();
        }
      },
    },
  );

  const [updateService] = useMutation(UPDATE_SERVICE_MUTATION);

  const form = useForm({
    defaultValues: {
      ports: service.ports as ServicePort[],
    },
    onSubmit: async ({ value }) => {
      await updateService({
        variables: {
          id: serviceId,
          input: {
            ports: value.ports.filter((p) => p.port > 0),
          },
        },
      });
    },
  });

  const handleCreateDomain = async (values: {
    host: string;
    path: string;
    servicePort: number;
  }) => {
    await createDomain({
      variables: {
        input: {
          serviceId,
          host: values.host,
          path: values.path,
          servicePort: values.servicePort,
        },
      },
    });
    setCreateOpen(false);
  };

  const handleUpdateDomain = async (
    id: string,
    values: {
      host: string;
      path: string;
      servicePort: number;
    },
  ) => {
    await updateDomain({
      variables: {
        id,
        input: values,
      },
    });
    setEditingDomain(null);
  };

  const handleDeleteDomain = async (id: string) => {
    await deleteDomain({
      variables: { id },
    });
    setDeletingDomain(null);
  };

  const domains = data?.service?.domains.edges.map((edge) => edge.node) ?? [];
  const validPorts = useMemo(
    () => form.state.values.ports.filter((p) => p.port > 0),
    [form.state.values.ports],
  );

  return (
    <Page title={t("network.title")} description={t("network.description")}>
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
              <CardTitle>{t("network.ports.title")}</CardTitle>
              <CardDescription>
                {t("network.ports.description")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form.Field name="ports" mode="array">
                {(field) => (
                  <div className="flex flex-col gap-3">
                    {field.state.value.length === 0 ? (
                      <p className="text-muted-foreground py-4 text-center text-sm">
                        {t("network.ports.empty")}
                      </p>
                    ) : (
                      <>
                        <div className="text-muted-foreground grid grid-cols-[1fr_1fr_auto] gap-2 text-sm font-medium">
                          <span>{t("network.ports.form.port")}</span>
                          <span>{t("network.ports.form.protocol")}</span>
                          <span className="w-9" />
                        </div>
                        {field.state.value.map((_, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[1fr_1fr_auto] gap-2"
                          >
                            <form.Field name={`ports[${index}].port`}>
                              {(subField) => (
                                <Input
                                  type="number"
                                  min={1}
                                  max={65535}
                                  placeholder={t(
                                    "network.ports.form.portPlaceholder",
                                  )}
                                  value={subField.state.value || ""}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      parseInt(e.target.value, 10) || 0,
                                    )
                                  }
                                />
                              )}
                            </form.Field>
                            <form.Field name={`ports[${index}].protocol`}>
                              {(subField) => (
                                <Select
                                  value={subField.state.value}
                                  onValueChange={(value) =>
                                    subField.handleChange(
                                      value as ServicePortProtocol,
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value={ServicePortProtocol.HTTP}
                                    >
                                      HTTP
                                    </SelectItem>
                                    <SelectItem value={ServicePortProtocol.TCP}>
                                      TCP
                                    </SelectItem>
                                    <SelectItem value={ServicePortProtocol.UDP}>
                                      UDP
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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
                      onClick={() =>
                        field.pushValue({
                          port: 0,
                          protocol: ServicePortProtocol.HTTP,
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("network.ports.addPort")}
                    </Button>
                  </div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardTitle>{t("network.domains.title")}</CardTitle>
              <CardDescription>
                {t("network.domains.description")}
              </CardDescription>
            </div>
            <CreateDomainDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              onSubmit={handleCreateDomain}
              ports={validPorts.map((p) => p.port)}
              trigger={
                <Button disabled={validPorts.length === 0}>
                  {t("domain.createDomain.title")}
                </Button>
              }
            />
          </CardHeader>

          <CardContent>
            {validPorts.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                {t("network.domains.noPorts")}
              </div>
            ) : domains.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                {t("network.domains.empty")}
              </div>
            ) : (
              <DataTable
                columns={[
                  {
                    accessorKey: "host",
                    header: t("domain.form.host.label"),
                    cell: ({ row }) => {
                      const url = `https://${row.original.host}${row.original.path}`;
                      return (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {row.original.host}
                        </a>
                      );
                    },
                  },
                  {
                    accessorKey: "path",
                    header: t("domain.form.path.label"),
                  },
                  {
                    accessorKey: "servicePort",
                    header: t("domain.form.port.label"),
                  },
                  {
                    accessorKey: "createdAt",
                    header: t("common.createdAt"),
                    cell: ({ row }) => {
                      return dayjs(row.original.createdAt).format(
                        "YYYY-MM-DD HH:mm:ss",
                      );
                    },
                  },
                  {
                    id: "actions",
                    header: "",
                    cell: ({ row }) => {
                      return (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:bg-transparent"
                            >
                              <MoreVertical className="text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingDomain(row.original)}
                            >
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingDomain(row.original)}
                              className="text-destructive focus:text-destructive"
                            >
                              {t("common.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    },
                  },
                ]}
                data={domains}
                pagination={{
                  hasPreviousPage:
                    data?.service?.domains?.pageInfo.hasPreviousPage || false,
                  hasNextPage:
                    data?.service?.domains?.pageInfo.hasNextPage || false,
                  onPreviousPage: () => {
                    navigate({
                      to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/network",
                      search: (prev) =>
                        getPreviousPageSearch(
                          prev,
                          data?.service?.domains?.pageInfo
                            ? {
                                startCursor:
                                  data.service.domains.pageInfo.startCursor ??
                                  undefined,
                                endCursor:
                                  data.service.domains.pageInfo.endCursor ??
                                  undefined,
                                hasNextPage:
                                  data.service.domains.pageInfo.hasNextPage,
                                hasPreviousPage:
                                  data.service.domains.pageInfo.hasPreviousPage,
                              }
                            : undefined,
                        ),
                    });
                  },
                  onNextPage: () => {
                    navigate({
                      to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId/network",
                      search: (prev) =>
                        getNextPageSearch(
                          prev,
                          data?.service?.domains?.pageInfo
                            ? {
                                startCursor:
                                  data.service.domains.pageInfo.startCursor ??
                                  undefined,
                                endCursor:
                                  data.service.domains.pageInfo.endCursor ??
                                  undefined,
                                hasNextPage:
                                  data.service.domains.pageInfo.hasNextPage,
                                hasPreviousPage:
                                  data.service.domains.pageInfo.hasPreviousPage,
                              }
                            : undefined,
                        ),
                    });
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <UpdateDomainDialog
        domain={editingDomain}
        ports={validPorts.map((p) => p.port)}
        onOpenChange={(open) => !open && setEditingDomain(null)}
        onSubmit={handleUpdateDomain}
      />

      <DeleteDomainDialog
        domain={deletingDomain}
        deleting={deleting}
        onOpenChange={() => setDeletingDomain(null)}
        onConfirm={handleDeleteDomain}
      />
    </Page>
  );
}
