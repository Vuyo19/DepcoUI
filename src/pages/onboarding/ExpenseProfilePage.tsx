import { useNavigate } from 'react-router-dom'
import { ExpenseProfileForm } from '@/components/features'
import { useSaveExpenseProfile } from '@/hooks'

export function ExpenseProfilePage() {
  const navigate = useNavigate()
  const { mutate: saveExpenseProfile } = useSaveExpenseProfile()

  const handleComplete = (data: {
    monthlyIncome: number
    rentAmount: number
    transportCost: number
    foodExpenses: number
    utilitiesCost: number
    otherExpenses: number
  }) => {
    saveExpenseProfile(data, {
      onSuccess: () => {
        navigate('/dashboard')
      },
    })
  }

  const handleSkip = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Let's understand your finances
          </h1>
          <p className="mt-2 text-neutral-600">
            This helps us give you personalized recommendations
          </p>
        </div>
        <ExpenseProfileForm onComplete={handleComplete} onSkip={handleSkip} />
      </div>
    </div>
  )
}
