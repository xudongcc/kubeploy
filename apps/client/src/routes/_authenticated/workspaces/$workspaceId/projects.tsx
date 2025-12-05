import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/projects',
)({
  component: Outlet,
  beforeLoad: () => {
    return { title: 'Project' }
  },
})
