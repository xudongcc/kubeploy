import { Page } from '@/components/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_admin/workspaces/$workspaceId/projects/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page title="Projects" description="Create and manage your projects">
      Hello "/_admin/workspaces/$workspaceId/projects/"!
    </Page>
  )
}
