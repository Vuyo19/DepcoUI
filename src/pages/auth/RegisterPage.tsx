import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignUp } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  CreditCard,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phoneNumber: z
      .string()
      .regex(/^(\+27|0)[6-8][0-9]{8}$/, 'Please enter a valid SA phone number'),
    idNumber: z
      .string()
      .regex(/^[0-9]{13}$/, 'Please enter a valid 13-digit SA ID number'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const steps = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Contact Details' },
  { id: 3, title: 'Create Password' },
]

export function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useSignUp()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const nextStep = async () => {
    const fieldsToValidate: (keyof RegisterFormData)[][] = [
      ['firstName', 'lastName', 'idNumber', 'dateOfBirth'],
      ['email', 'phoneNumber'],
      ['password', 'confirmPassword'],
    ]

    const isValid = await trigger(fieldsToValidate[currentStep - 1])
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: RegisterFormData) => {
    if (!signUp) return

    setIsLoading(true)
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      toast.success('Check your email for verification code')
      navigate('/verify-email')
    } catch (error: unknown) {
      const clerkError = error as { errors?: Array<{ message: string }> }
      toast.error(
        clerkError.errors?.[0]?.message || 'Registration failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Decorative */}
      <div className="hidden bg-gradient-to-br from-secondary-500 to-secondary-700 lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold">Start your journey today</h2>
          <p className="mt-4 text-lg text-secondary-100">
            Join thousands of South Africans who have secured their rental
            deposits with DEPCO.
          </p>

          {/* Progress Indicator */}
          <div className="mt-12 space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold text-lg ${
                      currentStep >= step.id
                        ? 'border-white bg-white text-secondary-600'
                        : 'border-white/50 text-white/50'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`text-lg font-medium ${
                      currentStep >= step.id ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-6 top-14 h-6 w-0.5 -translate-x-1/2 ${
                      currentStep > step.id ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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

          <h1 className="text-3xl font-bold text-neutral-900">
            Create your account
          </h1>
          <p className="mt-2 text-neutral-600">
            Step {currentStep} of 3 - {steps[currentStep - 1].title}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      placeholder="John"
                      leftIcon={<User className="h-5 w-5" />}
                      error={errors.firstName?.message}
                      {...register('firstName')}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      leftIcon={<User className="h-5 w-5" />}
                      error={errors.lastName?.message}
                      {...register('lastName')}
                    />
                  </div>
                  <Input
                    label="SA ID Number"
                    placeholder="9001015800084"
                    leftIcon={<CreditCard className="h-5 w-5" />}
                    error={errors.idNumber?.message}
                    {...register('idNumber')}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    leftIcon={<Calendar className="h-5 w-5" />}
                    error={errors.dateOfBirth?.message}
                    {...register('dateOfBirth')}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="0812345678"
                    leftIcon={<Phone className="h-5 w-5" />}
                    hint="South African mobile number"
                    error={errors.phoneNumber?.message}
                    {...register('phoneNumber')}
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      leftIcon={<Lock className="h-5 w-5" />}
                      hint="At least 8 characters with uppercase, lowercase, and number"
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
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </>
              )}
            </motion.div>

            <div className="mt-8 flex gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  className="flex-1"
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
