import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/_service-layout/projects/$projectId/services',
)({
  component: Outlet,
  beforeLoad: () => {
    return { title: 'Services' }
  },
})
