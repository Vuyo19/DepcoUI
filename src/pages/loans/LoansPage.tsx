import { Link } from 'react-router-dom'
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const loans = [
  {
    id: '1',
    amount: 10000,
    term: 12,
    interestRate: 11,
    monthlyPayment: 925,
    status: 'active',
    purpose: 'Rental Deposit',
    createdAt: '2024-10-01',
    paidMonths: 3,
  },
]

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-700',
    icon: FileText,
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  active: {
    label: 'Active',
    color: 'bg-primary-100 text-primary-700',
    icon: CheckCircle,
  },
  completed: {
    label: 'Completed',
    color: 'bg-neutral-100 text-neutral-700',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
  },
}

export function LoansPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Loans</h1>
            <p className="mt-1 text-neutral-600">
              Manage and track your loan applications
            </p>
          </div>
          <Link to="/apply">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Apply for Loan</Button>
          </Link>
        </div>

        {/* Loans List */}
        {loans.length > 0 ? (
          <div className="space-y-6">
            {loans.map((loan) => {
              const status =
                statusConfig[loan.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              const progress = (loan.paidMonths / loan.term) * 100

              return (
                <Card key={loan.id}>
                  <CardContent>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Loan Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-neutral-900">
                            {formatCurrency(loan.amount)}
                          </h3>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
                              status.color
                            )}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 text-neutral-500">{loan.purpose}</p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-4">
                          <div>
                            <p className="text-sm text-neutral-500">Term</p>
                            <p className="font-semibold text-neutral-900">
                              {loan.term} months
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Interest Rate</p>
                            <p className="font-semibold text-neutral-900">
                              {loan.interestRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">
                              Monthly Payment
                            </p>
                            <p className="font-semibold text-neutral-900">
                              {formatCurrency(loan.monthlyPayment)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Started</p>
                            <p className="font-semibold text-neutral-900">
                              {formatDate(loan.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      {loan.status === 'active' && (
                        <div className="w-full lg:w-64">
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="text-neutral-500">Progress</span>
                            <span className="font-medium text-neutral-900">
                              {loan.paidMonths}/{loan.term} payments
                            </span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                            <div
                              className="h-full rounded-full bg-primary-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" className="flex-1">
                              Make Payment
                            </Button>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="text-center">
            <CardContent className="py-12">
              <FileText className="mx-auto h-12 w-12 text-neutral-300" />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                No loans yet
              </h3>
              <p className="mt-2 text-neutral-500">
                Apply for your first rental deposit loan today
              </p>
              <Link to="/apply">
                <Button className="mt-6" leftIcon={<Plus className="h-4 w-4" />}>
                  Apply Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
