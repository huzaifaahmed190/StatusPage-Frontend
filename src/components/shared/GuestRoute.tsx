import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux'


interface GuestRouteProps {
    children: React.ReactNode
}

export default function GuestRoute({ children }: GuestRouteProps) {
 const accessToken = useAppSelector((state) => state.auth.accessToken)

  if (accessToken) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}