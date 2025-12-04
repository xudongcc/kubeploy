import { Spinner } from '@/components/ui/spinner'
import { GetWorkspacesDocument } from '@/gql/graphql'
import { useQuery } from '@apollo/client/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_admin/workspaces/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const { data: workspacesData } = useQuery(GetWorkspacesDocument, {
    variables: { first: 1 },
  })

  useEffect(() => {
    if (
      workspacesData?.workspaces.edges &&
      workspacesData.workspaces.edges.length > 0
    ) {
      navigate({
        to: '/workspaces/$workspaceId',
        params: {
          workspaceId: workspacesData.workspaces.edges[0].node.id,
        },
      })
    } else {
      navigate({
        to: `/workspaces/create`,
      })
    }
  }, [workspacesData])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  )
}
