import { Spinner } from '@/components/ui/spinner'
import { useQuery } from '@apollo/client/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { GetCurrentUserDocument } from '@/gql/graphql'
import { ErrorPageTemplate } from '@/components/error-page-template'

export const Route = createFileRoute('/_admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { loading, error } = useQuery(GetCurrentUserDocument)

  if (error) {
    return <ErrorPageTemplate />
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return <Outlet />
}
