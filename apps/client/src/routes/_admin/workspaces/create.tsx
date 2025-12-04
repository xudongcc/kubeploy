import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@apollo/client/react'
import { CreateWorkspaceDocument } from '@/gql/graphql'

export const Route = createFileRoute('/_admin/workspaces/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const navigate = Route.useNavigate()

  const [createWorkspace, { loading }] = useMutation(CreateWorkspaceDocument)

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      const { data } = await createWorkspace({
        variables: {
          input: {
            name: value.name,
          },
        },
      })

      if (data?.createWorkspace.id) {
        localStorage.setItem('workspaceId', data.createWorkspace.id)
        navigate({ to: '/' })
      }
    },
  })

  return (
    <div className="w-full h-full flex items-center justify-center mx-auto">
      <div className="w-full max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Create Workspace</FieldLegend>
              <FieldDescription>
                Create a new workspace to start managing your projects.
              </FieldDescription>
              <FieldGroup>
                <form.Field name="name">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="My Workspace"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.history.back()}
              >
                Back
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
