import { Link } from "@tanstack/react-router";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link to="/">
            <img
              src="/logo.png"
              alt="Kubeploy"
              className="aspect-square size-8"
            />
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Kubeploy</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
