import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { graphql } from '@/gql'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Link } from '@/components/link'

const GET_SERVICE_QUERY = graphql(`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      ...ServiceDetail @unmask
    }
  }

  fragment ServiceDetail on Service {
    id
    name
    image
    ports
    replicas
    environmentVariables {
      key
      value
    }
    createdAt
  }
`)

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services/$serviceId',
)({
  component: RouteComponent,
  beforeLoad: async ({
    context: { apolloClient },
    params: { workspaceId, projectId, serviceId },
  }) => {
    const { data } = await apolloClient.query({
      query: GET_SERVICE_QUERY,
      variables: { id: serviceId },
    })

    if (!data?.service) {
      throw redirect({
        to: '/workspaces/$workspaceId/projects/$projectId/services',
        params: { workspaceId, projectId },
      })
    }

    return { title: data.service.name, service: data.service }
  },
})

function RouteComponent() {
  const { workspaceId, projectId, serviceId } = Route.useParams()

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="w-full border-b px-4 pb-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/services/$serviceId`}
                    params={{ workspaceId, projectId, serviceId }}
                  >
                    Overview
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/services/$serviceId/environment`}
                    params={{ workspaceId, projectId, serviceId }}
                  >
                    Environment
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/services/$serviceId/domains`}
                    params={{ workspaceId, projectId, serviceId }}
                  >
                    Domains
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/services/$serviceId/logs`}
                    params={{ workspaceId, projectId, serviceId }}
                  >
                    Logs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/services/$serviceId/volumes`}
                    params={{ workspaceId, projectId, serviceId }}
                  >
                    Volumes
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={`/workspaces/$workspaceId/projects/$projectId/services/$serviceId/settings`}
                    params={{ workspaceId, projectId, serviceId }}
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
