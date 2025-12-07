import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import dayjs from 'dayjs'
import { Trash2 } from 'lucide-react'

import { Page } from '@/components/page'
import { DataTable } from '@/components/turboost-ui/data-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { graphql } from '@/gql'
import { OrderDirection, VolumeOrderField } from '@/gql/graphql'
import { createConnectionSchema } from '@/utils/create-connection-schema'

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
    storageClass
    createdAt
  }
`)

const volumeConnectionSchema = createConnectionSchema({
  pageSize: 20,
  orderField: VolumeOrderField,
  defaultOrderField: VolumeOrderField.CREATED_AT,
  defaultOrderDirection: OrderDirection.DESC,
})

const CREATE_VOLUME_MUTATION = graphql(`
  mutation CreateVolume($input: CreateVolumeInput!) {
    createVolume(input: $input) {
      id
      ...VolumeItem
    }
  }
`)

const REMOVE_VOLUME_MUTATION = graphql(`
  mutation RemoveVolume($id: ID!) {
    removeVolume(id: $id) {
      id
    }
  }
`)

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/volumes',
)({
  component: RouteComponent,
  validateSearch: zodValidator(volumeConnectionSchema),
  beforeLoad: () => {
    return { title: 'Volumes' }
  },
})

function RouteComponent() {
  const { serviceId } = Route.useParams()
  const search = Route.useSearch()

  const [open, setOpen] = useState(false)
  const [deletingVolumeId, setDeletingVolumeId] = useState<string | null>(null)

  const { data, refetch } = useQuery(GET_VOLUMES_QUERY, {
    variables: { serviceId, ...search },
  })

  const [createVolume] = useMutation(CREATE_VOLUME_MUTATION, {
    onCompleted: () => {
      refetch()
    },
  })

  const [removeVolume, { loading: removing }] = useMutation(
    REMOVE_VOLUME_MUTATION,
    {
      update(cache, result) {
        if (result.data?.removeVolume) {
          cache.evict({ id: cache.identify(result.data.removeVolume) })
          cache.gc()
        }
      },
    },
  )

  const form = useForm({
    defaultValues: {
      name: '',
      size: '1Gi',
      storageClass: '',
    },
    onSubmit: async ({ value }) => {
      await createVolume({
        variables: {
          input: {
            serviceId,
            name: value.name.trim(),
            size: value.size.trim(),
            storageClass: value.storageClass.trim() || undefined,
          },
        },
      })

      setOpen(false)
      form.reset()
    },
  })

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  const handleDelete = async (volumeId: string) => {
    await removeVolume({
      variables: { id: volumeId },
    })
    setDeletingVolumeId(null)
  }

  const volumes = data?.service?.volumes?.edges.map((edge) => edge.node) || []

  return (
    <Page
      title="Volumes"
      description="Manage your service volumes."
      actions={
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Add Volume</Button>
          </DialogTrigger>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <DialogHeader>
                <DialogTitle>Add Volume</DialogTitle>
                <DialogDescription>
                  Add a new persistent volume to your service.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? 'Name is required' : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="my-volume"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </Field>
                  )}
                </form.Field>

                <form.Field
                  name="size"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? 'Size is required' : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="size">Size</FieldLabel>
                      <Input
                        id="size"
                        placeholder="1Gi"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </Field>
                  )}
                </form.Field>

                <form.Field name="storageClass">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="storageClass">
                        Storage Class (optional)
                      </FieldLabel>
                      <Input
                        id="storageClass"
                        placeholder="standard"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Volume'}
                    </Button>
                  )}
                </form.Subscribe>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <DataTable
        columns={[
          {
            accessorKey: 'name',
            header: 'Name',
          },
          {
            accessorKey: 'size',
            header: 'Size',
          },
          {
            accessorKey: 'storageClass',
            header: 'Storage Class',
            cell: ({ row }) => {
              return row.original.storageClass || '-'
            },
          },
          {
            accessorKey: 'createdAt',
            header: 'Created Date',
            cell: ({ row }) => {
              return dayjs(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
              return (
                <AlertDialog
                  open={deletingVolumeId === row.original.id}
                  onOpenChange={(open) =>
                    setDeletingVolumeId(open ? row.original.id : null)
                  }
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Volume</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the volume{' '}
                        <strong>{row.original.name}</strong>? This action cannot
                        be undone and all data in the volume will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={removing}
                        onClick={() => handleDelete(row.original.id)}
                      >
                        {removing ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )
            },
          },
        ]}
        data={volumes}
      />
    </Page>
  )
}
