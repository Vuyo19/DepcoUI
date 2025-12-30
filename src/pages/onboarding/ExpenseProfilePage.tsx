import { useNavigate } from 'react-router-dom'
import { ExpenseProfileForm } from '@/components/features'
import { useUpdateExpenses, useUpdateProfile } from '@/hooks'

export function ExpenseProfilePage() {
  const navigate = useNavigate()
  const { mutateAsync: updateExpenses } = useUpdateExpenses()
  const { mutateAsync: updateProfile } = useUpdateProfile()

  const handleComplete = async (data: {
    monthlyIncome: number
    rentAmount: number
    transportCost: number
    foodExpenses: number
    utilitiesCost: number
    otherExpenses: number
  }) => {
    // Save monthly income to profile
    await updateProfile({ monthly_income: data.monthlyIncome })

    // Save expenses with correct field names for backend
    await updateExpenses({
      expense_rent: data.rentAmount,
      expense_transport: data.transportCost,
      expense_groceries: data.foodExpenses,
      expense_utilities: data.utilitiesCost,
      expense_other: data.otherExpenses,
    })

    navigate('/dashboard')
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
