import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/projects/_services/$projectId/services',
)({
  component: Outlet,
  beforeLoad: () => {
    return { title: 'Services' }
  },
})
