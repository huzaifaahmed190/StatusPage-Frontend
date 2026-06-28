import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch } from '@/hooks/redux'
import { setCredentials } from '@/features/auth/authSlice'
import { loginUser } from './authApi'

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginUser(data.email, data.password)
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }))
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[oklch(0.985_0_0)] flex items-center justify-center p-8">
      <Card className="w-full max-w-sm shadow-lg rounded-2xl border-0 p-8 flex flex-col gap-6">

        <CardHeader className="p-0 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Activity className="size-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">StatusPage</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="font-semibold text-gray-900 text-[22px]">Sign in to your account</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
              <p className="text-red-500 text-xs h-4">{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              <p className="text-red-500 text-xs h-4">{errors.password?.message}</p>
            </div>

            <Button type="submit" disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="p-0 justify-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600">Register</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
 
}
