import { useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";

import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { Link } from "@/components/link";

import { Page } from "@/components/page";
import { DataTable } from "@/components/turboost-ui/data-table";
import { Button } from "@/components/ui/button";
import { graphql } from "@/gql";
import { OrderDirection, ServiceOrderField } from "@/gql/graphql";
import { createConnectionSchema } from "@/utils/create-connection-schema";

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
    image
    replicas
    ports
    createdAt
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId/services/",
)({
  component: RouteComponent,
  validateSearch: zodValidator(
    createConnectionSchema({
      pageSize: 20,
      orderField: ServiceOrderField,
      defaultOrderField: ServiceOrderField.CREATED_AT,
      defaultOrderDirection: OrderDirection.DESC,
    }),
  ),
});

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams();
  const search = Route.useSearch();

  const { data } = useQuery(GET_SERVICES_QUERY, {
    variables: { projectId, ...search },
  });

  return (
    <Page
      title="Services"
      description="Create and manage your services."
      actions={
        <Button asChild>
          <Link
            to="/workspaces/$workspaceId/projects/$projectId/services/create"
            params={{ workspaceId, projectId }}
          >
            Create Service
          </Link>
        </Button>
      }
    >
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Name",
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
            accessorKey: "image",
            header: "Image",
          },
          {
            accessorKey: "replicas",
            header: "Replicas",
          },
          {
            accessorKey: "ports",
            header: "Ports",
            cell: ({ row }) => {
              return row.original.ports?.join(", ") || "-";
            },
          },
          {
            accessorKey: "createdAt",
            header: "Created Date",
            cell: ({ row }) => {
              return dayjs(row.original.createdAt).format(
                "YYYY-MM-DD HH:mm:ss",
              );
            },
          },
        ]}
        data={data?.project?.services.edges.map((edge) => edge.node) || []}
      />
    </Page>
  );
}
