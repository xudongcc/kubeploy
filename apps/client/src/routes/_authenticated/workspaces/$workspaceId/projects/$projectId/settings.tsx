import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'

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
import { graphql } from '@/gql'

const UPDATE_PROJECT_MUTATION = graphql(`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      ...ProjectDetail
    }
  }
`)

const REMOVE_PROJECT_MUTATION = graphql(`
  mutation RemoveProject($id: ID!) {
    removeProject(id: $id) {
      id
    }
  }
`)

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/projects/$projectId/settings',
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: 'Settings' }
  },
})

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams()
  const navigate = Route.useNavigate()

  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  const { project } = Route.useRouteContext()

  const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION)
  const [removeProject, { loading: removing }] = useMutation(
    REMOVE_PROJECT_MUTATION,
    {
      update(cache, result) {
        if (result.data?.removeProject) {
          cache.evict({ id: cache.identify(result.data.removeProject) })
          cache.gc()
        }
      },
    },
  )

  const form = useForm({
    defaultValues: {
      name: project?.name ?? '',
    },
    onSubmit: async ({ value }) => {
      await updateProject({
        variables: {
          id: projectId,
          input: {
            name: value.name.trim(),
          },
        },
      })
    },
  })

  const handleDelete = async () => {
    await removeProject({
      variables: { id: projectId },
    })
    navigate({
      to: '/workspaces/$workspaceId/projects',
      params: { workspaceId },
    })
  }

  if (!project) {
    return <div>Project not found</div>
  }

  const canDelete = deleteConfirmName === project.name

  return (
    <Page
      title="Settings"
      description="Update your project name and other settings."
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
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>
                Update your project name and other settings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? 'Project name is required' : undefined,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="My Project"
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
              Once you delete a project, there is no going back. This will
              permanently delete the project and its associated Kubernetes
              namespace.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Project</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the project <strong>{project.name}</strong> and its
                    associated Kubernetes namespace.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Please type <strong>{project.name}</strong> to confirm.
                  </p>
                  <Input
                    placeholder={project.name}
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
                  >
                    {removing ? 'Deleting...' : 'Delete Project'}
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
