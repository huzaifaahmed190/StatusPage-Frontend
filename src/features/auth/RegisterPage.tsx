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
import { registerUser } from './authApi'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser(data.name, data.email, data.password)
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }))
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Please try again.'
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
            <h1 className="font-semibold text-gray-900 text-[22px]">Start monitoring your services</h1>
            <p className="text-gray-500 text-sm">Fill in the details to get started</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" {...register('name')} />
              <p className="text-red-500 text-xs h-4">{errors.name?.message}</p>
            </div>

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
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="p-0 justify-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
