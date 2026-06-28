import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import AuthLayout from '@/layouts/AuthLayout'
import AppLayout from '@/layouts/AppLayout'
import PublicLayout from '@/layouts/PublicLayout'

// Pages — imported lazily for better performance (code splitting)
import { lazy, Suspense } from 'react'
import GuestRoute from '@/components/shared/GuestRoute'

const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'))
const DashboardPage = lazy(() => import('@/features/statusPages/DashboardPage'))
const StatusPageDetailPage = lazy(
  () => import('@/features/statusPageDetail/StatusPageDetailPage')
)
const PublicStatusPage = lazy(() => import('@/features/public/PublicStatusPage'))
const NotFoundPage = lazy(() => import('@/components/shared/NotFoundPage'))

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
    {element}
  </Suspense>
)

export const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(<GuestRoute><LoginPage /></GuestRoute>) },
      { path: '/register', element: withSuspense(<GuestRoute><RegisterPage /></GuestRoute>) },
    ],
  },

  // Protected routes
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: withSuspense(<DashboardPage />) },
      { path: '/pages/:id', element: withSuspense(<StatusPageDetailPage />) },
    ],
  },

  // Public status page
  {
    element: <PublicLayout />,
    children: [{ path: '/status/:slug', element: withSuspense(<PublicStatusPage />) }],
  },

  // Redirect root
  { path: '/', element: withSuspense(<DashboardPage />) },

  // 404
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
