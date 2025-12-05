import { authClient } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const navigate = Route.useNavigate()

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session) {
        navigate({ to: '/workspaces' })
      } else {
        navigate({ to: '/auth/login' })
      }
    })
  }, [])

  return null
}
