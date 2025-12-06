import { Page } from '@/components/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId/',
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: 'Overview' }
  },
})

function RouteComponent() {
  return (
    <Page title="Overview" description="Overview of your service.">
      Hello
      "/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId/overview"!
    </Page>
  )
}
