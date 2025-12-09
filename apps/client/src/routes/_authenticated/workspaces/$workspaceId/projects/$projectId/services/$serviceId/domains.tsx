import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { t } from "i18next";
import { MoreVertical } from "lucide-react";

import { CreateDomainDialog } from "@/components/create-domain-dialog";
import { DeleteDomainDialog } from "@/components/delete-domain-dialog";
import {
  UpdateDomainDialog,
  type DomainItem,
} from "@/components/update-domain-dialog";
import { Page } from "@/components/page";
import { DataTable } from "@/components/turboost-ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { graphql } from "@/gql";
import { DomainOrderField, OrderDirection } from "@/gql/graphql";
import { createConnectionSchema } from "@/utils/create-connection-schema";

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

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/services/$serviceId/domains",
)({
  component: RouteComponent,
  validateSearch: zodValidator(
    createConnectionSchema({
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

  const handleCreate = async (values: {
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

  const handleUpdate = async (
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

  const handleDelete = async (id: string) => {
    await deleteDomain({
      variables: { id },
    });
    setDeletingDomain(null);
  };

  const domains = data?.service?.domains?.edges.map((edge) => edge.node) || [];
  const ports = service?.ports ?? [];

  return (
    <Page
      title={t("domain.title")}
      description={t("domain.description")}
      actions={
        <CreateDomainDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          ports={ports}
          trigger={
            <Button disabled={ports.length === 0}>
              {t("domain.createDomain.title")}
            </Button>
          }
        />
      }
    >
      {ports.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          {t("domain.noPorts")}
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
        />
      )}

      <UpdateDomainDialog
        domain={editingDomain}
        ports={ports}
        onOpenChange={(open) => !open && setEditingDomain(null)}
        onSubmit={handleUpdate}
      />

      <DeleteDomainDialog
        domain={deletingDomain}
        deleting={deleting}
        onOpenChange={() => setDeletingDomain(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
