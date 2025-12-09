import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { t } from "i18next";

import { CreateClusterDialog } from "@/components/create-cluster-dialog";
import { Link } from "@/components/link";
import { Page } from "@/components/page";
import { DataTable } from "@/components/turboost-ui/data-table";
import { Button } from "@/components/ui/button";
import { graphql } from "@/gql";
import { ClusterOrderField, OrderDirection } from "@/gql/graphql";
import { createConnectionSchema } from "@/utils/create-connection-schema";

const GET_CLUSTERS_QUERY = graphql(`
  query GetClusters(
    $workspaceId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: ClusterOrder
    $query: String
  ) {
    workspace(id: $workspaceId) {
      clusters(
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
            ...ClusterItem @unmask
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

  fragment ClusterItem on Cluster {
    id
    name
    server
    createdAt
  }
`);

const CREATE_CLUSTER_MUTATION = graphql(`
  mutation CreateCluster($input: CreateClusterInput!) {
    createCluster(input: $input) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_workspace-layout/clusters/",
)({
  component: RouteComponent,
  validateSearch: zodValidator(
    createConnectionSchema({
      pageSize: 20,
      orderField: ClusterOrderField,
      defaultOrderField: ClusterOrderField.CREATED_AT,
      defaultOrderDirection: OrderDirection.DESC,
    }),
  ),
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const [createOpen, setCreateOpen] = useState(false);

  const { data } = useQuery(GET_CLUSTERS_QUERY, {
    variables: {
      workspaceId,
      ...search,
    },
  });

  const clusters =
    data?.workspace?.clusters?.edges.map((edge) => edge.node) || [];

  const [createCluster] = useMutation(CREATE_CLUSTER_MUTATION);

  const handleCreate = async (values: {
    name: string;
    server: string;
    certificateAuthorityData: string;
    token: string;
  }) => {
    const { data } = await createCluster({
      variables: {
        input: {
          workspaceId,
          name: values.name,
          server: values.server,
          certificateAuthorityData: values.certificateAuthorityData,
          token: values.token,
        },
      },
    });

    if (data?.createCluster.id) {
      setCreateOpen(false);
      navigate({
        to: "/workspaces/$workspaceId/clusters/$clusterId",
        params: { workspaceId, clusterId: data.createCluster.id },
      });
    }
  };

  return (
    <Page
      title={t("cluster.title")}
      description={t("cluster.description")}
      actions={
        <CreateClusterDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          trigger={<Button>{t("cluster.createCluster.title")}</Button>}
        />
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
                  to={`/workspaces/$workspaceId/clusters/$clusterId`}
                  params={{ workspaceId, clusterId: row.original.id }}
                >
                  {row.original.name}
                </Link>
              );
            },
          },
          {
            accessorKey: "server",
            header: t("cluster.form.server.label"),
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
        data={clusters}
      />
    </Page>
  );
}
