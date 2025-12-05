import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/projects/$projectId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams()
  const navigate = Route.useNavigate()

  useEffect(() => {
    navigate({
      to: `/workspaces/$workspaceId/projects/$projectId/services`,
      params: { workspaceId, projectId },
    })
  }, [])

  return null
}
