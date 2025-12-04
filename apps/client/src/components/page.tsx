import { cn } from '@/lib/utils'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'

export interface PageProps {
  children: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
  fullWidth?: boolean
  breadcrumbs?: React.ReactElement<typeof Link>[]
}

export function Page({
  children,
  title,
  description,
  actions,
  fullWidth,
  breadcrumbs,
}: PageProps) {
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
                      {breadcrumb}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              ))}

              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div
        className={cn(
          'mx-auto flex min-h-min w-full max-w-screen-lg flex-1 flex-col p-4',
          fullWidth && 'max-w-full',
        )}
      >
        <header className="mb-6 flex items-center justify-between gap-2">
          <div>
            <h2 className="flex h-9 items-center text-xl font-bold tracking-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>

          <div className="flex items-center gap-2">{actions}</div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
