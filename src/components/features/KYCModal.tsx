import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, MapPin, Phone, CreditCard, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'

const kycSchema = z.object({
  // Personal Info
  phone_number: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^(\+27|0)[0-9]{9}$/, 'Enter a valid SA phone number'),
  id_number: z
    .string()
    .length(13, 'SA ID number must be 13 digits')
    .regex(/^[0-9]{13}$/, 'ID number must contain only digits'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),

  // Address
  address_street: z.string().min(5, 'Street address is required'),
  address_city: z.string().min(2, 'City is required'),
  address_province: z.string().min(1, 'Province is required'),
  address_postal_code: z
    .string()
    .length(4, 'Postal code must be 4 digits')
    .regex(/^[0-9]{4}$/, 'Postal code must contain only digits'),

  // Employment
  employment_type: z.string().min(1, 'Employment type is required'),
  employer_name: z.string().optional(),
  monthly_income: z.string().min(1, 'Monthly income is required'),
})

type KYCFormData = z.infer<typeof kycSchema>

interface KYCModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: KYCFormData) => Promise<void>
  existingData?: Partial<KYCFormData>
}

const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
]

const employmentTypes = [
  { value: 'full_time', label: 'Full-time employed' },
  { value: 'part_time', label: 'Part-time employed' },
  { value: 'contract', label: 'Contract worker' },
  { value: 'self_employed', label: 'Self-employed' },
  { value: 'student', label: 'Student' },
]

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Employment', icon: CreditCard },
]

export function KYCModal({ isOpen, onClose, onComplete, existingData }: KYCModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: existingData,
  })

  const employmentType = watch('employment_type')

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof KYCFormData)[] = []

    switch (step) {
      case 1:
        fieldsToValidate = ['phone_number', 'id_number', 'date_of_birth']
        break
      case 2:
        fieldsToValidate = ['address_street', 'address_city', 'address_province', 'address_postal_code']
        break
      case 3:
        fieldsToValidate = ['employment_type', 'monthly_income']
        break
    }

    return await trigger(fieldsToValidate)
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: KYCFormData) => {
    setIsSubmitting(true)
    try {
      await onComplete(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 mx-4 w-full max-w-lg"
        >
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="border-b border-neutral-200 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
                  <p className="mt-1 text-sm text-primary-100">
                    We need a few more details to process your loan application
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="mt-4 flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          isActive
                            ? 'bg-white text-primary-600'
                            : isCompleted
                              ? 'bg-primary-400 text-white'
                              : 'bg-primary-400/50 text-white/70'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`mx-2 h-1 w-12 rounded-full ${
                            isCompleted ? 'bg-primary-400' : 'bg-primary-400/30'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
                      <p className="text-sm text-neutral-500">
                        This information is required for identity verification under FICA regulations.
                      </p>

                      <Input
                        label="Phone Number"
                        placeholder="0821234567"
                        leftIcon={<Phone className="h-4 w-4" />}
                        error={errors.phone_number?.message}
                        {...register('phone_number')}
                      />

                      <Input
                        label="SA ID Number"
                        placeholder="9001015009087"
                        leftIcon={<CreditCard className="h-4 w-4" />}
                        error={errors.id_number?.message}
                        maxLength={13}
                        {...register('id_number')}
                      />

                      <Input
                        label="Date of Birth"
                        type="date"
                        error={errors.date_of_birth?.message}
                        {...register('date_of_birth')}
                      />
                    </motion.div>
                  )}

                  {/* Step 2: Address */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-neutral-900">Residential Address</h3>
                      <p className="text-sm text-neutral-500">
                        Your current residential address for correspondence.
                      </p>

                      <Input
                        label="Street Address"
                        placeholder="123 Main Road, Apartment 4B"
                        leftIcon={<MapPin className="h-4 w-4" />}
                        error={errors.address_street?.message}
                        {...register('address_street')}
                      />

                      <Input
                        label="City/Town"
                        placeholder="Johannesburg"
                        error={errors.address_city?.message}
                        {...register('address_city')}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Province
                          </label>
                          <select
                            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              errors.address_province
                                ? 'border-red-500'
                                : 'border-neutral-300'
                            }`}
                            {...register('address_province')}
                          >
                            <option value="">Select province</option>
                            {provinces.map((province) => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </select>
                          {errors.address_province && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.address_province.message}
                            </p>
                          )}
                        </div>

                        <Input
                          label="Postal Code"
                          placeholder="2000"
                          error={errors.address_postal_code?.message}
                          maxLength={4}
                          {...register('address_postal_code')}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Employment */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-neutral-900">Employment Details</h3>
                      <p className="text-sm text-neutral-500">
                        This helps us assess your loan affordability.
                      </p>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          Employment Type
                        </label>
                        <select
                          className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.employment_type
                              ? 'border-red-500'
                              : 'border-neutral-300'
                          }`}
                          {...register('employment_type')}
                        >
                          <option value="">Select employment type</option>
                          {employmentTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {errors.employment_type && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.employment_type.message}
                          </p>
                        )}
                      </div>

                      {employmentType && employmentType !== 'student' && (
                        <Input
                          label="Employer Name"
                          placeholder="Company name"
                          error={errors.employer_name?.message}
                          {...register('employer_name')}
                        />
                      )}

                      <Input
                        label="Monthly Income (before tax)"
                        placeholder="25000"
                        type="number"
                        leftIcon={<span className="text-sm text-neutral-500">R</span>}
                        error={errors.monthly_income?.message}
                        {...register('monthly_income')}
                      />

                      <div className="rounded-lg bg-primary-50 p-4">
                        <p className="text-sm text-primary-700">
                          <strong>Privacy Notice:</strong> Your information is protected under POPIA
                          and will only be used for loan assessment purposes.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-6 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    rightIcon={<Check className="h-4 w-4" />}
                  >
                    Complete Profile
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
