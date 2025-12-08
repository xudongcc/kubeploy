import { Link } from "@/components/link";
import { LinkProps } from "@tanstack/react-router";
import { FC } from "react";

export interface NavTabProps {
  tabs: { title: string; link: LinkProps<typeof Link> }[];
}

export const NavTabs: FC<NavTabProps> = ({ tabs = [] }) => {
  return (
    <div className="border-border border-b px-4">
      <nav aria-label="Tabs" className="-mb-px flex">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            {...tab.link}
            className="text-muted-foreground hover:border-border hover:text-foreground data-[status=active]:border-primary data-[status=active]:text-primary border-b-2 border-transparent px-3 py-4 text-sm whitespace-nowrap"
          >
            {tab.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};
