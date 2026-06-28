
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/redux'
import { setAccessToken } from '@/features/auth/authSlice'
import { refreshToken } from '@/features/auth/authApi'

interface AppInitializerProps {
  children: React.ReactNode
}

export default function AppInitializer({ children }: AppInitializerProps) {
    // ✅ hooks go INSIDE here
    const [isChecking, setIsChecking] = useState(true)
    const dispatch = useAppDispatch()

    useEffect(() => {
      const tryRefresh = async () => {
        try {
          const result = await refreshToken()
          dispatch(setAccessToken(result.accessToken))
        } catch {
          // session expired or no cookie — do nothing
        } finally {
          setIsChecking(false)
        }
      }

      tryRefresh()
    }, [dispatch])

    if (isChecking) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }

    return <>{children}</>
}