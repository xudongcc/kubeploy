import { Fragment, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { FC } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import uniqBy from "lodash-es/uniqBy";

import { Link } from "@/components/link";

export const Breadcrumbs: FC = () => {
  const matches = useRouterState({ select: (state) => state.matches });

  const breadcrumbs = useMemo(() => {
    return uniqBy(
      matches
        .map(({ pathname, context }) => {
          if (!context.title) {
            return null;
          }

          return {
            title: context.title,
            path: pathname,
          };
        })
        .filter((item) => item !== null),
      (item) => item.path.replace(/\/+$/, ""),
    );
  }, [matches]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          if (index === breadcrumbs.length - 1) {
            return (
              <BreadcrumbItem key={breadcrumb.path}>
                <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <Fragment key={breadcrumb.path}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
