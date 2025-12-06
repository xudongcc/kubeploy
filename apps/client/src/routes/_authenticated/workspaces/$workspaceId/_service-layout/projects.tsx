import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/_service-layout/projects',
)({
  component: Outlet,
  beforeLoad: () => {
    return { title: 'Projects' }
  },
})
