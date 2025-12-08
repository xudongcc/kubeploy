import { Fragment, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { FC } from "react";
import { uniqBy } from "lodash-es";
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

  const [breadcrumbs, lastBreadcrumb] = useMemo(() => {
    const breadcrumbs = uniqBy(
      matches
        .map(({ id, pathname, context }) => {
          if (!context.title) {
            return null;
          }

          return {
            id,
            title: context.title,
            to: pathname,
          };
        })
        .filter((item) => item !== null),
      (item) => item.to.replace(/\/$/, ""),
    );

    const lastBreadcrumb = breadcrumbs.pop();

    return [breadcrumbs, lastBreadcrumb];
  }, [matches]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs?.map((breadcrumb) => (
          <Fragment key={breadcrumb.id}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link to={breadcrumb.to}>{breadcrumb.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden md:block" />
          </Fragment>
        ))}

        {lastBreadcrumb && (
          <BreadcrumbItem>
            <BreadcrumbPage>{lastBreadcrumb.title}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
