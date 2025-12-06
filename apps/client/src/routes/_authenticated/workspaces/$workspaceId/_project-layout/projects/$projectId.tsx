import { graphql } from '@/gql'
import { createFileRoute, redirect } from '@tanstack/react-router'

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
  '/_authenticated/workspaces/$workspaceId/_project-layout/projects/$projectId',
)({
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
