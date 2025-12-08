import { Fragment, useMemo } from "react";
import {
  LinkComponentProps,
  linkOptions,
  useRouterState,
} from "@tanstack/react-router";
import type { FC } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link } from "@/components/link";

export interface BreadcrumbsItemProps {
  title: string;
  link: LinkComponentProps<"a">;
}

export interface BreadcrumbsProps {
  baseItems?: BreadcrumbsItemProps[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ baseItems = [] }) => {
  const matches = useRouterState({ select: (state) => state.matches });

  const [breadcrumbs, lastBreadcrumb] = useMemo(() => {
    const breadcrumbs = [
      ...baseItems,
      ...matches
        .map(({ pathname, context }) => {
          if (!context.title) {
            return null;
          }

          return {
            title: context.title,
            link: linkOptions({
              to: pathname,
            }),
          };
        })
        .filter((item) => item !== null),
    ];

    const lastBreadcrumb = breadcrumbs.pop();

    return [breadcrumbs, lastBreadcrumb];
  }, [matches]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs?.map((breadcrumb) => (
          <Fragment key={breadcrumb.title}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link {...(breadcrumb.link as LinkComponentProps<"a">)}>
                  {breadcrumb.title}
                </Link>
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
