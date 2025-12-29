import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignIn } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Card } from '@/components/ui'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, setActive } = useSignIn()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    if (!signIn) return

    setIsLoading(true)
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('Welcome back!')
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      const clerkError = error as { errors?: Array<{ message: string }> }
      toast.error(clerkError.errors?.[0]?.message || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
                <span className="text-xl font-bold text-white">D</span>
              </div>
              <span className="text-2xl font-bold text-neutral-900">DEPCO</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-neutral-900">Welcome back</h1>
          <p className="mt-2 text-neutral-600">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden bg-gradient-to-br from-primary-500 to-primary-700 lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold">Your rental deposit, sorted.</h2>
          <p className="mt-4 text-lg text-primary-100">
            Access affordable loans designed for first-time borrowers. No
            traditional credit history required.
          </p>
          <div className="mt-12 grid gap-6">
            <Card className="bg-white/10 backdrop-blur-sm" padding="md">
              <p className="font-semibold">R5,000 - R15,000</p>
              <p className="text-sm text-primary-100">Loan amounts available</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm" padding="md">
              <p className="font-semibold">9% - 15%</p>
              <p className="text-sm text-primary-100">Competitive interest rates</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm" padding="md">
              <p className="font-semibold">24 hours</p>
              <p className="text-sm text-primary-100">Fast approval time</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
