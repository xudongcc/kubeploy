import { Page } from '@/components/page'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { graphql } from '@/gql'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useMatchRoute,
  useRouteContext,
} from '@tanstack/react-router'
import { useMemo } from 'react'

const GET_PROJECT_QUERY = graphql(`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      ...ProjectDetail @unmask
    }
  }

  fragment ProjectDetail on Project {
    id
    name
    createdAt
  }
`)

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/projects/$projectId',
)({
  component: RouteComponent,
  beforeLoad: async ({
    context: { apolloClient },
    params: { workspaceId, projectId },
  }) => {
    const { data } = await apolloClient.query({
      query: GET_PROJECT_QUERY,
      variables: { id: projectId },
    })

    if (!data?.project) {
      throw redirect({
        to: '/workspaces/$workspaceId/projects',
        params: { workspaceId },
      })
    }

    return { title: data.project.name, project: data.project }
  },
})

function RouteComponent() {
  const { workspaceId, projectId } = Route.useParams()
  const matchRoute = useMatchRoute()

  const project = useRouteContext({
    from: '/_authenticated/workspaces/$workspaceId/projects/$projectId',
    select: (context) => context.project,
  })

  const activeTab = useMemo(() => {
    if (
      matchRoute({
        to: '/workspaces/$workspaceId/projects/$projectId/services',
      })
    ) {
      return 'services'
    }

    if (
      matchRoute({
        to: '/workspaces/$workspaceId/projects/$projectId/settings',
      })
    ) {
      return 'settings'
    }
  }, [matchRoute])

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <Page
      title={project.name}
      breadcrumbs={[
        <Link to="/workspaces/$workspaceId/projects" params={{ workspaceId }}>
          Projects
        </Link>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <Tabs defaultValue={activeTab}>
          <TabsList>
            <TabsTrigger value="services" asChild>
              <Link
                to={`/workspaces/$workspaceId/projects/$projectId/services`}
                params={{ workspaceId, projectId }}
              >
                Services
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild>
              <Link
                to={`/workspaces/$workspaceId/projects/$projectId/settings`}
                params={{ workspaceId, projectId }}
              >
                Settings
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Outlet />
      </div>
    </Page>
  )
}
