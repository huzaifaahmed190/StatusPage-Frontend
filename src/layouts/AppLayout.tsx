import { Outlet, useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { clearCredentials } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/button'
import api from '@/api/axios'

// AppLayout wraps all protected pages — sidebar + topbar will live here
export default function AppLayout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const  user  = useAppSelector((state) => state.auth.user)

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      dispatch(clearCredentials())
      navigate('/login')
    }
  }
 return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">StatusPage</span>
            </div>

            {/* Right: User name + Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
