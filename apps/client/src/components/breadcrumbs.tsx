import { useMemo } from "react";
import { uniqBy } from "lodash-es";
import { useRouterState } from "@tanstack/react-router";
import type { FC} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link } from "@/components/link";

export const Breadcrumbs: FC = () => {
  const matches = useRouterState({ select: (state) => state.matches });

  const [breadcrumbs, pageTitle] = useMemo(() => {
    const uniqueMatches = uniqBy(matches, (match) =>
      match.pathname.replace(/\/$/, ""),
    );

    const lastMatch = uniqueMatches.pop();

    const breadcrumbs = uniqueMatches
      .slice(1)
      .filter((match) => match.context.title)
      .map(({ id, pathname, context }) => ({
        id,
        title: context.title,
        path: pathname,
      }));

    return [breadcrumbs, lastMatch?.context.title];
  }, [matches]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs?.map((breadcrumb) => (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild key={breadcrumb.id}>
                <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden md:block" />
          </>
        ))}

        {pageTitle && (
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
