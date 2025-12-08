import { ChevronsUpDown } from "lucide-react";

import { useSuspenseQuery } from "@apollo/client/react";
import { useRouteContext } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Link } from "@/components/link";
import { graphql } from "@/gql";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const WORKSPACE_SWITCHER_WORKSPACES_QUERY = graphql(`
  query WorkspaceSwitcherWorkspaces {
    workspaces(first: 10) {
      edges {
        node {
          id
          ...WorkspaceSwitcherWorkspace @unmask
        }
      }
    }
  }

  fragment WorkspaceSwitcherWorkspace on Workspace {
    id
    name
  }
`);

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();

  const workspace = useRouteContext({
    from: "/_authenticated/workspaces/$workspaceId",
    select: (context) => context.workspace,
  });

  const {
    data: {
      workspaces: { edges: workspaceEdges },
    },
  } = useSuspenseQuery(WORKSPACE_SWITCHER_WORKSPACES_QUERY);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-background border"
            >
              <Avatar className="rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {workspace.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{workspace.name}</span>
                {/* <span className="truncate text-xs text-muted-foreground">
                  {workspace.id}
                </span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>

            {workspaceEdges.map(({ node }) => (
              <Link
                key={node.id}
                to="/workspaces/$workspaceId"
                params={{ workspaceId: node.id }}
              >
                <DropdownMenuItem key={node.id} className="gap-2 p-2">
                  {node.name}
                </DropdownMenuItem>
              </Link>
            ))}

            <DropdownMenuSeparator />

            <Link to="/workspaces/create">
              <DropdownMenuItem className="gap-2 p-2">
                <div className="text-muted-foreground font-medium">
                  Create workspace
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
