import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { t } from "i18next";
import { MoreVertical } from "lucide-react";

import { CreateVolumeDialog } from "@/components/create-volume-dialog";
import { DeleteVolumeDialog } from "@/components/delete-volume-dialog";
import {
  UpdateVolumeDialog,
  type VolumeItem,
} from "@/components/update-volume-dialog";
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
import { OrderDirection, VolumeOrderField } from "@/gql/graphql";
import { createConnectionSchema } from "@/utils/create-connection-schema";

const GET_VOLUMES_QUERY = graphql(`
  query GetVolumes(
    $serviceId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: VolumeOrder
  ) {
    service(id: $serviceId) {
      volumes(
        after: $after
        before: $before
        first: $first
        last: $last
        orderBy: $orderBy
      ) {
        edges {
          node {
            id
            ...VolumeItem @unmask
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

  fragment VolumeItem on Volume {
    id
    name
    size
    mountPath
    createdAt
  }
`);

const volumeConnectionSchema = createConnectionSchema({
  pageSize: 20,
  orderField: VolumeOrderField,
  defaultOrderField: VolumeOrderField.CREATED_AT,
  defaultOrderDirection: OrderDirection.DESC,
});

const CREATE_VOLUME_MUTATION = graphql(`
  mutation CreateVolume($input: CreateVolumeInput!) {
    createVolume(input: $input) {
      id
      ...VolumeItem
    }
  }
`);

const UPDATE_VOLUME_MUTATION = graphql(`
  mutation UpdateVolume($id: ID!, $input: UpdateVolumeInput!) {
    updateVolume(id: $id, input: $input) {
      id
      ...VolumeItem
    }
  }
`);

const REMOVE_VOLUME_MUTATION = graphql(`
  mutation RemoveVolume($id: ID!) {
    removeVolume(id: $id) {
      id
    }
  }
`);

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/volumes",
)({
  component: RouteComponent,
  validateSearch: zodValidator(volumeConnectionSchema),
  beforeLoad: () => {
    return { title: null };
  },
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const search = Route.useSearch();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingVolume, setEditingVolume] = useState<VolumeItem | null>(null);
  const [deletingVolume, setDeletingVolume] = useState<VolumeItem | null>(null);

  const { data, refetch } = useQuery(GET_VOLUMES_QUERY, {
    variables: { serviceId, ...search },
  });

  const [createVolume] = useMutation(CREATE_VOLUME_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const [updateVolume] = useMutation(UPDATE_VOLUME_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const [removeVolume, { loading: removing }] = useMutation(
    REMOVE_VOLUME_MUTATION,
    {
      update(cache, result) {
        if (result.data?.removeVolume) {
          cache.evict({ id: cache.identify(result.data.removeVolume) });
          cache.gc();
        }
      },
    },
  );

  const handleCreate = async (values: {
    name: string;
    size: number;
    mountPath?: string;
  }) => {
    await createVolume({
      variables: {
        input: {
          serviceId,
          name: values.name,
          size: values.size,
          mountPath: values.mountPath,
        },
      },
    });
    setCreateOpen(false);
  };

  const handleUpdate = async (
    id: string,
    values: {
      name: string;
      size: number;
      mountPath: string | null;
    },
  ) => {
    await updateVolume({
      variables: {
        id,
        input: values,
      },
    });
    setEditingVolume(null);
  };

  const handleDelete = async (id: string) => {
    await removeVolume({
      variables: { id },
    });
    setDeletingVolume(null);
  };

  const volumes = data?.service?.volumes?.edges.map((edge) => edge.node) || [];

  return (
    <Page
      title={t("volume.title")}
      description={t("volume.description")}
      actions={
        <CreateVolumeDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          trigger={<Button>{t("volume.createVolume.title")}</Button>}
        />
      }
    >
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: t("common.name"),
          },
          {
            accessorKey: "size",
            header: t("volume.form.size.label"),
            cell: ({ row }) => {
              return `${row.original.size} GB`;
            },
          },
          {
            accessorKey: "mountPath",
            header: t("volume.form.mountPath.label"),
            cell: ({ row }) => {
              return row.original.mountPath || "-";
            },
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
                      onClick={() => setEditingVolume(row.original)}
                    >
                      {t("common.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingVolume(row.original)}
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
        data={volumes}
      />

      <UpdateVolumeDialog
        volume={editingVolume}
        onOpenChange={(open) => !open && setEditingVolume(null)}
        onSubmit={handleUpdate}
      />

      <DeleteVolumeDialog
        volume={deletingVolume}
        deleting={removing}
        onOpenChange={() => setDeletingVolume(null)}
        onConfirm={handleDelete}
      />
    </Page>
  );
}
