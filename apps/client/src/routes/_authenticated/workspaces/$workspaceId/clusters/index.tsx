import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import dayjs from 'dayjs'
import { HelpCircle } from 'lucide-react'

import { Link } from '@/components/link'
import { Page } from '@/components/page'
import { DataTable } from '@/components/turboost-ui/data-table'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { graphql } from '@/gql'
import { ClusterOrderField, OrderDirection } from '@/gql/graphql'
import { createConnectionSchema } from '@/utils/create-connection-schema'

const GET_CLUSTERS_QUERY = graphql(`
  query GetClusters(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: ClusterOrder
    $query: String
  ) {
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

  fragment ClusterItem on Cluster {
    id
    name
    server
    createdAt
  }
`)

const CREATE_CLUSTER_MUTATION = graphql(`
  mutation CreateCluster($input: CreateClusterInput!) {
    createCluster(input: $input) {
      id
    }
  }
`)

const clusterConnectionSchema = createConnectionSchema({
  pageSize: 20,
  orderField: ClusterOrderField,
  defaultOrderField: ClusterOrderField.CREATED_AT,
  defaultOrderDirection: OrderDirection.DESC,
})

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/clusters/',
)({
  component: RouteComponent,
  validateSearch: zodValidator(clusterConnectionSchema),
  beforeLoad: () => {
    return { title: 'Clusters' }
  },
})

function RouteComponent() {
  const { workspaceId } = Route.useParams()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const [open, setOpen] = useState(false)

  const { data } = useQuery(GET_CLUSTERS_QUERY, { variables: search })

  const [createCluster] = useMutation(CREATE_CLUSTER_MUTATION)

  const form = useForm({
    defaultValues: {
      name: '',
      server: '',
      certificateAuthorityData: '',
      token: '',
    },
    onSubmit: async ({ value }) => {
      const { data } = await createCluster({
        variables: {
          input: {
            workspaceId,
            name: value.name.trim(),
            server: value.server.trim(),
            certificateAuthorityData: value.certificateAuthorityData.trim(),
            token: value.token.trim(),
          },
        },
      })

      if (data?.createCluster.id) {
        setOpen(false)
        form.reset()
        navigate({
          to: '/workspaces/$workspaceId/clusters/$clusterId',
          params: { workspaceId, clusterId: data.createCluster.id },
        })
      }
    },
  })

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  return (
    <Page
      title="Clusters"
      description="Create and manage your Kubernetes clusters"
      actions={
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Create Cluster</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <DialogHeader>
                <DialogTitle>Create Cluster</DialogTitle>
                <DialogDescription>
                  Enter the connection details for your Kubernetes cluster.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? 'Cluster name is required' : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="name">Cluster Name</FieldLabel>
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

                <form.Field
                  name="certificateAuthorityData"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim()
                        ? 'Certificate Authority Data is required'
                        : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="certificateAuthorityData">
                        Certificate Authority Data
                      </FieldLabel>
                      <Textarea
                        id="certificateAuthorityData"
                        placeholder="Base64 encoded CA certificate"
                        className="font-mono text-xs"
                        rows={4}
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
                  name="token"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim()
                        ? 'Service Account Token is required'
                        : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <div className="flex items-center gap-1">
                        <FieldLabel htmlFor="token">
                          Service Account Token
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
                                How to create a Service Account Token
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Run the following commands to create a service
                                account with cluster-admin privileges:
                              </p>
                              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
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
                        placeholder="Service account token for authentication"
                        className="font-mono text-xs"
                        rows={4}
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
                      {isSubmitting ? 'Creating...' : 'Create'}
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
            cell: ({ row }) => {
              return (
                <Link
                  to={`/workspaces/$workspaceId/clusters/$clusterId`}
                  params={{ workspaceId, clusterId: row.original.id }}
                >
                  {row.original.name}
                </Link>
              )
            },
          },
          {
            accessorKey: 'server',
            header: 'Server',
          },
          {
            accessorKey: 'createdAt',
            header: 'Created Date',
            cell: ({ row }) => {
              return dayjs(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss')
            },
          },
        ]}
        data={data?.clusters.edges.map((edge) => edge.node) || []}
      />
    </Page>
  )
}
