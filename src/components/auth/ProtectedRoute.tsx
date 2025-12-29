import { useUser, RedirectToSignIn } from '@clerk/clerk-react'
import { LoadingOverlay } from '@/components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return <LoadingOverlay message="Loading..." />
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  return <>{children}</>
}
