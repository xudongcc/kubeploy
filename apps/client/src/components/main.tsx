import { FC, PropsWithChildren } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link, LinkComponentProps } from '@tanstack/react-router'

export const Main: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs?.map((breadcrumb, index) => (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild key={index}>
                      <Link {...(breadcrumb.link as LinkComponentProps<'a'>)}>
                        {breadcrumb.label}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              ))}

              <BreadcrumbItem>
                <BreadcrumbPage>'123'</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {children}
    </div>
  )
}
