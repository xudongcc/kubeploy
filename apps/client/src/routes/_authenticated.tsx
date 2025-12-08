import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { graphql } from "@/gql";

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
`);

export const Route = createFileRoute("/_authenticated")({
  component: Outlet,
  beforeLoad: async ({ context: { apolloClient } }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER_QUERY,
      });

      if (data?.currentUser) {
        return { user: data.currentUser };
      }
    } catch {}

    throw redirect({
      to: "/auth/login",
      search: { redirect: location.href },
    });
  },
});
