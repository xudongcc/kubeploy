import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { graphql } from "@/gql";
import { useApolloClient } from "@apollo/client/react";
import { useEffect } from "react";

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
    createdAt
    updatedAt
  }
`);

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ context: { apolloClient } }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER_QUERY,
      });

      if (data?.currentUser) {
        return { currentUser: data.currentUser };
      }
    } catch {}

    throw redirect({
      to: "/auth/login",
      search: { redirect: location.href },
    });
  },
});

function RouteComponent() {
  const router = useRouter();
  const apolloClient = useApolloClient();

  const currentUser = Route.useRouteContext({
    select: (context) => context.currentUser,
  });

  useEffect(() => {
    const subscription = apolloClient
      .watchQuery({
        query: GET_CURRENT_USER_QUERY,
        fetchPolicy: "cache-only",
      })
      .subscribe({
        next(result) {
          if (result.data?.currentUser?.updatedAt !== currentUser.updatedAt) {
            router.invalidate();
          }
        },
      });

    return () => subscription.unsubscribe();
  }, [apolloClient, currentUser]);

  return <Outlet />;
}
