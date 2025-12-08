import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export const ErrorPageTemplate = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
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
  );
};
