import { Page } from '@/components/page'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_admin/workspaces/$workspaceId/projects/$projectId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams()

  return (
    <Page
      title="Project"
      description="Create and manage your project"
      breadcrumbs={[
        <Link to="/workspaces/$workspaceId/projects" params={{ workspaceId }}>
          Projects
        </Link>,
      ]}
    >
      Hello "/_admin/workspaces/$workspaceId/projects/$projectId/"!
    </Page>
  )
}
