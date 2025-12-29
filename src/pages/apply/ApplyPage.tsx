import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  Briefcase,
  Calculator,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  PiggyBank,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { AIImprovementSuggestions, DocumentUploadSection, ExpenseProfileForm } from '@/components/features'
import { formatCurrency, calculateMonthlyPayment } from '@/lib/utils'
import { useKYCStatus, useApplyForLoan, useQuickAssessment, useDocumentStatus, useUserProfile, useUpdateExpenses } from '@/hooks'

const applicationSchema = z.object({
  amount: z.number().min(5000).max(15000),
  term: z.number().min(6).max(12),
  purpose: z.string().min(1, 'Please select a purpose'),
  landlord_name: z.string().optional(),
  property_address: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

const steps = [
  { id: 1, title: 'Loan Amount', icon: Wallet },
  { id: 2, title: 'Property', icon: Briefcase },
  { id: 3, title: 'Expenses', icon: PiggyBank },
  { id: 4, title: 'Documents', icon: FileText },
  { id: 5, title: 'Review', icon: Calculator },
]

const purposes = [
  { value: 'rental_deposit', label: 'Rental Deposit' },
  { value: 'moving_costs', label: 'Moving Costs' },
  { value: 'first_last_month', label: 'First & Last Month' },
  { value: 'security_deposit', label: 'Security Deposit' },
]

export function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<{ eligible: boolean; reason?: string } | null>(null)
  const navigate = useNavigate()

  const { data: kycStatus, isLoading: kycLoading } = useKYCStatus()
  const { data: documentStatus, refetch: refetchDocuments } = useDocumentStatus()
  const { data: userProfile, refetch: refetchProfile } = useUserProfile()
  const updateExpenses = useUpdateExpenses()
  const applyForLoan = useApplyForLoan()
  const quickAssessment = useQuickAssessment()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      amount: 10000,
      term: 12,
    },
  })

  const watchedValues = watch()
  const monthlyPayment = calculateMonthlyPayment(
    watchedValues.amount || 10000,
    12,
    watchedValues.term || 12
  )

  // Redirect to profile onboarding if KYC not completed
  useEffect(() => {
    if (kycStatus && !kycStatus.kyc_completed) {
      navigate('/onboarding/profile', { state: { from: '/apply' } })
    }
  }, [kycStatus, navigate])

  // Run quick assessment when KYC is complete
  useEffect(() => {
    if (kycStatus?.kyc_completed && !assessmentResult && !quickAssessment.isPending) {
      quickAssessment.mutateAsync().then((result) => {
        setAssessmentResult(result)
        if (!result.eligible) {
          setShowSuggestions(true)
        }
      }).catch(() => {
        // Silent fail - suggestions are optional
      })
    }
  }, [kycStatus?.kyc_completed])

  const nextStep = async () => {
    // Check KYC before proceeding
    if (!kycStatus?.kyc_completed) {
      navigate('/onboarding/profile', { state: { from: '/apply' } })
      return
    }

    const fieldsToValidate: (keyof ApplicationFormData)[][] = [
      ['amount', 'term', 'purpose'],
      ['landlord_name', 'property_address'],
    ]

    if (currentStep === 1 || currentStep === 2) {
      const isValid = await trigger(fieldsToValidate[currentStep - 1])
      if (isValid) {
        setCurrentStep((prev) => prev + 1)
      }
    } else if (currentStep === 3) {
      // Check if expenses are completed
      if (!userProfile?.expenses_completed) {
        toast.error('Please complete your expense profile to continue')
        return
      }
      setCurrentStep(4)
    } else if (currentStep === 4) {
      // Check if documents are uploaded
      if (!documentStatus?.all_uploaded) {
        toast.error('Please upload all required documents before continuing')
        return
      }
      setCurrentStep(5)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: ApplicationFormData) => {
    // Final KYC check before submission
    if (!kycStatus?.kyc_completed) {
      navigate('/onboarding/profile', { state: { from: '/apply' } })
      return
    }

    // Check expenses are completed
    if (!userProfile?.expenses_completed) {
      toast.error('Please complete your expense profile')
      setCurrentStep(3)
      return
    }

    // Check documents are uploaded
    if (!documentStatus?.all_uploaded) {
      toast.error('Please upload all required documents')
      setCurrentStep(4)
      return
    }

    try {
      await applyForLoan.mutateAsync({
        amount_requested: data.amount,
        term_months: data.term,
        landlord_name: data.landlord_name,
        property_address: data.property_address,
      })
      toast.success('Application submitted successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit application')
    }
  }

  if (kycLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-500" />
          <p className="mt-2 text-neutral-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* KYC Required Banner */}
        {!kycStatus?.kyc_completed && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-900">Profile Incomplete</h3>
                <p className="mt-1 text-sm text-amber-700">
                  We need a few more details before you can apply for a loan.
                  This is required for KYC compliance.
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/onboarding/profile', { state: { from: '/apply' } })}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Eligibility Status & AI Suggestions */}
        {assessmentResult && !assessmentResult.eligible && (
          <div className="mb-6 space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h3 className="font-medium text-red-900">You may not qualify yet</h3>
                  <p className="mt-1 text-sm text-red-700">
                    {assessmentResult.reason || "Based on your current profile, you may not meet our eligibility requirements."}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                  >
                    {showSuggestions ? 'Hide Suggestions' : 'See How to Improve'}
                  </Button>
                </div>
              </div>
            </div>

            {showSuggestions && (
              <AIImprovementSuggestions
                rejectionReason={assessmentResult.reason}
                className="animate-in slide-in-from-top-4"
              />
            )}
          </div>
        )}

        {/* Eligible Status */}
        {assessmentResult?.eligible && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">You appear to qualify!</h3>
                <p className="mt-1 text-sm text-green-700">
                  Based on your profile, you meet our initial eligibility requirements.
                  Complete your application below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Progress */}
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-medium text-neutral-700">Application Requirements</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className={`flex items-center gap-2 rounded-lg p-2 ${kycStatus?.kyc_completed ? 'bg-green-50' : 'bg-neutral-50'}`}>
              {kycStatus?.kyc_completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-neutral-300" />
              )}
              <span className={`text-sm ${kycStatus?.kyc_completed ? 'text-green-700 font-medium' : 'text-neutral-500'}`}>
                Profile
              </span>
            </div>
            <div className={`flex items-center gap-2 rounded-lg p-2 ${userProfile?.expenses_completed ? 'bg-green-50' : 'bg-neutral-50'}`}>
              {userProfile?.expenses_completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-neutral-300" />
              )}
              <span className={`text-sm ${userProfile?.expenses_completed ? 'text-green-700 font-medium' : 'text-neutral-500'}`}>
                Expenses
              </span>
            </div>
            <div className={`flex items-center gap-2 rounded-lg p-2 ${documentStatus?.all_uploaded ? 'bg-green-50' : 'bg-neutral-50'}`}>
              {documentStatus?.all_uploaded ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-neutral-300" />
              )}
              <span className={`text-sm ${documentStatus?.all_uploaded ? 'text-green-700 font-medium' : 'text-neutral-500'}`}>
                Documents
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep >= step.id
              const isComplete = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-neutral-300 bg-white text-neutral-400'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-primary-600' : 'text-neutral-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 rounded ${
                        currentStep > step.id
                          ? 'bg-primary-500'
                          : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Loan Amount */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        How much do you need?
                      </h2>
                      <p className="mt-2 text-neutral-600">
                        Select your loan amount and repayment term
                      </p>
                    </div>

                    {/* Amount Slider */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">
                        Loan Amount
                      </label>
                      <div className="mt-4 text-center">
                        <span className="text-4xl font-bold text-primary-600">
                          {formatCurrency(watchedValues.amount || 10000)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5000}
                        max={15000}
                        step={500}
                        className="mt-4 w-full accent-primary-500"
                        {...register('amount', { valueAsNumber: true })}
                      />
                      <div className="mt-2 flex justify-between text-sm text-neutral-500">
                        <span>R5,000</span>
                        <span>R15,000</span>
                      </div>
                    </div>

                    {/* Term Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">
                        Repayment Term
                      </label>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        {[6, 12].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setValue('term', term)}
                            className={`rounded-lg border-2 p-4 text-center transition-colors ${
                              watchedValues.term === term
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <span className="text-lg font-semibold">
                              {term} months
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Purpose */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">
                        Loan Purpose
                      </label>
                      <select
                        className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        {...register('purpose')}
                      >
                        <option value="">Select purpose</option>
                        {purposes.map((purpose) => (
                          <option key={purpose.value} value={purpose.value}>
                            {purpose.label}
                          </option>
                        ))}
                      </select>
                      {errors.purpose && (
                        <p className="mt-1.5 text-sm text-red-500">
                          {errors.purpose.message}
                        </p>
                      )}
                    </div>

                    {/* Monthly Payment Preview */}
                    <div className="rounded-xl bg-primary-50 p-6">
                      <p className="text-sm text-primary-700">
                        Estimated Monthly Payment
                      </p>
                      <p className="mt-1 text-3xl font-bold text-primary-900">
                        {formatCurrency(monthlyPayment)}/month
                      </p>
                      <p className="mt-2 text-sm text-primary-600">
                        Based on 12% interest rate
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Property Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        Property Details
                      </h2>
                      <p className="mt-2 text-neutral-600">
                        Tell us about the property you're renting (optional)
                      </p>
                    </div>

                    <Input
                      label="Landlord / Agent Name"
                      placeholder="e.g., ABC Property Management"
                      {...register('landlord_name')}
                    />

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Property Address
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        rows={3}
                        placeholder="Full address of the property"
                        {...register('property_address')}
                      />
                    </div>

                    <div className="rounded-xl bg-neutral-100 p-4">
                      <p className="text-sm text-neutral-600">
                        Providing property details helps us process your
                        application faster. We may contact your landlord to
                        verify the deposit amount.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Expenses */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {userProfile?.expenses_completed ? (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-900">
                            Expense Profile Complete
                          </h2>
                          <p className="mt-2 text-neutral-600">
                            Your expense profile has been saved
                          </p>
                        </div>
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-900">
                              Expense profile verified
                            </span>
                          </div>
                          <div className="mt-3 grid gap-2 text-sm text-green-700">
                            <div className="flex justify-between">
                              <span>Monthly Income:</span>
                              <span className="font-medium">{formatCurrency(userProfile.monthly_income || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Expenses:</span>
                              <span className="font-medium">{formatCurrency(
                                (userProfile.expense_rent || 0) +
                                (userProfile.expense_utilities || 0) +
                                (userProfile.expense_groceries || 0) +
                                (userProfile.expense_transport || 0) +
                                (userProfile.expense_insurance || 0) +
                                (userProfile.expense_debt_payments || 0) +
                                (userProfile.expense_other || 0)
                              )}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-900">
                            Your Monthly Expenses
                          </h2>
                          <p className="mt-2 text-neutral-600">
                            Help us understand your financial situation to provide the best loan terms
                          </p>
                        </div>
                        <ExpenseProfileForm
                          onComplete={async (data) => {
                            try {
                              await updateExpenses.mutateAsync({
                                expense_rent: data.rentAmount,
                                expense_utilities: data.utilitiesCost,
                                expense_groceries: data.foodExpenses,
                                expense_transport: data.transportCost,
                                expense_other: data.otherExpenses,
                              })
                              await refetchProfile()
                              toast.success('Expense profile saved!')
                            } catch (error) {
                              toast.error('Failed to save expense profile')
                            }
                          }}
                        />
                      </>
                    )}
                  </div>
                )}

                {/* Step 4: Documents */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        Upload Documents
                      </h2>
                      <p className="mt-2 text-neutral-600">
                        We need proof of identity and address for your first loan application
                      </p>
                    </div>

                    <DocumentUploadSection onComplete={() => refetchDocuments()} />
                  </div>
                )}

                {/* Step 5: Review */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        Review Your Application
                      </h2>
                      <p className="mt-2 text-neutral-600">
                        Please review your details before submitting
                      </p>
                    </div>

                    <div className="space-y-4 rounded-xl bg-neutral-50 p-6">
                      <div className="flex justify-between border-b border-neutral-200 pb-3">
                        <span className="text-neutral-600">Loan Amount</span>
                        <span className="font-semibold text-neutral-900">
                          {formatCurrency(watchedValues.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-200 pb-3">
                        <span className="text-neutral-600">Term</span>
                        <span className="font-semibold text-neutral-900">
                          {watchedValues.term} months
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-200 pb-3">
                        <span className="text-neutral-600">Purpose</span>
                        <span className="font-semibold text-neutral-900">
                          {purposes.find((p) => p.value === watchedValues.purpose)?.label}
                        </span>
                      </div>
                      {watchedValues.landlord_name && (
                        <div className="flex justify-between border-b border-neutral-200 pb-3">
                          <span className="text-neutral-600">Landlord</span>
                          <span className="font-semibold text-neutral-900">
                            {watchedValues.landlord_name}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2">
                        <span className="font-medium text-neutral-900">
                          Est. Monthly Payment
                        </span>
                        <span className="text-xl font-bold text-primary-600">
                          {formatCurrency(monthlyPayment)}
                        </span>
                      </div>
                    </div>

                    {kycStatus?.kyc_completed && (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">
                            Profile Verified
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-green-700">
                          Your KYC information has been submitted and verified.
                        </p>
                      </div>
                    )}

                    <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                      <p className="text-sm text-secondary-700">
                        By submitting this application, you agree to our Terms of
                        Service and authorize us to perform a credit assessment.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Navigation Buttons */}
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
                {currentStep < 5 ? (
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={nextStep}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    disabled={
                      (currentStep === 3 && !userProfile?.expenses_completed) ||
                      (currentStep === 4 && !documentStatus?.all_uploaded)
                    }
                  >
                    {currentStep === 3 && !userProfile?.expenses_completed
                      ? 'Complete Expenses to Continue'
                      : currentStep === 4 && !documentStatus?.all_uploaded
                      ? 'Upload Documents to Continue'
                      : 'Continue'}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={applyForLoan.isPending}
                    disabled={!kycStatus?.kyc_completed || !userProfile?.expenses_completed || !documentStatus?.all_uploaded}
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
