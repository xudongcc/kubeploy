import { cn } from '@/lib/utils'
import { Link } from '@/components/link'

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
}: PageProps) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-min w-full max-w-screen-lg flex-1 flex-col p-4',
        fullWidth && 'max-w-full',
      )}
    >
      <header className="mb-4 flex items-center justify-between gap-2">
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
  )
}
