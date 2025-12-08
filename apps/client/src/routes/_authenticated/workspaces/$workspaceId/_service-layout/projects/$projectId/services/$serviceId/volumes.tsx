import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import dayjs from "dayjs";
import { CircleX, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Page } from "@/components/page";
import { DataTable } from "@/components/turboost-ui/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
    return { title: "Volumes" };
  },
});

type VolumeItem = {
  id: string;
  name: string;
  size: number;
  mountPath?: string | null;
  createdAt: string;
};

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

  const createForm = useForm({
    defaultValues: {
      name: "",
      size: 1,
      mountPath: "",
    },
    onSubmit: async ({ value }) => {
      await createVolume({
        variables: {
          input: {
            serviceId,
            name: value.name.trim(),
            size: value.size,
            mountPath: value.mountPath.trim() || undefined,
          },
        },
      });

      setCreateOpen(false);
      createForm.reset();
    },
  });

  const editForm = useForm({
    defaultValues: {
      name: "",
      size: 1,
      mountPath: "",
    },
    onSubmit: async ({ value }) => {
      if (!editingVolume) return;

      await updateVolume({
        variables: {
          id: editingVolume.id,
          input: {
            name: value.name.trim(),
            size: value.size,
            mountPath: value.mountPath.trim() || null,
          },
        },
      });

      setEditingVolume(null);
      editForm.reset();
    },
  });

  const handleCreateOpenChange = (isOpen: boolean) => {
    setCreateOpen(isOpen);
    if (!isOpen) {
      createForm.reset();
    }
  };

  const handleEditOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingVolume(null);
      editForm.reset();
    }
  };

  const handleEdit = (volume: VolumeItem) => {
    setEditingVolume(volume);
    editForm.setFieldValue("name", volume.name);
    editForm.setFieldValue("size", volume.size);
    editForm.setFieldValue("mountPath", volume.mountPath || "");
  };

  const handleDelete = async () => {
    if (!deletingVolume) return;

    await removeVolume({
      variables: { id: deletingVolume.id },
    });
    setDeletingVolume(null);
  };

  const volumes = data?.service?.volumes?.edges.map((edge) => edge.node) || [];

  return (
    <Page
      title="Volumes"
      description="Manage your service volumes."
      actions={
        <Dialog open={createOpen} onOpenChange={handleCreateOpenChange}>
          <DialogTrigger asChild>
            <Button>Add Volume</Button>
          </DialogTrigger>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                createForm.handleSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>Add Volume</DialogTitle>
                <DialogDescription>
                  Add a new persistent volume to your service.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <createForm.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? "Name is required" : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="data"
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
                </createForm.Field>

                <createForm.Field
                  name="size"
                  validators={{
                    onChange: ({ value }) =>
                      value <= 0 ? "Size must be greater than 0" : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="size">Size</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="size"
                          type="number"
                          min={1}
                          placeholder="1"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(
                              parseInt(e.target.value, 10) || 0,
                            )
                          }
                          onBlur={field.handleBlur}
                        />
                        <InputGroupAddon align="inline-end">GB</InputGroupAddon>
                      </InputGroup>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-sm">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                    </Field>
                  )}
                </createForm.Field>

                <createForm.Field name="mountPath">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="mountPath">Mount Path</FieldLabel>
                      <Input
                        id="mountPath"
                        placeholder="/data"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </createForm.Field>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCreateOpenChange(false)}
                >
                  Cancel
                </Button>
                <createForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Volume"}
                    </Button>
                  )}
                </createForm.Subscribe>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "size",
            header: "Size",
            cell: ({ row }) => {
              return `${row.original.size} GB`;
            },
          },
          {
            accessorKey: "mountPath",
            header: "Mount Path",
            cell: ({ row }) => {
              return row.original.mountPath || "-";
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
                    <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                      <Pencil className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingVolume(row.original)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]}
        data={volumes}
      />

      {/* Edit Dialog */}
      <Dialog open={editingVolume !== null} onOpenChange={handleEditOpenChange}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editForm.handleSubmit();
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit Volume</DialogTitle>
              <DialogDescription>
                Update the volume configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <editForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "Name is required" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="edit-name">Name</FieldLabel>
                    <Input
                      id="edit-name"
                      placeholder="data"
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
              </editForm.Field>

              <editForm.Field
                name="size"
                validators={{
                  onChange: ({ value }) =>
                    value <= 0 ? "Size must be greater than 0" : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="edit-size">Size</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="edit-size"
                        type="number"
                        min={1}
                        placeholder="1"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value, 10) || 0)
                        }
                        onBlur={field.handleBlur}
                      />
                      <InputGroupAddon align="inline-end">GB</InputGroupAddon>
                    </InputGroup>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </Field>
                )}
              </editForm.Field>

              <editForm.Field name="mountPath">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="edit-mountPath">Mount Path</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="edit-mountPath"
                        placeholder="/data"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.value && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            variant="ghost"
                            size="icon-xs"
                            aria-label="Clear"
                            onClick={() => field.handleChange("")}
                          >
                            <CircleX />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                  </Field>
                )}
              </editForm.Field>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleEditOpenChange(false)}
              >
                Cancel
              </Button>
              <editForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </editForm.Subscribe>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingVolume !== null}
        onOpenChange={(open) => !open && setDeletingVolume(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Volume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the volume{" "}
              <strong>{deletingVolume?.name}</strong>? This action cannot be
              undone and all data in the volume will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleDelete}>
              {removing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
