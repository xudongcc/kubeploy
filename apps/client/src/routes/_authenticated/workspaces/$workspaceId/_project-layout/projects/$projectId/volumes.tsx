import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId/volumes',
)({
  component: RouteComponent,
  beforeLoad: () => {
    return { title: 'Volumes' }
  },
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId/volumes"!
    </div>
  )
}
