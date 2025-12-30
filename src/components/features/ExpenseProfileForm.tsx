import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Wallet,
  Home,
  Car,
  ShoppingCart,
  Lightbulb,
  MoreHorizontal,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui'
import { AffordabilityIndicator } from './AffordabilityIndicator'
import { formatCurrency } from '@/lib/utils'

const expenseSchema = z.object({
  monthlyIncome: z.number().min(1, 'Please enter your income'),
  rentAmount: z.number().min(0),
  transportCost: z.number().min(0),
  foodExpenses: z.number().min(0),
  utilitiesCost: z.number().min(0),
  otherExpenses: z.number().min(0),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseProfileFormProps {
  onComplete: (data: ExpenseFormData) => Promise<void> | void
  onSkip?: () => void
}

const steps = [
  {
    id: 1,
    title: "What's your monthly income?",
    subtitle: 'Your take-home pay after tax',
    icon: Wallet,
    field: 'monthlyIncome' as const,
    placeholder: 'e.g. 15000',
    prefix: 'R',
  },
  {
    id: 2,
    title: 'How much do you spend on rent?',
    subtitle: 'Current or expected rent',
    icon: Home,
    field: 'rentAmount' as const,
    placeholder: 'e.g. 5000',
    prefix: 'R',
  },
  {
    id: 3,
    title: 'Monthly transport costs?',
    subtitle: 'Petrol, taxi, Uber, public transport',
    icon: Car,
    field: 'transportCost' as const,
    placeholder: 'e.g. 2000',
    prefix: 'R',
  },
  {
    id: 4,
    title: 'Food and groceries?',
    subtitle: 'Monthly food budget',
    icon: ShoppingCart,
    field: 'foodExpenses' as const,
    placeholder: 'e.g. 3000',
    prefix: 'R',
  },
  {
    id: 5,
    title: 'Utilities and bills?',
    subtitle: 'Electricity, water, phone, internet',
    icon: Lightbulb,
    field: 'utilitiesCost' as const,
    placeholder: 'e.g. 1500',
    prefix: 'R',
  },
  {
    id: 6,
    title: 'Any other expenses?',
    subtitle: 'Entertainment, subscriptions, etc.',
    icon: MoreHorizontal,
    field: 'otherExpenses' as const,
    placeholder: 'e.g. 1000',
    prefix: 'R',
  },
]

export function ExpenseProfileForm({
  onComplete,
  onSkip,
}: ExpenseProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      monthlyIncome: 0,
      rentAmount: 0,
      transportCost: 0,
      foodExpenses: 0,
      utilitiesCost: 0,
      otherExpenses: 0,
    },
  })

  const watchedValues = watch()
  const currentStepData = steps[currentStep]

  const totalExpenses =
    watchedValues.rentAmount +
    watchedValues.transportCost +
    watchedValues.foodExpenses +
    watchedValues.utilitiesCost +
    watchedValues.otherExpenses

  const disposableIncome = watchedValues.monthlyIncome - totalExpenses

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

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true)
    try {
      await onComplete(data)
      toast.success('Expense profile saved!')
    } catch {
      toast.error('Failed to save expense profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const Icon = currentStepData?.icon

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
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-neutral-400">
                {currentStepData.prefix}
              </span>
              <input
                type="number"
                placeholder={currentStepData.placeholder}
                className="w-full rounded-xl border border-neutral-200 py-4 pl-10 pr-4 text-2xl font-semibold focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                {...register(currentStepData.field, { valueAsNumber: true })}
              />
            </div>
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
              Profile Complete!
            </h2>
            <p className="mt-2 text-neutral-500">
              Here's your financial snapshot
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-4 rounded-xl bg-neutral-50 p-6">
            <div className="flex justify-between">
              <span className="text-neutral-500">Monthly Income</span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(watchedValues.monthlyIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Expenses</span>
              <span className="font-semibold text-neutral-900">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-between">
                <span className="font-medium text-neutral-700">
                  Disposable Income
                </span>
                <span
                  className={`text-xl font-bold ${
                    disposableIncome > 0 ? 'text-secondary-600' : 'text-red-500'
                  }`}
                >
                  {formatCurrency(disposableIncome)}
                </span>
              </div>
            </div>
          </div>

          {/* Affordability Indicator */}
          <div className="mt-6">
            <AffordabilityIndicator
              income={watchedValues.monthlyIncome}
              expenses={totalExpenses}
            />
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
