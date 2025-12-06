import { graphql } from '@/gql'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
  '/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services/$serviceId',
)({
  component: Outlet,
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
