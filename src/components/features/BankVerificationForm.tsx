import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  CreditCard,
  Hash,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui'

const SA_BANKS = [
  'FNB',
  'Standard Bank',
  'Absa',
  'Nedbank',
  'Capitec',
  'African Bank',
  'TymeBank',
  'Discovery Bank',
]

const ACCOUNT_TYPES = [
  'Cheque Account',
  'Savings Account',
  'Credit Account',
]

const bankSchema = z.object({
  bank_name: z.string().min(1, 'Please select your bank'),
  account_type: z.string().min(1, 'Please select account type'),
  account_number: z.string().min(8, 'Account number must be at least 8 digits').max(15, 'Account number too long').regex(/^[0-9]+$/, 'Account number must contain only numbers'),
})

export type BankFormData = z.infer<typeof bankSchema>

interface BankVerificationFormProps {
  onComplete: (data: BankFormData) => void
  onSkip?: () => void
}

type StepField = keyof BankFormData

interface Step {
  id: number
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  field: StepField
  placeholder: string
  type: 'text' | 'select'
  options?: string[]
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Which bank do you use?',
    subtitle: 'Select your primary bank account',
    icon: Building2,
    field: 'bank_name',
    placeholder: 'Select your bank',
    type: 'select',
    options: SA_BANKS,
  },
  {
    id: 2,
    title: 'What type of account?',
    subtitle: 'Select your account type',
    icon: CreditCard,
    field: 'account_type',
    placeholder: 'Select account type',
    type: 'select',
    options: ACCOUNT_TYPES,
  },
  {
    id: 3,
    title: "What's your account number?",
    subtitle: 'This helps us verify and deposit funds',
    icon: Hash,
    field: 'account_number',
    placeholder: '1234567890',
    type: 'text',
  },
]

export function BankVerificationForm({
  onComplete,
  onSkip,
}: BankVerificationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bank_name: '',
      account_type: '',
      account_number: '',
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

  const onSubmit = async (data: BankFormData) => {
    setIsSubmitting(true)
    try {
      await onComplete(data)
      toast.success('Bank details saved!')
    } catch {
      toast.error('Failed to save bank details')
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
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
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

          {onSkip && currentStep === 0 && (
            <button
              onClick={onSkip}
              className="mt-4 w-full text-center text-sm text-neutral-500 hover:text-neutral-700"
            >
              Skip for now
            </button>
          )}
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
              Bank Details Saved!
            </h2>
            <p className="mt-2 text-neutral-500">
              Here&apos;s a summary of your bank information
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-3 rounded-xl bg-neutral-50 p-6">
            <div className="flex justify-between">
              <span className="text-neutral-500">Bank</span>
              <span className="font-medium text-neutral-900">
                {watchedValues.bank_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Account Type</span>
              <span className="font-medium text-neutral-900">
                {watchedValues.account_type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Account Number</span>
              <span className="font-medium text-neutral-900">
                ****{watchedValues.account_number.slice(-4)}
              </span>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-neutral-500">
            Your bank details are encrypted and secure
          </p>

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
