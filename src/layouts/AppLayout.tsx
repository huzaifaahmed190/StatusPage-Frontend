import { Outlet } from 'react-router-dom'

// AppLayout wraps all protected pages — sidebar + topbar will live here
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
