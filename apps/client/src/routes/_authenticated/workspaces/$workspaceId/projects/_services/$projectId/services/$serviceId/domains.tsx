import { Page } from '@/components/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId/domains',
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: 'Domains' }
  },
})

function RouteComponent() {
  const { service } = Route.useRouteContext()

  return (
    <Page title="Domains" description="Manage your service domains.">
      Hello
      "/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId/domains"!
    </Page>
  )
}
