import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";
import type { ApolloClientIntegration } from "@apollo/client-integration-tanstack-start";
import { NotFoundPageTemplate } from "@/components/not-found-page-template";
import i18n from "i18next";

export const Route = createRootRouteWithContext<
  ApolloClientIntegration.RouterContext & {
    i18n: typeof i18n;
    title?: string;
  }
>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Kubeploy",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/logo.png",
        type: "image/png",
        sizes: "100x100",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,

  notFoundComponent: NotFoundPageTemplate,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background h-full">
      <head>
        <HeadContent />
      </head>
      <body className="h-full">
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
