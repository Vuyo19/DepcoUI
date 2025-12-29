import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  Building,
  Map,
  Hash,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui'

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
]

const profileSchema = z.object({
  phone_number: z.string().min(10, 'Please enter a valid phone number').regex(/^0[6-8][0-9]{8}$/, 'Please enter a valid SA mobile number'),
  id_number: z.string().length(13, 'SA ID must be 13 digits').regex(/^[0-9]{13}$/, 'ID must contain only numbers'),
  date_of_birth: z.string().min(1, 'Please enter your date of birth'),
  address_street: z.string().min(3, 'Please enter your street address'),
  address_city: z.string().min(2, 'Please enter your city'),
  address_province: z.string().min(1, 'Please select your province'),
  address_postal_code: z.string().length(4, 'Postal code must be 4 digits').regex(/^[0-9]{4}$/, 'Postal code must contain only numbers'),
})

export type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileOnboardingFormProps {
  onComplete: (data: ProfileFormData) => void
  existingData?: Partial<ProfileFormData>
}

type StepField = keyof ProfileFormData

interface Step {
  id: number
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  field: StepField
  placeholder: string
  type: 'text' | 'tel' | 'date' | 'select'
  options?: string[]
}

const steps: Step[] = [
  {
    id: 1,
    title: "What's your phone number?",
    subtitle: 'We\'ll use this to contact you about your loan',
    icon: Phone,
    field: 'phone_number',
    placeholder: '0812345678',
    type: 'tel',
  },
  {
    id: 2,
    title: "What's your SA ID number?",
    subtitle: 'Required for identity verification',
    icon: CreditCard,
    field: 'id_number',
    placeholder: '9001015026086',
    type: 'text',
  },
  {
    id: 3,
    title: "What's your date of birth?",
    subtitle: 'As it appears on your ID document',
    icon: Calendar,
    field: 'date_of_birth',
    placeholder: '',
    type: 'date',
  },
  {
    id: 4,
    title: "What's your street address?",
    subtitle: 'Your current residential address',
    icon: MapPin,
    field: 'address_street',
    placeholder: '123 Main Street, Apartment 4B',
    type: 'text',
  },
  {
    id: 5,
    title: 'Which city do you live in?',
    subtitle: 'Your current city or town',
    icon: Building,
    field: 'address_city',
    placeholder: 'Johannesburg',
    type: 'text',
  },
  {
    id: 6,
    title: 'Which province?',
    subtitle: 'Select your province',
    icon: Map,
    field: 'address_province',
    placeholder: 'Select province',
    type: 'select',
    options: SA_PROVINCES,
  },
  {
    id: 7,
    title: "What's your postal code?",
    subtitle: '4-digit postal code',
    icon: Hash,
    field: 'address_postal_code',
    placeholder: '2000',
    type: 'text',
  },
]

export function ProfileOnboardingForm({
  onComplete,
  existingData,
}: ProfileOnboardingFormProps) {
  // Calculate which fields are already filled
  const getFirstIncompleteStep = () => {
    const fields: StepField[] = ['phone_number', 'id_number', 'date_of_birth', 'address_street', 'address_city', 'address_province', 'address_postal_code']
    for (let i = 0; i < fields.length; i++) {
      const value = existingData?.[fields[i]]
      if (!value || value === '') {
        return i
      }
    }
    return fields.length // All complete
  }

  const initialStep = getFirstIncompleteStep()
  const [currentStep, setCurrentStep] = useState(initialStep >= steps.length ? 0 : initialStep)
  const [isComplete, setIsComplete] = useState(initialStep >= steps.length)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate completed fields count for progress
  const getCompletedCount = () => {
    const fields: StepField[] = ['phone_number', 'id_number', 'date_of_birth', 'address_street', 'address_city', 'address_province', 'address_postal_code']
    return fields.filter(field => existingData?.[field] && existingData[field] !== '').length
  }
  const completedFromDB = getCompletedCount()

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone_number: existingData?.phone_number || '',
      id_number: existingData?.id_number || '',
      date_of_birth: existingData?.date_of_birth || '',
      address_street: existingData?.address_street || '',
      address_city: existingData?.address_city || '',
      address_province: existingData?.address_province || '',
      address_postal_code: existingData?.address_postal_code || '',
    },
  })

  const watchedValues = watch()
  const currentStepData = steps[currentStep]

  const handleNext = async () => {
    const isValid = await trigger(currentStepData.field)
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        setIsComplete(true)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNext()
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      await onComplete(data)
      toast.success('Profile completed!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const Icon = currentStepData?.icon

  const renderInput = () => {
    const step = currentStepData
    const baseClasses = "w-full rounded-xl border border-neutral-200 py-4 px-4 text-xl font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"

    if (step.type === 'select') {
      return (
        <select
          className={baseClasses}
          {...register(step.field)}
          onKeyDown={handleKeyDown}
        >
          <option value="">{step.placeholder}</option>
          {step.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    if (step.type === 'date') {
      return (
        <input
          type="date"
          className={baseClasses}
          max={new Date().toISOString().split('T')[0]}
          {...register(step.field)}
          onKeyDown={handleKeyDown}
        />
      )
    }

    return (
      <input
        type={step.type}
        placeholder={step.placeholder}
        className={baseClasses}
        {...register(step.field)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      {!isComplete ? (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(((Math.max(completedFromDB, currentStep) + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: `${(completedFromDB / steps.length) * 100}%` }}
                animate={{
                  width: `${((Math.max(completedFromDB, currentStep) + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {completedFromDB > 0 && (
              <p className="mt-2 text-xs text-secondary-600">
                {completedFromDB} of {steps.length} fields already completed
              </p>
            )}
          </div>

          {/* Icon */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
            {Icon && <Icon className="h-8 w-8 text-primary-600" />}
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-neutral-900">
            {currentStepData.title}
          </h2>
          <p className="mt-2 text-neutral-500">{currentStepData.subtitle}</p>

          {/* Input */}
          <div className="mt-8">
            {renderInput()}
            {errors[currentStepData.field] && (
              <p className="mt-2 text-sm text-red-500">
                {errors[currentStepData.field]?.message}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handleNext}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          {/* Success Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100">
              <CheckCircle className="h-8 w-8 text-secondary-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-neutral-900">
              Profile Complete!
            </h2>
            <p className="mt-2 text-neutral-500">
              Here&apos;s a summary of your information
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-3 rounded-xl bg-neutral-50 p-6">
            <div className="flex justify-between">
              <span className="text-neutral-500">Phone</span>
              <span className="font-medium text-neutral-900">
                {watchedValues.phone_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">ID Number</span>
              <span className="font-medium text-neutral-900">
                {watchedValues.id_number.slice(0, 6)}****{watchedValues.id_number.slice(-3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Date of Birth</span>
              <span className="font-medium text-neutral-900">
                {watchedValues.date_of_birth}
              </span>
            </div>
            <div className="border-t border-neutral-200 pt-3">
              <span className="text-sm text-neutral-500">Address</span>
              <p className="mt-1 font-medium text-neutral-900">
                {watchedValues.address_street}
              </p>
              <p className="text-neutral-700">
                {watchedValues.address_city}, {watchedValues.address_province} {watchedValues.address_postal_code}
              </p>
            </div>
          </div>

          {/* Action */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Save & Continue
            </Button>
          </form>
        </motion.div>
      )}
    </div>
  )
}
