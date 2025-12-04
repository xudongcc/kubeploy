import { Page } from '@/components/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_admin/workspaces/$workspaceId/clusters/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page title="Clusters" description="Create and manage your clusters">
      Hello "/_admin/workspaces/$workspaceId/clusters/"!
    </Page>
  )
}
