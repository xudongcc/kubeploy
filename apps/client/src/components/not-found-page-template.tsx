import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const NotFoundPageTemplate = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
