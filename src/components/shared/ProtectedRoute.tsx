import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
