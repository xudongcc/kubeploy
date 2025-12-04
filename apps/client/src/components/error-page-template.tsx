import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

export const ErrorPageTemplate = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Error</EmptyTitle>
          <EmptyDescription>
            An error occurred while loading the page.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
