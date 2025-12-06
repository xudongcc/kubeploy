import { Page } from '@/components/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/volumes',
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: 'Volumes' }
  },
})

function RouteComponent() {
  const { service } = Route.useRouteContext()

  return (
    <Page title="Volumes" description="Manage your service volumes.">
      Hello
      "/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId/volumes"!
    </Page>
  )
}
