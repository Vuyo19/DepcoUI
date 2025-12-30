import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  CheckCircle,
  Crown,
  Lock,
  Send,
  Sparkles,
  ArrowLeft,
  Info,
  Wallet,
  CreditCard,
  PlusCircle,
  X,
  Trash2,
  Plus,
  Building,
  ShoppingBag,
  Car,
  Eye,
  EyeOff,
  Layers,
  Download,
  TrendingDown,
  TrendingUp,
  FileText,
  Edit2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import {
  useCreditScore,
  useCreditTips,
  useSimulatorAccess,
  useAISimulation,
  useSubscribeToSimulator,
  useCreditPortfolio,
  useAddExternalAccount,
  useDeleteExternalAccount,
  useMultiScenarioSimulation,
  useCreditScenarios,
  useSaveScenario,
  useUpdateScenario,
  useDeleteScenario,
  useSeedScenarios,
  useImportedScore,
  useImportScore,
  useDeleteImportedScore,
  type CreditTip,
  type CreditItem,
  type MultiScenarioSimulationResult,
  type ImportedCreditScore,
} from '@/hooks'

// Account type options
const ACCOUNT_TYPES = [
  { value: 'store_card', label: 'Store Card', icon: ShoppingBag, example: 'Woolworths, Edgars' },
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard, example: 'FNB, ABSA' },
  { value: 'personal_loan', label: 'Personal Loan', icon: Building, example: 'Bank loan' },
  { value: 'clothing_account', label: 'Clothing Account', icon: ShoppingBag, example: 'Mr Price, Truworths' },
  { value: 'furniture_account', label: 'Furniture Account', icon: Building, example: 'Lewis, JD Group' },
  { value: 'vehicle_finance', label: 'Vehicle Finance', icon: Car, example: 'Car payment' },
  { value: 'bnpl', label: 'Buy Now Pay Later', icon: CreditCard, example: 'Payflex, Mobicred' },
  { value: 'other', label: 'Other', icon: Wallet, example: 'Other credit' },
]

// Risk level colors
const RISK_COLORS = {
  low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  moderate: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  very_high: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
}

const RISK_DESCRIPTIONS = {
  low: 'Comfortable - you\'ll still have healthy breathing room',
  moderate: 'Manageable - watch your spending carefully',
  high: 'Tight budget - consider if this is essential',
  very_high: 'Overextended - high risk of financial stress',
}

// Credit bureau options (South African bureaus)
const CREDIT_BUREAUS = [
  { value: 'transunion', label: 'TransUnion', minScore: 0, maxScore: 999 },
  { value: 'experian', label: 'Experian', minScore: 0, maxScore: 999 },
  { value: 'xds', label: 'XDS', minScore: 0, maxScore: 999 },
  { value: 'compuscan', label: 'Compuscan', minScore: 0, maxScore: 999 },
  { value: 'other', label: 'Other', minScore: 300, maxScore: 850 },
]

// Calculate DTI status
function getDtiStatus(dti: number): 'safe' | 'caution' | 'risky' {
  if (dti <= 30) return 'safe'
  if (dti <= 50) return 'caution'
  return 'risky'
}

function getDtiColor(dti: number) {
  if (dti <= 30) return { bg: 'bg-green-500', text: 'text-green-600' }
  if (dti <= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-600' }
  return { bg: 'bg-red-500', text: 'text-red-600' }
}

function getRiskLevel(dti: number): 'low' | 'moderate' | 'high' | 'very_high' {
  if (dti <= 30) return 'low'
  if (dti <= 40) return 'moderate'
  if (dti <= 50) return 'high'
  return 'very_high'
}

// Add External Account Modal
function AddAccountModal({
  isOpen,
  onClose,
  onAdd,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: {
    account_type: string
    provider_name: string
    credit_limit?: number
    current_balance: number
    interest_rate: number
    minimum_payment: number
    payment_status: string
  }) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    account_type: 'store_card',
    provider_name: '',
    credit_limit: '',
    current_balance: '',
    interest_rate: '',
    minimum_payment: '',
    payment_status: 'on_time',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      account_type: formData.account_type,
      provider_name: formData.provider_name,
      credit_limit: formData.credit_limit ? parseFloat(formData.credit_limit) : undefined,
      current_balance: parseFloat(formData.current_balance),
      interest_rate: parseFloat(formData.interest_rate),
      minimum_payment: parseFloat(formData.minimum_payment),
      payment_status: formData.payment_status,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Add Credit Account</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.slice(0, 6).map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, account_type: type.value })}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                      formData.account_type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-neutral-500" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{type.label}</p>
                      <p className="text-xs text-neutral-500">{type.example}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Provider Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Woolworths, FNB Gold Card"
              value={formData.provider_name}
              onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Credit Limit (optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neutral-500">R</span>
                <input
                  type="number"
                  placeholder="15,000"
                  value={formData.credit_limit}
                  onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2 pl-7 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Current Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neutral-500">R</span>
                <input
                  type="number"
                  required
                  placeholder="8,500"
                  value={formData.current_balance}
                  onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2 pl-7 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                required
                step="0.1"
                placeholder="21"
                value={formData.interest_rate}
                onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Monthly Payment</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neutral-500">R</span>
                <input
                  type="number"
                  required
                  placeholder="850"
                  value={formData.minimum_payment}
                  onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2 pl-7 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Payment Status</label>
            <div className="flex gap-2">
              {[
                { value: 'on_time', label: 'On Time', color: 'green' },
                { value: 'late', label: 'Late', color: 'yellow' },
                { value: 'in_arrears', label: 'In Arrears', color: 'red' },
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, payment_status: status.value })}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                    formData.payment_status === status.value
                      ? status.color === 'green'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : status.color === 'yellow'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Spinner className="h-4 w-4" /> : 'Add Account'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Import Credit Score Modal
function ImportScoreModal({
  isOpen,
  onClose,
  onImport,
  isLoading,
  existingScore,
}: {
  isOpen: boolean
  onClose: () => void
  onImport: (data: { score: number; bureau: string; min_score: number; max_score: number }) => void
  isLoading: boolean
  existingScore: ImportedCreditScore | null | undefined
}) {
  const [formData, setFormData] = useState({
    bureau: existingScore?.bureau || 'transunion',
    score: existingScore?.score?.toString() || '',
  })

  const selectedBureau = CREDIT_BUREAUS.find(b => b.value === formData.bureau) || CREDIT_BUREAUS[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const score = parseInt(formData.score)
    if (isNaN(score) || score < selectedBureau.minScore || score > selectedBureau.maxScore) {
      return
    }
    onImport({
      score,
      bureau: formData.bureau,
      min_score: selectedBureau.minScore,
      max_score: selectedBureau.maxScore,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            {existingScore ? 'Update Credit Score' : 'Import Credit Score'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Why import your credit score?</p>
              <p className="mt-1">
                Importing your actual credit bureau score helps us show you how new credit might affect your score in "what if" scenarios.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Credit Bureau</label>
            <div className="grid grid-cols-2 gap-2">
              {CREDIT_BUREAUS.map((bureau) => (
                <button
                  key={bureau.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, bureau: bureau.value, score: '' })}
                  className={`rounded-lg border py-2 px-3 text-sm font-medium transition-all ${
                    formData.bureau === bureau.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-primary-200'
                  }`}
                >
                  {bureau.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Your Credit Score
            </label>
            <input
              type="number"
              required
              min={selectedBureau.minScore}
              max={selectedBureau.maxScore}
              placeholder={`${selectedBureau.minScore} - ${selectedBureau.maxScore}`}
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-lg font-semibold text-center focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <p className="mt-1 text-xs text-neutral-500 text-center">
              Score range: {selectedBureau.minScore} - {selectedBureau.maxScore}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.score} className="flex-1">
              {isLoading ? <Spinner className="h-4 w-4" /> : existingScore ? 'Update Score' : 'Import Score'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Define CreditScenario type for editing
interface EditableScenario {
  id: number
  name: string
  description?: string
  credit_items: CreditItem[]
}

// Scenario Builder Modal
function ScenarioBuilderModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  simulationResult,
  onSimulate,
  isSimulating,
  editingScenario,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, items: CreditItem[], id?: number) => void
  isLoading: boolean
  simulationResult: MultiScenarioSimulationResult | null
  onSimulate: (items: CreditItem[]) => void
  isSimulating: boolean
  editingScenario?: EditableScenario | null
}) {
  const [scenarioName, setScenarioName] = useState('')
  const [creditItems, setCreditItems] = useState<CreditItem[]>([
    { type: 'store_card', provider: '', amount: 5000, interest_rate: 21, term_months: 12 },
  ])

  // Populate form when editing
  useEffect(() => {
    if (editingScenario) {
      setScenarioName(editingScenario.name)
      setCreditItems(editingScenario.credit_items.map(item => ({
        type: item.type,
        provider: item.provider,
        amount: item.amount,
        interest_rate: item.interest_rate,
        term_months: item.term_months,
      })))
    } else {
      setScenarioName('')
      setCreditItems([{ type: 'store_card', provider: '', amount: 5000, interest_rate: 21, term_months: 12 }])
    }
  }, [editingScenario])

  const addCreditItem = () => {
    setCreditItems([
      ...creditItems,
      { type: 'store_card', provider: '', amount: 5000, interest_rate: 21, term_months: 12 },
    ])
  }

  const removeCreditItem = (index: number) => {
    setCreditItems(creditItems.filter((_, i) => i !== index))
  }

  const updateCreditItem = (index: number, field: keyof CreditItem, value: string | number) => {
    setCreditItems(
      creditItems.map((item, i) =>
        i === index ? { ...item, [field]: typeof value === 'string' && field !== 'type' && field !== 'provider' ? parseFloat(value) || 0 : value } : item
      )
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">
            {editingScenario ? 'Edit Scenario' : 'Create "What If" Scenario'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Scenario Name</label>
            <input
              type="text"
              placeholder="e.g., Woolworths + Personal Loan"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">New Credit to Add</label>
            <div className="space-y-3">
              {creditItems.map((item, index) => (
                <div key={index} className="rounded-xl border border-neutral-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-600">Credit Item #{index + 1}</span>
                    {creditItems.length > 1 && (
                      <button onClick={() => removeCreditItem(index)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Type</label>
                      <select
                        value={item.type}
                        onChange={(e) => updateCreditItem(index, 'type', e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      >
                        {ACCOUNT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Provider</label>
                      <input
                        type="text"
                        placeholder="e.g., Woolworths"
                        value={item.provider}
                        onChange={(e) => updateCreditItem(index, 'provider', e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Amount (R)</label>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateCreditItem(index, 'amount', e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={item.interest_rate}
                        onChange={(e) => updateCreditItem(index, 'interest_rate', e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-neutral-500 mb-1">Term (months)</label>
                      <div className="flex gap-2">
                        {[6, 12, 24, 36].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => updateCreditItem(index, 'term_months', term)}
                            className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition-all ${
                              item.term_months === term
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-neutral-200 text-neutral-600'
                            }`}
                          >
                            {term}mo
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addCreditItem}
              className="mt-3 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4" />
              Add Another Credit Item
            </button>
          </div>

          {simulationResult && (
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
              <h4 className="text-sm font-medium text-primary-900 mb-3">Impact on Your Portfolio</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-primary-600">New Monthly Payment</p>
                  <p className="text-lg font-bold text-primary-900">+{formatCurrency(simulationResult.total_new_monthly_payment)}</p>
                </div>
                <div>
                  <p className="text-xs text-primary-600">Total Interest Cost</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(simulationResult.total_new_interest)}</p>
                </div>
                <div>
                  <p className="text-xs text-primary-600">New DTI Ratio</p>
                  <p className={`text-lg font-bold ${getDtiColor(simulationResult.projected_dti).text}`}>
                    {simulationResult.projected_dti}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-primary-600">Risk Level</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${RISK_COLORS[simulationResult.risk_level]?.bg} ${RISK_COLORS[simulationResult.risk_level]?.text}`}>
                    {simulationResult.risk_level.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-700">{simulationResult.recommendation}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-6 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSimulate(creditItems)}
            disabled={isSimulating}
            className="flex-1"
          >
            {isSimulating ? <Spinner className="h-4 w-4" /> : 'Preview Impact'}
          </Button>
          <Button
            type="button"
            onClick={() => onSave(scenarioName, creditItems, editingScenario?.id)}
            disabled={isLoading || !scenarioName.trim()}
            className="flex-1"
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : editingScenario ? 'Update Scenario' : 'Save Scenario'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export function CreditSimulatorPage() {
  const { data: creditScore, isLoading: isLoadingScore } = useCreditScore()
  const { data: creditTips, isLoading: isLoadingTips } = useCreditTips()
  const { data: access, isLoading: isLoadingAccess } = useSimulatorAccess()
  const { data: portfolio, isLoading: isLoadingPortfolio } = useCreditPortfolio()
  const { data: savedScenarios } = useCreditScenarios()
  const { data: importedScore } = useImportedScore()

  const aiSimulation = useAISimulation()
  const subscribe = useSubscribeToSimulator()
  const addExternalAccount = useAddExternalAccount()
  const deleteExternalAccount = useDeleteExternalAccount()
  const multiScenarioSim = useMultiScenarioSimulation()
  const saveScenario = useSaveScenario()
  const updateScenario = useUpdateScenario()
  const deleteScenario = useDeleteScenario()
  const seedScenarios = useSeedScenarios()
  const importScore = useImportScore()
  const deleteImportedScore = useDeleteImportedScore()

  // UI State
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [showScenarioBuilder, setShowScenarioBuilder] = useState(false)
  const [showImportScoreModal, setShowImportScoreModal] = useState(false)
  const [scenarioSimResult, setScenarioSimResult] = useState<MultiScenarioSimulationResult | null>(null)
  const [editingScenario, setEditingScenario] = useState<EditableScenario | null>(null)

  // Active scenario for portfolio preview
  const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null)

  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState<{
    question: string
    analysis: string
    recommendations: string[]
  } | null>(null)

  // Find active scenario details
  const activeScenario = savedScenarios?.find(s => s.id === activeScenarioId)

  // Calculate projected portfolio values when scenario is active
  const projectedValues = useMemo(() => {
    if (!portfolio || !activeScenario) return null

    const scenarioDebt = activeScenario.projected_total_debt || 0
    const scenarioPayment = activeScenario.projected_monthly_payment || 0

    const projectedDebt = portfolio.total_credit_used + scenarioDebt
    const projectedPayments = portfolio.total_monthly_payments + scenarioPayment
    const projectedDti = portfolio.monthly_income > 0
      ? (projectedPayments / portfolio.monthly_income) * 100
      : 0

    return {
      total_credit_used: projectedDebt,
      total_monthly_payments: projectedPayments,
      dti_ratio: Math.round(projectedDti * 10) / 10,
      dti_status: getDtiStatus(projectedDti),
      risk_level: getRiskLevel(projectedDti),
      scenario_debt: scenarioDebt,
      scenario_payment: scenarioPayment,
      scenario_interest: activeScenario.projected_total_interest || 0,
    }
  }, [portfolio, activeScenario])

  // Display values (current or projected if scenario active)
  const displayValues = projectedValues || portfolio

  const handleAddAccount = async (data: Parameters<typeof addExternalAccount.mutateAsync>[0]) => {
    try {
      await addExternalAccount.mutateAsync(data)
      setShowAddAccountModal(false)
    } catch (error) {
      console.error('Failed to add account:', error)
    }
  }

  const handleDeleteAccount = async (id: number) => {
    if (confirm('Are you sure you want to remove this account?')) {
      await deleteExternalAccount.mutateAsync(id)
    }
  }

  const handleSaveScenario = async (name: string, items: CreditItem[], id?: number) => {
    try {
      if (id) {
        // Update existing scenario
        await updateScenario.mutateAsync({ id, name, credit_items: items })
      } else {
        // Create new scenario
        await saveScenario.mutateAsync({ name, credit_items: items })
      }
      setShowScenarioBuilder(false)
      setScenarioSimResult(null)
      setEditingScenario(null)
    } catch (error) {
      console.error('Failed to save scenario:', error)
    }
  }

  const handleEditScenario = (scenario: EditableScenario) => {
    setEditingScenario(scenario)
    setShowScenarioBuilder(true)
  }

  const handleScenarioSimulate = async (items: CreditItem[]) => {
    try {
      const result = await multiScenarioSim.mutateAsync(items)
      setScenarioSimResult(result)
    } catch (error) {
      console.error('Scenario simulation failed:', error)
    }
  }

  const handleAIQuestion = async () => {
    if (!aiQuestion.trim() || !access?.has_access) return

    try {
      const result = await aiSimulation.mutateAsync({ question: aiQuestion })
      setAiResponse({
        question: result.question,
        analysis: result.analysis,
        recommendations: result.recommendations,
      })
      setAiQuestion('')
    } catch (error) {
      console.error('AI simulation failed:', error)
    }
  }

  const handleSubscribe = async (plan: 'monthly' | 'annual') => {
    try {
      await subscribe.mutateAsync(plan)
    } catch (error) {
      console.error('Subscribe failed:', error)
    }
  }

  const handleImportScore = async (data: { score: number; bureau: string; min_score: number; max_score: number }) => {
    try {
      await importScore.mutateAsync(data)
      setShowImportScoreModal(false)
    } catch (error) {
      console.error('Failed to import score:', error)
    }
  }

  const handleDeleteImportedScore = async () => {
    if (confirm('Are you sure you want to remove your imported credit score?')) {
      try {
        await deleteImportedScore.mutateAsync()
      } catch (error) {
        console.error('Failed to delete imported score:', error)
      }
    }
  }

  if (isLoadingScore || isLoadingAccess || isLoadingPortfolio) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const currentDtiColor = getDtiColor(portfolio?.dti_ratio || 0)
  const projectedDtiColor = projectedValues ? getDtiColor(projectedValues.dti_ratio) : null

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Credit Simulator</h1>
          <p className="mt-1 text-neutral-600">
            See your full financial picture and simulate "what if" scenarios
          </p>
        </div>

        {/* Paywall */}
        {!access?.has_access && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50">
              <CardContent className="py-8">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                    <Crown className="h-8 w-8 text-primary-600" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-neutral-900">Unlock Credit Simulator</h2>
                  <p className="mt-2 max-w-md text-neutral-600">
                    Get access to "what if" scenarios, portfolio tracking, and AI-powered insights.
                  </p>
                  <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center">
                      <p className="text-sm text-neutral-500">Monthly</p>
                      <p className="mt-1 text-3xl font-bold text-neutral-900">
                        R{access?.pricing?.monthly || 49}<span className="text-base font-normal text-neutral-500">/mo</span>
                      </p>
                      <Button onClick={() => handleSubscribe('monthly')} className="mt-4 w-full" disabled={subscribe.isPending}>
                        {subscribe.isPending ? <Spinner className="h-4 w-4" /> : 'Subscribe'}
                      </Button>
                    </div>
                    <div className="relative rounded-xl border-2 border-primary-500 bg-white p-6 text-center">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
                        Save R189
                      </span>
                      <p className="text-sm text-neutral-500">Annual</p>
                      <p className="mt-1 text-3xl font-bold text-neutral-900">
                        R{access?.pricing?.annual || 399}<span className="text-base font-normal text-neutral-500">/yr</span>
                      </p>
                      <Button onClick={() => handleSubscribe('annual')} className="mt-4 w-full" disabled={subscribe.isPending}>
                        {subscribe.isPending ? <Spinner className="h-4 w-4" /> : 'Subscribe'}
                      </Button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-neutral-500">Free for users with an active loan</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Credit Score Section - At the Top */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary-600" />
                  Credit Scores
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {/* DEPCO Score */}
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0">
                    <svg className="h-20 w-20 -rotate-90 transform">
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-neutral-100" />
                      <circle
                        cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent"
                        strokeDasharray={`${((creditScore?.score || 0) / 100) * 201} 201`}
                        className={creditScore?.rating_color === 'green' ? 'text-green-500' : creditScore?.rating_color === 'blue' ? 'text-blue-500' : creditScore?.rating_color === 'yellow' ? 'text-yellow-500' : creditScore?.rating_color === 'orange' ? 'text-orange-500' : 'text-red-500'}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-neutral-900">{creditScore?.score || 0}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">DEPCO Score</p>
                    <p className="text-sm text-neutral-500">{creditScore?.rating || 'N/A'}</p>
                    <p className="text-xs text-neutral-400 mt-1">Based on your profile</p>
                  </div>
                </div>

                {/* Imported Bureau Score */}
                {importedScore ? (
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0">
                      <svg className="h-20 w-20 -rotate-90 transform">
                        <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-neutral-100" />
                        <circle
                          cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent"
                          strokeDasharray={`${(importedScore.normalized_score / 100) * 201} 201`}
                          className={importedScore.normalized_score >= 70 ? 'text-blue-500' : importedScore.normalized_score >= 50 ? 'text-yellow-500' : 'text-red-500'}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-neutral-900">{importedScore.score}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900">Bureau Score</p>
                        <button
                          onClick={() => setShowImportScoreModal(true)}
                          className="text-xs text-primary-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteImportedScore}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm text-neutral-500">{importedScore.score_band}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {importedScore.bureau.charAt(0).toUpperCase() + importedScore.bureau.slice(1)}
                      </p>
                      {activeScenario && importedScore.projected_impact && (
                        <p className="text-xs font-medium text-amber-600 mt-1 flex items-center gap-1">
                          {importedScore.projected_impact.total_impact < 0 ? (
                            <><TrendingDown className="h-3 w-3" /> {importedScore.projected_impact.total_impact} pts</>
                          ) : (
                            <><TrendingUp className="h-3 w-3" /> +{importedScore.projected_impact.total_impact} pts</>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-neutral-200 p-4">
                    <FileText className="h-10 w-10 text-neutral-300 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700">Import Bureau Score</p>
                      <p className="text-xs text-neutral-500">Add your TransUnion, Experian, or other bureau score</p>
                    </div>
                    {access?.has_access ? (
                      <Button size="sm" onClick={() => setShowImportScoreModal(true)}>
                        <Download className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                    ) : (
                      <div className="flex items-center text-xs text-neutral-400">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Integrated Portfolio + Scenarios */}
        <div className="space-y-6">
          {/* Scenario Preview Banner */}
          {activeScenario && projectedValues && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border-2 border-primary-500 bg-primary-50 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                    <Eye className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Previewing: {activeScenario.name}</p>
                    <p className="text-sm text-primary-700">
                      +{formatCurrency(projectedValues.scenario_debt)} debt | +{formatCurrency(projectedValues.scenario_payment)}/mo
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveScenarioId(null)}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Exit Preview
                </Button>
              </div>
            </motion.div>
          )}

          {/* Portfolio Overview Card */}
          <Card className={activeScenario ? 'border-primary-200' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary-600" />
                  {activeScenario ? 'Portfolio Preview' : 'My Credit Portfolio'}
                </CardTitle>
                <div className="flex gap-2">
                  {access?.has_access && !activeScenario && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setShowAddAccountModal(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Account
                      </Button>
                      {!importedScore && (
                        <Button size="sm" variant="outline" onClick={() => setShowImportScoreModal(true)}>
                          <Download className="mr-2 h-4 w-4" />
                          Import Credit Portfolio
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats Overview */}
              <div className="grid gap-4 sm:grid-cols-4 mb-6">
                <div className={`rounded-xl p-4 ${activeScenario ? 'bg-primary-50 border border-primary-200' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${activeScenario ? 'text-primary-600' : 'text-blue-600'}`}>Total Credit</p>
                  <p className={`text-xl font-bold ${activeScenario ? 'text-primary-900' : 'text-blue-900'}`}>
                    {formatCurrency(displayValues?.total_credit_used || 0)}
                  </p>
                  {projectedValues && (
                    <p className="text-xs text-amber-600">+{formatCurrency(projectedValues.scenario_debt)}</p>
                  )}
                </div>
                <div className={`rounded-xl p-4 ${activeScenario ? 'bg-primary-50 border border-primary-200' : 'bg-amber-50'}`}>
                  <p className={`text-sm ${activeScenario ? 'text-primary-600' : 'text-amber-600'}`}>Monthly Payments</p>
                  <p className={`text-xl font-bold ${activeScenario ? 'text-primary-900' : 'text-amber-900'}`}>
                    {formatCurrency(displayValues?.total_monthly_payments || 0)}
                  </p>
                  {projectedValues && (
                    <p className="text-xs text-amber-600">+{formatCurrency(projectedValues.scenario_payment)}/mo</p>
                  )}
                </div>
                <div className="rounded-xl bg-neutral-100 p-4">
                  <p className="text-sm text-neutral-600">Monthly Income</p>
                  <p className="text-xl font-bold text-neutral-900">{formatCurrency(portfolio?.monthly_income || 0)}</p>
                </div>
                <div className={`rounded-xl p-4 ${projectedDtiColor ? projectedDtiColor.bg.replace('500', '50') + ' border border-' + projectedDtiColor.bg.replace('bg-', '') : currentDtiColor.bg.replace('500', '50')}`}>
                  <p className={`text-sm ${projectedDtiColor?.text || currentDtiColor.text}`}>DTI Ratio</p>
                  <p className={`text-xl font-bold ${projectedDtiColor?.text || currentDtiColor.text}`}>
                    {displayValues?.dti_ratio || 0}%
                  </p>
                  {projectedValues && (
                    <p className="text-xs text-amber-600">was {portfolio?.dti_ratio}%</p>
                  )}
                </div>
              </div>

              {/* DTI Progress Bar */}
              <div className="mb-6">
                <div className="relative h-4 w-full rounded-full bg-neutral-200 overflow-hidden">
                  {/* Current DTI */}
                  <div
                    className={`absolute h-full rounded-full transition-all ${currentDtiColor.bg}`}
                    style={{ width: `${Math.min(portfolio?.dti_ratio || 0, 100)}%` }}
                  />
                  {/* Projected DTI overlay */}
                  {projectedValues && (
                    <div
                      className={`absolute h-full rounded-full transition-all ${projectedDtiColor?.bg} opacity-70`}
                      style={{
                        left: `${Math.min(portfolio?.dti_ratio || 0, 100)}%`,
                        width: `${Math.min(projectedValues.dti_ratio - (portfolio?.dti_ratio || 0), 100 - (portfolio?.dti_ratio || 0))}%`
                      }}
                    />
                  )}
                </div>
                <div className="mt-1 flex justify-between text-xs text-neutral-500">
                  <span>0%</span>
                  <span className="text-green-600">Safe (30%)</span>
                  <span className="text-yellow-600">Caution (50%)</span>
                  <span className="text-red-600">Risky (70%+)</span>
                </div>
              </div>

              {/* Account List */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-neutral-700">Your Current Accounts</h4>

                {/* DEPCO Loans */}
                {portfolio?.depco_loans?.map((loan) => {
                  const paidMonths = loan.paid_months ?? 0
                  const progress = loan.term_months > 0 ? (paidMonths / loan.term_months) * 100 : 0
                  const isActive = loan.status === 'active'

                  return (
                    <div key={`depco-${loan.id}`} className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                            <Sparkles className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">DEPCO {loan.purpose.replace('_', ' ')}</p>
                            <p className="text-sm text-neutral-500">{loan.term_months} months | {loan.interest_rate}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900">{formatCurrency(loan.amount)}</p>
                          <p className="text-sm text-neutral-500">{formatCurrency(loan.monthly_payment)}/mo</p>
                        </div>
                      </div>
                      {/* Payment Progress */}
                      {isActive && loan.term_months > 0 && (
                        <div className="mt-3 pt-3 border-t border-primary-200">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-500">Progress</span>
                            <span className="font-medium text-neutral-900">{paidMonths}/{loan.term_months} payments</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-primary-100">
                            <div
                              className="h-full rounded-full bg-primary-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* External Accounts */}
                {portfolio?.external_accounts?.map((acc) => (
                  <div key={`ext-${acc.id}`} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                        {acc.type === 'credit_card' ? <CreditCard className="h-5 w-5 text-neutral-600" /> :
                         acc.type === 'store_card' ? <ShoppingBag className="h-5 w-5 text-neutral-600" /> :
                         <Wallet className="h-5 w-5 text-neutral-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{acc.provider}</p>
                        <p className="text-sm text-neutral-500">
                          {acc.interest_rate}% |{' '}
                          <span className={acc.status === 'on_time' ? 'text-green-600' : acc.status === 'late' ? 'text-yellow-600' : 'text-red-600'}>
                            {acc.status.replace('_', ' ')}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          {formatCurrency(acc.balance)}
                          {acc.limit && <span className="text-neutral-400">/{formatCurrency(acc.limit)}</span>}
                        </p>
                        <p className="text-sm text-neutral-500">{formatCurrency(acc.monthly_payment)}/mo</p>
                      </div>
                      {access?.has_access && !activeScenario && (
                        <button onClick={() => handleDeleteAccount(acc.id)} className="text-neutral-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Scenario Items (when previewing) */}
                {activeScenario && (
                  <>
                    <h4 className="text-sm font-medium text-primary-700 mt-4 pt-4 border-t border-primary-200">
                      + New Credit from "{activeScenario.name}"
                    </h4>
                    {activeScenario.credit_items?.map((item, idx) => (
                      <div key={`scenario-${idx}`} className="flex items-center justify-between rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                            <Plus className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-primary-900">{item.provider || item.type.replace('_', ' ')}</p>
                            <p className="text-sm text-primary-600">{item.term_months} months | {item.interest_rate}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-900">{formatCurrency(item.amount)}</p>
                          <p className="text-sm text-primary-600">(simulated)</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {!portfolio?.depco_loans?.length && !portfolio?.external_accounts?.length && (
                  <div className="text-center py-6 text-neutral-500">
                    <CreditCard className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                    <p>No credit accounts yet</p>
                    <p className="text-sm">Add your existing credit accounts to see your full picture</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scenarios Section - Attached to Portfolio */}
          <Card className={!access?.has_access ? 'opacity-75' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  "What If" Scenarios
                  {!access?.has_access && <Lock className="h-4 w-4 text-neutral-400" />}
                </CardTitle>
                {access?.has_access && (
                  <Button size="sm" variant="outline" onClick={() => setShowScenarioBuilder(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Scenario
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">
                Create scenarios to see how new credit would affect your portfolio. Click a scenario to preview its impact above.
              </p>

              {savedScenarios && savedScenarios.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {savedScenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                        activeScenarioId === scenario.id
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                      }`}
                      onClick={() => setActiveScenarioId(activeScenarioId === scenario.id ? null : scenario.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {activeScenarioId === scenario.id ? (
                            <Eye className="h-4 w-4 text-primary-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-neutral-400" />
                          )}
                          <span className="font-medium text-neutral-900">{scenario.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditScenario({
                                id: scenario.id,
                                name: scenario.name,
                                description: scenario.description || undefined,
                                credit_items: scenario.credit_items
                              })
                            }}
                            className="text-neutral-400 hover:text-primary-600"
                            title="Edit scenario"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (activeScenarioId === scenario.id) setActiveScenarioId(null)
                              deleteScenario.mutate(scenario.id)
                            }}
                            className="text-neutral-400 hover:text-red-500"
                            title="Delete scenario"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500 space-y-1">
                        <p>+{formatCurrency(scenario.projected_total_debt || 0)} new debt</p>
                        <p>+{formatCurrency(scenario.projected_monthly_payment || 0)}/mo payment</p>
                        <div className="flex items-center gap-2">
                          <span>Risk:</span>
                          <span className={`font-medium ${RISK_COLORS[scenario.risk_level as keyof typeof RISK_COLORS]?.text || 'text-neutral-600'}`}>
                            {scenario.risk_level?.replace('_', ' ') || 'unknown'}
                          </span>
                        </div>
                        <p className={`text-xs italic ${RISK_COLORS[scenario.risk_level as keyof typeof RISK_COLORS]?.text || 'text-neutral-500'}`}>
                          {RISK_DESCRIPTIONS[scenario.risk_level as keyof typeof RISK_DESCRIPTIONS] || ''}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <p className="text-xs text-primary-600 font-medium">
                          {activeScenarioId === scenario.id ? 'Click to exit preview' : 'Click to preview on portfolio'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Layers className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                  <p>No scenarios yet</p>
                  <p className="text-sm mb-4">Create a "what if" scenario to see how new credit would affect your portfolio</p>
                  {access?.has_access && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => seedScenarios.mutate()}
                      disabled={seedScenarios.isPending}
                    >
                      {seedScenarios.isPending ? (
                        <Spinner className="mr-2 h-4 w-4" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Load Sample Scenarios
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Advisor */}
          <Card className={!access?.has_access ? 'opacity-75' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-500" />
                Ask AI About Your Portfolio
                {!access?.has_access && <Lock className="h-4 w-4 text-neutral-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-neutral-600">
                Get personalized advice based on your complete financial picture.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g., Should I take on a Woolworths card with my current debt?"
                  disabled={!access?.has_access}
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-100"
                  onKeyDown={(e) => e.key === 'Enter' && handleAIQuestion()}
                />
                <Button onClick={handleAIQuestion} disabled={!access?.has_access || !aiQuestion.trim() || aiSimulation.isPending}>
                  {aiSimulation.isPending ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 rounded-xl border border-primary-200 bg-primary-50 p-4"
                  >
                    <p className="text-sm font-medium text-primary-700">{aiResponse.question}</p>
                    <p className="mt-2 text-neutral-700">{aiResponse.analysis}</p>
                    {aiResponse.recommendations.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-primary-700">Recommendations:</p>
                        <ul className="mt-1 space-y-1">
                          {aiResponse.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Tips to Improve */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Tips to Improve Your Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTips ? (
                <div className="flex items-center justify-center py-4"><Spinner className="h-5 w-5" /></div>
              ) : creditTips?.tips && creditTips.tips.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {creditTips.tips.slice(0, 6).map((tip: CreditTip, i: number) => (
                    <div key={i} className={`rounded-xl border p-3 ${tip.priority === 'high' ? 'border-red-200 bg-red-50' : tip.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' : 'border-neutral-200 bg-neutral-50'}`}>
                      <p className="text-sm font-medium text-neutral-900">{tip.category}</p>
                      <p className="mt-1 text-xs text-neutral-600">{tip.tip}</p>
                      <p className="mt-1 text-xs text-primary-600">{tip.potential_impact}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Great job! Keep up the good work.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddAccountModal && (
          <AddAccountModal
            isOpen={showAddAccountModal}
            onClose={() => setShowAddAccountModal(false)}
            onAdd={handleAddAccount}
            isLoading={addExternalAccount.isPending}
          />
        )}
        {showScenarioBuilder && (
          <ScenarioBuilderModal
            isOpen={showScenarioBuilder}
            onClose={() => { setShowScenarioBuilder(false); setScenarioSimResult(null); setEditingScenario(null) }}
            onSave={handleSaveScenario}
            isLoading={saveScenario.isPending || updateScenario.isPending}
            simulationResult={scenarioSimResult}
            onSimulate={handleScenarioSimulate}
            isSimulating={multiScenarioSim.isPending}
            editingScenario={editingScenario}
          />
        )}
        {showImportScoreModal && (
          <ImportScoreModal
            isOpen={showImportScoreModal}
            onClose={() => setShowImportScoreModal(false)}
            onImport={handleImportScore}
            isLoading={importScore.isPending}
            existingScore={importedScore}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
