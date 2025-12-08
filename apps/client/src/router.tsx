import {
  ApolloClient,
  InMemoryCache,
  routerWithApolloClient,
} from "@apollo/client-integration-tanstack-start";
import {
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  ServerError,
} from "@apollo/client";
import { createRouter } from "@tanstack/react-router";
import { ErrorLink } from "@apollo/client/link/error";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import i18next from "@/lib/i18n";

// Create a new router instance
export const getRouter = () => {
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      new ErrorLink(({ error }) => {
        if (CombinedGraphQLErrors.is(error)) {
          error.errors.forEach(({ message }) =>
            console.log(`GraphQL error: ${message}`),
          );
        } else if (ServerError.is(error)) {
          console.log(`Server error: ${error.message}`);
        } else if (error) {
          console.log(`Other error: ${error.message}`);
        }
      }),
      new ApolloLink((operation, forward) => {
        operation.setContext(({ headers = {} }) => {
          const workspaceId =
            location.pathname.match(/^\/workspaces\/(\d+)/)?.[1];

          return {
            headers: {
              ...headers,
              ...(workspaceId ? { "x-workspace-id": workspaceId } : {}),
              "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          };
        });

        return forward(operation);
      }),
      new HttpLink({ uri: "/api/graphql", credentials: "include" }),
    ]),
  });

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: {
      ...routerWithApolloClient.defaultContext,
      i18n: i18next,
    },
  });

  return routerWithApolloClient(router, apolloClient);
};
