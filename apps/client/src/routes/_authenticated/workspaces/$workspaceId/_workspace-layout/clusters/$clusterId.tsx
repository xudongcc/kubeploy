import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { Page } from '@/components/page'
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { graphql } from '@/gql'

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
  }
`)

const UPDATE_CLUSTER_MUTATION = graphql(`
  mutation UpdateCluster($id: ID!, $input: UpdateClusterInput!) {
    updateCluster(id: $id, input: $input) {
      id
      ...ClusterDetail
    }
  }
`)

const REMOVE_CLUSTER_MUTATION = graphql(`
  mutation RemoveCluster($id: ID!) {
    removeCluster(id: $id) {
      id
    }
  }
`)

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/_workspace-layout/clusters/$clusterId',
)({
  component: RouteComponent,
  beforeLoad: async ({
    context: { apolloClient },
    params: { workspaceId, clusterId },
  }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_CLUSTER_QUERY,
        variables: { id: clusterId },
      })

      if (data?.cluster) {
        return { title: data.cluster.name, cluster: data.cluster }
      }
    } catch {}

    throw redirect({
      to: '/workspaces/$workspaceId/clusters',
      params: { workspaceId },
    })
  },
})

function RouteComponent() {
  const { workspaceId, clusterId } = Route.useParams()
  const navigate = Route.useNavigate()

  const { cluster } = Route.useRouteContext()

  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  const [updateCluster] = useMutation(UPDATE_CLUSTER_MUTATION)
  const [removeCluster, { loading: removing }] = useMutation(
    REMOVE_CLUSTER_MUTATION,
    {
      update(cache, result) {
        if (result.data?.removeCluster) {
          cache.evict({ id: cache.identify(result.data.removeCluster) })
          cache.gc()
        }
      },
    },
  )

  const form = useForm({
    defaultValues: {
      name: cluster?.name ?? '',
      server: cluster?.server ?? '',
      certificateAuthorityData: '',
      token: '',
    },
    onSubmit: async ({ value }) => {
      const input: {
        name?: string
        server?: string
        certificateAuthorityData?: string
        token?: string
      } = {
        name: value.name.trim(),
        server: value.server.trim(),
      }

      if (value.certificateAuthorityData.trim()) {
        input.certificateAuthorityData = value.certificateAuthorityData.trim()
      }

      if (value.token.trim()) {
        input.token = value.token.trim()
      }

      await updateCluster({
        variables: {
          id: clusterId,
          input,
        },
      })
    },
  })

  const handleDelete = async () => {
    await removeCluster({
      variables: { id: clusterId },
    })
    navigate({
      to: '/workspaces/$workspaceId/clusters',
      params: { workspaceId },
    })
  }

  if (!cluster) {
    return <div>Cluster not found</div>
  }

  const canDelete = deleteConfirmName === cluster.name

  return (
    <Page
      title={cluster.name}
      description={`Update your cluster connection settings.`}
    >
      <div className="flex flex-col gap-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Cluster Settings</CardTitle>
              <CardDescription>
                Update your cluster name and connection details.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'Cluster name is required' : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="My Cluster"
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
                name="server"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'Server URL is required' : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="server">Server URL</FieldLabel>
                    <Input
                      id="server"
                      placeholder="https://kubernetes.example.com:6443"
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

              <form.Field name="certificateAuthorityData">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="certificateAuthorityData">
                      Certificate Authority Data (leave empty to keep current)
                    </FieldLabel>
                    <Textarea
                      id="certificateAuthorityData"
                      placeholder="Base64 encoded CA certificate"
                      className="field-sizing-fixed overflow-x-auto whitespace-pre font-mono"
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
                    <FieldLabel htmlFor="token">
                      Service Account Token (leave empty to keep current)
                    </FieldLabel>
                    <Textarea
                      id="token"
                      placeholder="Service account token for authentication"
                      className="field-sizing-fixed overflow-x-auto whitespace-pre font-mono"
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </Field>
                )}
              </form.Field>
            </CardContent>
            <CardFooter>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </Card>
        </form>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Once you delete a cluster, there is no going back. This will
              permanently delete the cluster configuration and all associated
              projects.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Cluster</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Cluster</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the cluster <strong>{cluster.name}</strong> and all
                    associated projects.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Please type <strong>{cluster.name}</strong> to confirm.
                  </p>
                  <Input
                    placeholder={cluster.name}
                    value={deleteConfirmName}
                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmName('')}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!canDelete || removing}
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {removing ? 'Deleting...' : 'Delete Cluster'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </Page>
  )
}
