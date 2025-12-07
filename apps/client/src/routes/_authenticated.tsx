import { graphql } from '@/gql'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const GET_CURRENT_USER_QUERY = graphql(`
  query GetCurrentUser {
    currentUser {
      id
      ...CurrentUser @unmask
    }
  }

  fragment CurrentUser on User {
    id
    name
    email
  }
`)

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: async ({ context: { apolloClient } }) => {
    const { data, error } = await apolloClient.query({
      query: GET_CURRENT_USER_QUERY,
    })

    if (error || !data?.currentUser) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      })
    }

    return { user: data?.currentUser ?? null }
  },
})

function RouteComponent() {
  return <Outlet />
}
