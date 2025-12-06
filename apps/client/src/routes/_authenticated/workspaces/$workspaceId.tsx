import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { graphql } from '@/gql'

const GET_CURRENT_WORKSPACE_QUERY = graphql(`
  query GetCurrentWorkspace($id: ID!) {
    workspace(id: $id) {
      id
      ...CurrentWorkspace @unmask
    }
  }

  fragment CurrentWorkspace on Workspace {
    id
    name
  }
`)

export const Route = createFileRoute('/_authenticated/workspaces/$workspaceId')(
  {
    component: Outlet,
    beforeLoad: async ({
      context: { apolloClient },
      params: { workspaceId },
    }) => {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_WORKSPACE_QUERY,
        variables: { id: workspaceId },
      })

      if (!data?.workspace) {
        throw redirect({
          to: '/auth/login',
        })
      }

      return { workspace: data.workspace }
    },
  },
)
