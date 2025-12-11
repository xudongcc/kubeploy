import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { CreateServiceDialog } from "@/components/create-service-dialog";
import { Link } from "@/components/link";
import { Page } from "@/components/page";
import { ServiceStatusBadge } from "@/components/service-status-badge";
import { DataTable } from "@/components/turboost-ui/data-table";
import { Button } from "@/components/ui/button";
import { graphql } from "@/gql";
import { OrderDirection, ServiceOrderField } from "@/gql/graphql";
import {
  createConnectionSearchSchema,
  getNextPageSearch,
  getPreviousPageSearch,
} from "@/lib/connection-search";

const GET_SERVICES_QUERY = graphql(`
  query GetServices(
    $projectId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: ServiceOrder
    $query: String
  ) {
    project(id: $projectId) {
      id
      services(
        after: $after
        before: $before
        first: $first
        last: $last
        orderBy: $orderBy
        query: $query
      ) {
        edges {
          node {
            id
            ...ServiceItem @unmask
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

  fragment ServiceItem on Service {
    id
    name
    status
    createdAt
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/projects/$projectId/_project_layout/services/",
)({
  component: RouteComponent,
  validateSearch: zodValidator(
    createConnectionSearchSchema({
      pageSize: 20,
      orderField: ServiceOrderField,
      defaultOrderField: ServiceOrderField.CREATED_AT,
      defaultOrderDirection: OrderDirection.DESC,
    }),
  ),
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useTranslation();

  const [createOpen, setCreateOpen] = useState(false);

  const { data, refetch } = useQuery(GET_SERVICES_QUERY, {
    variables: { projectId, ...search },
  });

  const handleCreateSuccess = (serviceId: string) => {
    refetch();
    navigate({
      to: "/workspaces/$workspaceId/projects/$projectId/services/$serviceId",
      params: { workspaceId, projectId, serviceId },
    });
  };

  return (
    <Page
      title={t("service.title")}
      description={t("service.description")}
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          {t("service.createService")}
        </Button>
      }
    >
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: t("common.name"),
            cell: ({ row }) => {
              return (
                <Link
                  to="/workspaces/$workspaceId/projects/$projectId/services/$serviceId"
                  params={{
                    workspaceId,
                    projectId,
                    serviceId: row.original.id,
                  }}
                >
                  {row.original.name}
                </Link>
              );
            },
          },
          {
            accessorKey: "status",
            header: t("common.status"),
            cell: ({ row }) => (
              <ServiceStatusBadge status={row.original.status} />
            ),
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
        ]}
        data={data?.project?.services.edges.map((edge) => edge.node) || []}
        pagination={{
          hasPreviousPage:
            data?.project?.services?.pageInfo.hasPreviousPage || false,
          hasNextPage: data?.project?.services?.pageInfo.hasNextPage || false,
          onPreviousPage: () => {
            navigate({
              to: "/workspaces/$workspaceId/projects/$projectId/services",
              search: (prev) =>
                getPreviousPageSearch(
                  prev,
                  data?.project?.services?.pageInfo
                    ? {
                        startCursor:
                          data.project.services.pageInfo.startCursor ??
                          undefined,
                        endCursor:
                          data.project.services.pageInfo.endCursor ?? undefined,
                        hasNextPage: data.project.services.pageInfo.hasNextPage,
                        hasPreviousPage:
                          data.project.services.pageInfo.hasPreviousPage,
                      }
                    : undefined,
                ),
            });
          },
          onNextPage: () => {
            navigate({
              to: "/workspaces/$workspaceId/projects/$projectId/services",
              search: (prev) =>
                getNextPageSearch(
                  prev,
                  data?.project?.services?.pageInfo
                    ? {
                        startCursor:
                          data.project.services.pageInfo.startCursor ??
                          undefined,
                        endCursor:
                          data.project.services.pageInfo.endCursor ?? undefined,
                        hasNextPage: data.project.services.pageInfo.hasNextPage,
                        hasPreviousPage:
                          data.project.services.pageInfo.hasPreviousPage,
                      }
                    : undefined,
                ),
            });
          },
        }}
      />

      <CreateServiceDialog
        projectId={projectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />
    </Page>
  );
}
