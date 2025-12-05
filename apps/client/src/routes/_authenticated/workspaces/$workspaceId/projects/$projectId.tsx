import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { graphql } from '@/gql'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Link } from '@/components/link'

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

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="w-full border-b px-4 pb-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/services`}
                    params={{ workspaceId, projectId }}
                  >
                    Services
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/settings`}
                    params={{ workspaceId, projectId }}
                  >
                    Settings
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <Outlet />
    </div>
  )
}
