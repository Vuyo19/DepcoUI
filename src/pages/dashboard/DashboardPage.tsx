import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import {
  Wallet,
  TrendingUp,
  Calendar,
  Plus,
  FileText,
  Bot,
  CheckCircle2,
  Sparkles,
  PartyPopper,
  GraduationCap,
  Activity,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { useUserProfile, useApiLoans, useKYCStatus, useCreditScore, type ApiLoan } from '@/hooks'

export function DashboardPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile()
  const { data: loans } = useApiLoans()
  const { data: kycStatus } = useKYCStatus()
  const { data: creditScore, isLoading: isLoadingCreditScore } = useCreditScore()

  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')

  // Navigate to profile onboarding if incomplete
  const goToProfileOnboarding = () => {
    navigate('/onboarding/profile', { state: { from: '/dashboard' } })
  }

  // Handle celebration triggers (can be called by child components)
  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 4000)
  }
  // Keep for future use
  void triggerCelebration

  // Get the most recent active loan
  const activeLoan = loans?.find((loan: ApiLoan) =>
    ['active', 'approved', 'pending'].includes(loan.status)
  )

  // Calculate profile completion percentage
  const getProfileCompletion = () => {
    if (!profile) return 0
    let completed = 0
    const total = 5

    if (profile.phone_number) completed++
    if (profile.id_number) completed++
    if (profile.monthly_income) completed++
    if (profile.expenses_completed) completed++
    if (profile.bank_verified) completed++

    return Math.round((completed / total) * 100)
  }

  const profileCompletion = getProfileCompletion()

  // Build stats based on real data
  const stats = activeLoan
    ? [
        {
          label: 'Active Loan',
          value: formatCurrency(activeLoan.amount_approved || activeLoan.amount_requested),
          icon: Wallet,
          color: 'bg-primary-100 text-primary-600',
        },
        {
          label: 'Monthly Payment',
          value: formatCurrency(activeLoan.monthly_payment || 0),
          icon: Calendar,
          color: 'bg-secondary-100 text-secondary-600',
        },
        {
          label: 'Status',
          value: activeLoan.status.charAt(0).toUpperCase() + activeLoan.status.slice(1),
          icon: TrendingUp,
          color: 'bg-accent-100 text-accent-600',
        },
      ]
    : [
        {
          label: 'Profile',
          value: `${profileCompletion}%`,
          icon: CheckCircle2,
          color: 'bg-primary-100 text-primary-600',
        },
        {
          label: 'Available',
          value: profile?.monthly_income ? formatCurrency(Math.min(15000, (profile.monthly_income - (profile.total_monthly_expenses || 0)) * 3)) : 'Complete profile',
          icon: Wallet,
          color: 'bg-secondary-100 text-secondary-600',
        },
        {
          label: 'Status',
          value: kycStatus?.kyc_completed ? 'Ready to apply' : 'Setup needed',
          icon: TrendingUp,
          color: kycStatus?.kyc_completed ? 'bg-accent-100 text-accent-600' : 'bg-neutral-100 text-neutral-600',
        },
      ]

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Celebration Toast */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white shadow-lg">
                <PartyPopper className="h-6 w-6" />
                <span className="font-medium">{celebrationMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome back, {user?.firstName || 'there'}!
          </h1>
          <p className="mt-1 text-neutral-600">
            {activeLoan
              ? "Here's your loan overview"
              : kycStatus?.kyc_completed
              ? "You're all set to apply for your rental deposit loan"
              : "Let's get you set up for your rental deposit loan"}
          </p>
        </div>

        {/* Profile Completion Banner - if not complete and no active loan */}
        {!activeLoan && !kycStatus?.kyc_completed && profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-semibold">Almost there!</h3>
                </div>
                <p className="mt-2 text-primary-100">
                  Complete your profile to unlock your loan eligibility.
                </p>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Profile completion</span>
                    <span className="font-medium">{profileCompletion}%</span>
                  </div>
                  <div className="h-2 w-64 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full rounded-full bg-white"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={goToProfileOnboarding}
                className="!bg-white !text-primary-600 hover:!bg-primary-50"
              >
                Continue Setup
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-neutral-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Active Loan Card - if has loan */}
            {activeLoan ? (
              <Card>
                <CardHeader>
                  <CardTitle>Current Loan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-3xl font-bold text-neutral-900">
                        {formatCurrency(activeLoan.amount_approved || activeLoan.amount_requested)}
                      </p>
                      <p className="mt-1 text-neutral-500">
                        {activeLoan.term_months}-month term at {activeLoan.interest_rate || 12}% interest
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Monthly payment</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(activeLoan.monthly_payment || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  {activeLoan.status === 'active' && activeLoan.term_months > 0 && (
                    <div className="mt-6 pt-4 border-t border-neutral-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-500">Progress</span>
                        <span className="font-medium text-neutral-900">
                          {activeLoan.paid_months ?? 0}/{activeLoan.term_months} payments
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${((activeLoan.paid_months ?? 0) / activeLoan.term_months) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-4">
                    <Link to="/loans">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    {activeLoan.status === 'active' && (
                      <Button size="sm">Make Payment</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* No Loan - Show journey steps */
              <Card>
                <CardHeader>
                  <CardTitle>Your Loan Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Complete your profile',
                        done: profile?.profile_completed || (profile?.phone_number && profile?.id_number),
                        link: '/onboarding/profile',
                      },
                      {
                        title: 'Add your expenses',
                        done: profile?.expenses_completed,
                        link: '/onboarding/expenses',
                      },
                      {
                        title: 'Verify your bank account',
                        done: profile?.bank_verified,
                        link: '/apply/bank-verify',
                      },
                      {
                        title: 'Apply for your loan',
                        done: false,
                        link: '/apply',
                        disabled: !(
                          (profile?.profile_completed || (profile?.phone_number && profile?.id_number)) &&
                          profile?.expenses_completed &&
                          profile?.bank_verified
                        ),
                      },
                    ].map((step, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-neutral-100 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              step.done
                                ? 'bg-green-100 text-green-600'
                                : 'bg-neutral-100 text-neutral-400'
                            }`}
                          >
                            {step.done ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-medium">{i + 1}</span>
                            )}
                          </div>
                          <span
                            className={
                              step.done ? 'text-neutral-500 line-through' : 'text-neutral-900'
                            }
                          >
                            {step.title}
                          </span>
                        </div>
                        {!step.done && (
                          <Link to={step.link || '#'}>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={step.disabled}
                            >
                              {step.disabled ? 'Complete above first' : 'Start'}
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Health - if has income data */}
            {profile?.monthly_income && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Financial Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-neutral-50 p-4">
                      <p className="text-sm text-neutral-500">Monthly Income</p>
                      <p className="text-xl font-bold text-neutral-900">
                        {formatCurrency(profile.monthly_income)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-4">
                      <p className="text-sm text-neutral-500">Total Expenses</p>
                      <p className="text-xl font-bold text-neutral-900">
                        {formatCurrency(profile.total_monthly_expenses || 0)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-primary-50 p-4">
                      <p className="text-sm text-primary-600">Available</p>
                      <p className="text-xl font-bold text-primary-700">
                        {formatCurrency(
                          (profile.monthly_income || 0) - (profile.total_monthly_expenses || 0)
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credit Score Card */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary-600" />
                  Credit Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoadingCreditScore ? (
                  <div className="flex items-center justify-center py-4">
                    <Spinner className="h-6 w-6" />
                  </div>
                ) : creditScore ? (
                  <div className="text-center">
                    {/* Score Circle */}
                    <div className="relative mx-auto h-32 w-32">
                      <svg className="h-32 w-32 -rotate-90 transform">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-neutral-100"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={`${(creditScore.score / 100) * 351.86} 351.86`}
                          className={
                            creditScore.rating_color === 'green'
                              ? 'text-green-500'
                              : creditScore.rating_color === 'blue'
                              ? 'text-blue-500'
                              : creditScore.rating_color === 'yellow'
                              ? 'text-yellow-500'
                              : creditScore.rating_color === 'orange'
                              ? 'text-orange-500'
                              : 'text-red-500'
                          }
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-neutral-900">
                          {creditScore.score}
                        </span>
                        <span className="text-xs text-neutral-500">out of 100</span>
                      </div>
                    </div>
                    <p
                      className={`mt-3 text-sm font-medium ${
                        creditScore.rating_color === 'green'
                          ? 'text-green-600'
                          : creditScore.rating_color === 'blue'
                          ? 'text-blue-600'
                          : creditScore.rating_color === 'yellow'
                          ? 'text-yellow-600'
                          : creditScore.rating_color === 'orange'
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {creditScore.rating}
                    </p>
                    <Link to="/simulator" className="mt-4 block">
                      <Button size="sm" className="w-full gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Credit Simulator
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-500 mb-3">
                      Complete your profile to see your credit score
                    </p>
                    <Link to="/onboarding/profile">
                      <Button size="sm" variant="outline">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/apply" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    disabled={!kycStatus?.kyc_completed}
                  >
                    <Plus className="h-4 w-4" />
                    Apply for Loan
                  </Button>
                </Link>
                {loans && loans.length > 0 && (
                  <Link to="/loans" className="block">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <FileText className="h-4 w-4" />
                      View All Loans
                    </Button>
                  </Link>
                )}
                <Link to="/simulator" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Activity className="h-4 w-4" />
                    Credit Simulator
                  </Button>
                </Link>
                <Link to="/learn" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <GraduationCap className="h-4 w-4" />
                    Financial Education
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Bot className="h-4 w-4" />
                  Ask Depi
                </Button>
              </CardContent>
            </Card>

            {/* Tips from Depi */}
            <Card className="border-primary-200 bg-primary-50">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                    <Sparkles className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">Tip from Depi</h3>
                    <p className="mt-1 text-sm text-primary-700">
                      {!kycStatus?.kyc_completed
                        ? "Complete your profile to see how much you can borrow. It only takes a minute!"
                        : profile?.monthly_income && !profile?.expenses_completed
                        ? "Adding your expenses helps me give you more accurate loan recommendations."
                        : !profile?.bank_verified
                        ? "Verify your bank account to speed up your loan application."
                        : "You're all set! Ready to apply for your rental deposit loan?"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
