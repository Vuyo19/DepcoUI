import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface AffordabilityIndicatorProps {
  income: number
  expenses: number
}

export function AffordabilityIndicator({
  income,
  expenses,
}: AffordabilityIndicatorProps) {
  const disposableIncome = income - expenses
  const ratio = income > 0 ? (expenses / income) * 100 : 0
  const maxAffordablePayment = disposableIncome * 0.3 // 30% of disposable income

  const getStatus = () => {
    if (ratio < 50) {
      return {
        status: 'excellent',
        label: 'Excellent',
        message: 'You have great financial health!',
        icon: CheckCircle,
        color: 'text-secondary-600',
        bgColor: 'bg-secondary-50',
        barColor: 'bg-secondary-500',
      }
    } else if (ratio < 70) {
      return {
        status: 'good',
        label: 'Good',
        message: 'Your finances are healthy.',
        icon: TrendingUp,
        color: 'text-primary-600',
        bgColor: 'bg-primary-50',
        barColor: 'bg-primary-500',
      }
    } else if (ratio < 85) {
      return {
        status: 'fair',
        label: 'Fair',
        message: 'Consider reducing some expenses.',
        icon: AlertTriangle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        barColor: 'bg-amber-500',
      }
    } else {
      return {
        status: 'poor',
        label: 'Needs Attention',
        message: 'High expense ratio detected.',
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        barColor: 'bg-red-500',
      }
    }
  }

  const statusInfo = getStatus()
  const Icon = statusInfo.icon

  return (
    <div className={cn('rounded-xl p-6', statusInfo.bgColor)}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white',
            statusInfo.color
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn('font-semibold', statusInfo.color)}>
              {statusInfo.label}
            </h3>
            <span className="text-sm text-neutral-500">
              {Math.round(ratio)}% expense ratio
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">{statusInfo.message}</p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <motion.div
                className={cn('h-full rounded-full', statusInfo.barColor)}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(ratio, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-neutral-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Loan Recommendation */}
          {maxAffordablePayment > 0 && (
            <div className="mt-4 rounded-lg bg-white p-4">
              <p className="text-sm text-neutral-500">
                Based on your profile, you can comfortably afford:
              </p>
              <p className="mt-1 text-lg font-bold text-neutral-900">
                Up to {formatCurrency(maxAffordablePayment)}/month
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                This is 30% of your disposable income - a safe lending limit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
