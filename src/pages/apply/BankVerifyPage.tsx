import { useNavigate, useLocation } from 'react-router-dom'
import { BankVerificationForm, type BankFormData } from '@/components/features/BankVerificationForm'
import { useUpdateProfile } from '@/hooks'

export function BankVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutateAsync: updateProfile } = useUpdateProfile()

  // Get redirect path from state, default to /dashboard
  const redirectTo = (location.state as { from?: string })?.from || '/dashboard'

  const handleComplete = async (data: BankFormData) => {
    // Save bank details and mark as verified
    await updateProfile({
      bank_name: data.bank_name,
      bank_account_type: data.account_type,
      bank_verified: true,
    })
    navigate(redirectTo)
  }

  const handleSkip = () => {
    navigate(redirectTo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Verify Your Bank Account
          </h1>
          <p className="mt-2 text-neutral-600">
            Quick and secure - helps us deposit funds faster
          </p>
        </div>
        <BankVerificationForm
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      </div>
    </div>
  )
}
