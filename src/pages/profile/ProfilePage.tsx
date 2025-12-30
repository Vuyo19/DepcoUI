import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, CreditCard, Save, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { useUserProfile, useUpdateProfile, useUpdateExpenses } from '@/hooks'
import { formatCurrency } from '@/lib/utils'

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string(),
  idNumber: z.string(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const expenseSchema = z.object({
  monthlyIncome: z.number().min(0),
  rentAmount: z.number().min(0),
  transportCost: z.number().min(0),
  foodExpenses: z.number().min(0),
  utilitiesCost: z.number().min(0),
  otherExpenses: z.number().min(0),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

export function ProfilePage() {
  const { user } = useUser()
  const { data: userProfile, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()
  const updateExpenses = useUpdateExpenses()

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.primaryEmailAddress?.emailAddress || '',
      phoneNumber: '',
      idNumber: '',
    },
  })

  const expenseForm = useForm<ExpenseFormData>({
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

  // Load profile data when available
  useEffect(() => {
    if (userProfile || user) {
      profileForm.reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        phoneNumber: userProfile?.phone_number || '',
        idNumber: userProfile?.id_number || '',
      })
    }
    if (userProfile) {
      expenseForm.reset({
        monthlyIncome: userProfile.monthly_income || 0,
        rentAmount: userProfile.expense_rent || 0,
        transportCost: userProfile.expense_transport || 0,
        foodExpenses: userProfile.expense_groceries || 0,
        utilitiesCost: userProfile.expense_utilities || 0,
        otherExpenses: userProfile.expense_other || 0,
      })
    }
  }, [userProfile, user])

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        phone_number: data.phoneNumber,
        id_number: data.idNumber,
      })
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const onExpenseSubmit = async (data: ExpenseFormData) => {
    try {
      await updateExpenses.mutateAsync({
        expense_rent: data.rentAmount,
        expense_utilities: data.utilitiesCost,
        expense_groceries: data.foodExpenses,
        expense_transport: data.transportCost,
        expense_other: data.otherExpenses,
      })
      toast.success('Expense profile saved successfully')
    } catch {
      toast.error('Failed to save expense profile')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-500" />
          <p className="mt-2 text-neutral-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const totalExpenses = (userProfile?.expense_rent || 0) +
    (userProfile?.expense_utilities || 0) +
    (userProfile?.expense_groceries || 0) +
    (userProfile?.expense_transport || 0) +
    (userProfile?.expense_insurance || 0) +
    (userProfile?.expense_debt_payments || 0) +
    (userProfile?.expense_other || 0)

  const disposableIncome = (userProfile?.monthly_income || 0) - totalExpenses

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
          <p className="mt-1 text-neutral-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    leftIcon={<User className="h-5 w-5" />}
                    {...profileForm.register('firstName')}
                  />
                  <Input
                    label="Last Name"
                    leftIcon={<User className="h-5 w-5" />}
                    {...profileForm.register('lastName')}
                  />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  leftIcon={<Mail className="h-5 w-5" />}
                  disabled
                  {...profileForm.register('email')}
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Phone Number"
                    leftIcon={<Phone className="h-5 w-5" />}
                    {...profileForm.register('phoneNumber')}
                  />
                  <Input
                    label="SA ID Number"
                    leftIcon={<CreditCard className="h-5 w-5" />}
                    {...profileForm.register('idNumber')}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    leftIcon={<Save className="h-4 w-4" />}
                    isLoading={updateProfile.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Expense Profile */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expense Profile</CardTitle>
              {userProfile?.expenses_completed && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {userProfile?.expenses_completed && (
                <div className="mb-6 rounded-xl bg-green-50 p-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Monthly Income:</span>
                      <span className="font-medium text-green-900">{formatCurrency(userProfile.monthly_income || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Total Expenses:</span>
                      <span className="font-medium text-green-900">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="font-medium text-green-700">Disposable Income:</span>
                      <span className={`font-bold ${disposableIncome >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                        {formatCurrency(disposableIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <p className="mb-6 text-sm text-neutral-600">
                Help us understand your monthly expenses to provide personalized
                financial advice and better loan offers.
              </p>
              <form
                onSubmit={expenseForm.handleSubmit(onExpenseSubmit)}
                className="space-y-6"
              >
                <Input
                  label="Monthly Net Income"
                  type="number"
                  leftIcon={<span className="text-sm">R</span>}
                  hint="Your take-home pay after tax"
                  {...expenseForm.register('monthlyIncome', {
                    valueAsNumber: true,
                  })}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Current Rent"
                    type="number"
                    leftIcon={<span className="text-sm">R</span>}
                    {...expenseForm.register('rentAmount', {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    label="Transport Costs"
                    type="number"
                    leftIcon={<span className="text-sm">R</span>}
                    hint="Petrol, taxi, Uber, etc."
                    {...expenseForm.register('transportCost', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Food & Groceries"
                    type="number"
                    leftIcon={<span className="text-sm">R</span>}
                    {...expenseForm.register('foodExpenses', {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    label="Utilities"
                    type="number"
                    leftIcon={<span className="text-sm">R</span>}
                    hint="Electricity, water, etc."
                    {...expenseForm.register('utilitiesCost', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <Input
                  label="Other Expenses"
                  type="number"
                  leftIcon={<span className="text-sm">R</span>}
                  hint="Entertainment, subscriptions, etc."
                  {...expenseForm.register('otherExpenses', {
                    valueAsNumber: true,
                  })}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    leftIcon={<Save className="h-4 w-4" />}
                    isLoading={updateExpenses.isPending}
                  >
                    Save Expenses
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
