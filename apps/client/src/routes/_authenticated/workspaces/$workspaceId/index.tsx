import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/workspaces/$workspaceId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId } = Route.useParams()
  const navigate = Route.useNavigate()

  useEffect(() => {
    navigate({
      to: `/workspaces/${workspaceId}/projects`,
    })
  }, [workspaceId])

  return null
}
