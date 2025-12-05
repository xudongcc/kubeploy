import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { EnumLike, z } from 'zod'
import dayjs from 'dayjs'

import { Page } from '@/components/page'
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
import { DataTable } from '@/components/turboost-ui/data-table'
import { OrderDirection, ProjectOrderField } from '@/gql/graphql'

const GET_PROJECTS_QUERY = graphql(`
  query GetProjects(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $orderBy: ProjectOrder
    $query: String
  ) {
    projects(
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
          ...ProjectItem @unmask
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

  fragment ProjectItem on Project {
    id
    name
    createdAt
  }
`)

const CREATE_PROJECT_MUTATION = graphql(`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
    }
  }
`)

interface CreateConnectionSchemaOptions<OrderField extends EnumLike> {
  pageSize: number
  orderField: OrderField
  defaultOrderField: OrderField[keyof OrderField]
  defaultOrderDirection: OrderDirection
}

function createConnectionSchema<OrderField extends EnumLike>(
  options: CreateConnectionSchemaOptions<OrderField>,
) {
  return z
    .object({
      first: z.number().int().positive().optional(),
      last: z.number().int().positive().optional(),
      after: z.string().optional(),
      before: z.string().optional(),
      query: z.string().optional(),
      orderBy: z
        .object({
          field: z
            .nativeEnum(options.orderField)
            .default(options.defaultOrderField),
          direction: z
            .nativeEnum(OrderDirection)
            .default(options.defaultOrderDirection),
        })
        .optional(),
    })
    .transform((data) => {
      const { first, last, after, before, ...rest } = data

      // first/after 和 last/before 互斥
      // 如果两者都有，保留 first/after
      // 如果都没有，使用 first = pageSize
      if (first !== undefined || after !== undefined) {
        return {
          ...rest,
          first: first ?? options.pageSize,
          after,
        }
      }

      if (last !== undefined || before !== undefined) {
        return {
          ...rest,
          last: last ?? options.pageSize,
          before,
        }
      }

      // 都没有传入，默认使用 first
      return {
        ...rest,
        first: options.pageSize,
      }
    })
}

const productConnectionSchema = createConnectionSchema({
  pageSize: 20,
  orderField: ProjectOrderField,
  defaultOrderField: ProjectOrderField.CREATED_AT,
  defaultOrderDirection: OrderDirection.DESC,
})

export const Route = createFileRoute(
  '/_admin/workspaces/$workspaceId/projects/',
)({
  component: RouteComponent,
  validateSearch: zodValidator(productConnectionSchema),
})

function RouteComponent() {
  const { workspaceId } = Route.useParams()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const [open, setOpen] = useState(false)

  const { data } = useQuery(GET_PROJECTS_QUERY, { variables: search })

  const [createProject] = useMutation(CREATE_PROJECT_MUTATION)

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      const { data } = await createProject({
        variables: {
          input: {
            name: value.name.trim(),
          },
        },
      })

      if (data?.createProject.id) {
        setOpen(false)
        form.reset()
        navigate({
          to: '/workspaces/$workspaceId/projects/$projectId',
          params: { workspaceId, projectId: data.createProject.id },
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
      title="Projects"
      description="Create and manage your projects"
      actions={
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Create Project</Button>
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
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Enter a name for your new project. The project name will be
                  used as the Kubernetes namespace.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? 'Project name is required' : undefined,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="name">Project Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="my-project"
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
                  to={`/workspaces/$workspaceId/projects/$projectId`}
                  params={{ workspaceId, projectId: row.original.id }}
                >
                  {row.original.name}
                </Link>
              )
            },
          },
          {
            accessorKey: 'createdAt',
            header: 'Created Date',
            cell: ({ row }) => {
              return dayjs(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss')
            },
          },
        ]}
        data={data?.projects.edges.map((edge) => edge.node) || []}
      />
    </Page>
  )
}
