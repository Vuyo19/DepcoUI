import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'

// Types
export interface UserProfile {
  id: number
  clerk_id: string
  phone_number?: string
  id_number?: string
  date_of_birth?: string
  address_street?: string
  address_city?: string
  address_province?: string
  address_postal_code?: string
  employment_type?: string
  employer_name?: string
  monthly_income?: number
  employment_start_date?: string
  total_monthly_expenses?: number
  expense_rent?: number
  expense_utilities?: number
  expense_groceries?: number
  expense_transport?: number
  expense_insurance?: number
  expense_debt_payments?: number
  expense_other?: number
  bank_verified: boolean
  bank_name?: string
  bank_account_type?: string
  risk_score?: number
  affordability_score?: number
  max_loan_amount?: number
  recommended_interest_rate?: number
  profile_completed: boolean
  expenses_completed: boolean
  bank_verification_completed: boolean
  created_at: string
  updated_at: string
}

export interface Loan {
  id: number
  user_id: number
  clerk_id: string
  amount_requested: number
  amount_approved?: number
  interest_rate?: number
  term_months: number
  monthly_payment?: number
  purpose: string
  landlord_name?: string
  property_address?: string
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'paid_off' | 'defaulted'
  ai_recommendation?: string
  applied_at: string
  approved_at?: string
  disbursed_at?: string
  created_at: string
  paid_months?: number
}

export interface ChatResponse {
  response: string
  context?: Record<string, unknown>
}

export interface AffordabilityAssessment {
  monthly_income: number
  total_expenses: number
  disposable_income: number
  max_monthly_payment: number
  estimated_max_loan_6_months: number
  estimated_max_loan_12_months: number
  profile_completed: boolean
  expenses_completed: boolean
  bank_verified: boolean
}

// Hook for getting auth token
export function useApiToken() {
  const { getToken } = useAuth()

  return async () => {
    const token = await getToken()
    return token || undefined
  }
}

// User Profile Hooks
export function useUserProfile() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<UserProfile>('/users/me', token)
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const token = await getToken()
      return api.put<UserProfile>('/users/me/profile', data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] })
    },
  })
}

export function useUpdateExpenses() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (data: {
      expense_rent?: number
      expense_utilities?: number
      expense_groceries?: number
      expense_transport?: number
      expense_insurance?: number
      expense_debt_payments?: number
      expense_other?: number
    }) => {
      const token = await getToken()
      return api.put<UserProfile>('/users/me/expenses', data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['affordability'] })
    },
  })
}

export function useAffordability() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['affordability'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<AffordabilityAssessment>('/users/me/affordability', token)
    },
  })
}

// Loan Hooks
export function useLoans() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<Loan[]>('/loans/', token)
    },
  })
}

export function useLoan(loanId: number) {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['loan', loanId],
    queryFn: async () => {
      const token = await getToken()
      return api.get<Loan>(`/loans/${loanId}`, token)
    },
    enabled: !!loanId,
  })
}

export function useApplyForLoan() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (data: {
      amount_requested: number
      term_months: number
      landlord_name?: string
      property_address?: string
    }) => {
      const token = await getToken()
      return api.post<Loan>('/loans/apply', data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}

export function useAcceptLoan() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (loanId: number) => {
      const token = await getToken()
      return api.post<{ message: string; loan: Loan }>(`/loans/${loanId}/accept`, {}, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}

export function useRejectLoan() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (loanId: number) => {
      const token = await getToken()
      return api.post<{ message: string }>(`/loans/${loanId}/reject`, {}, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}

// Chat Hooks
export function useChatHistory() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<Array<{
        id: number
        role: string
        content: string
        created_at: string
      }>>('/chat/advisor/history', token)
    },
  })
}

export function useSendChatMessage() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async ({ message, currentPage }: { message: string; currentPage?: string }) => {
      const token = await getToken()
      return api.post<ChatResponse>('/chat/advisor', { message, current_page: currentPage }, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] })
    },
  })
}

export function useClearChatHistory() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async () => {
      const token = await getToken()
      return api.delete<{ message: string }>('/chat/advisor/history', token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] })
    },
  })
}

// Bank Verification
export function useBankVerificationChat() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (message: string) => {
      const token = await getToken()
      return api.post<{
        response: string
        is_complete: boolean
        extracted_data?: Record<string, unknown>
      }>('/chat/bank-verification', { message }, token)
    },
    onSuccess: (data) => {
      if (data.is_complete) {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      }
    },
  })
}

// Profile Completion Chat Types
export interface ProfileCompletionResponse {
  response: string
  is_complete: boolean
  extracted_data?: Record<string, string>
  current_field?: string
  progress?: number
}

export interface ProfileCompletionMessage {
  role: 'user' | 'bot'
  content: string
}

// Profile Completion Chat Hook
export function useProfileCompletionChat() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async ({
      message,
      conversationHistory,
      extractedData,
      isFirstMessage,
    }: {
      message: string
      conversationHistory?: ProfileCompletionMessage[]
      extractedData?: Record<string, string>
      isFirstMessage?: boolean
    }) => {
      const token = await getToken()
      return api.post<ProfileCompletionResponse>('/chat/profile-completion', {
        message,
        conversation_history: conversationHistory?.map((msg) => ({
          role: msg.role === 'bot' ? 'assistant' : 'user',
          content: msg.content,
        })),
        extracted_data: extractedData,
        is_first_message: isFirstMessage,
      }, token)
    },
    onSuccess: (data) => {
      if (data.is_complete) {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] })
        queryClient.invalidateQueries({ queryKey: ['kyc-status'] })
      }
    },
  })
}

// KYC Types
export interface KYCStatus {
  kyc_completed: boolean
  missing_fields: Array<{ field: string; label: string }>
  existing_data: {
    phone_number?: string
    id_number?: string
    date_of_birth?: string
    address_street?: string
    address_city?: string
    address_province?: string
    address_postal_code?: string
    employment_type?: string
    employer_name?: string
    monthly_income?: number
  }
}

export interface KYCData {
  phone_number?: string
  id_number?: string
  date_of_birth?: string
  address_street?: string
  address_city?: string
  address_province?: string
  address_postal_code?: string
  employment_type?: string
  employer_name?: string
  monthly_income?: number
}

// KYC Hooks
export function useKYCStatus() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['kyc-status'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<KYCStatus>('/users/me/kyc-status', token)
    },
  })
}

export function useCompleteKYC() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (data: KYCData) => {
      const token = await getToken()
      return api.put<{
        success: boolean
        kyc_completed: boolean
        message: string
      }>('/users/me/kyc', data as Record<string, unknown>, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
  })
}

// AI Improvement Suggestions Types
export interface ImprovementSuggestion {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  timeframe: string
  impact: 'high' | 'medium' | 'low'
  category: 'income' | 'expenses' | 'employment' | 'profile' | 'verification'
}

export interface ImprovementSuggestionsResponse {
  overall_message: string
  qualification_gap?: string
  suggestions: ImprovementSuggestion[]
  quick_wins?: string[]
  estimated_improvement_time?: string
  ai_available: boolean
}

export interface QuickAssessmentResponse {
  eligible: boolean
  reason: string
  missing_requirements: string[]
  disposable_income?: number
  max_monthly_payment?: number
  min_loan_amount?: number
  max_loan_amount?: number
  suggestions_available: boolean
  bank_verified?: boolean
}

// AI Improvement Suggestions Hooks
export function useImprovementSuggestions(rejectionReason?: string) {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['improvement-suggestions', rejectionReason],
    queryFn: async () => {
      const token = await getToken()
      const params = rejectionReason ? `?rejection_reason=${encodeURIComponent(rejectionReason)}` : ''
      return api.get<ImprovementSuggestionsResponse>(`/chat/improvement-suggestions${params}`, token)
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

export function useQuickAssessment() {
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async () => {
      const token = await getToken()
      return api.post<QuickAssessmentResponse>('/chat/quick-assessment', {}, token)
    },
  })
}

// Document Upload Types
export interface DocumentInfo {
  id: number
  document_type: string
  file_name: string
  file_size: number
  status: 'pending' | 'verified' | 'rejected'
  uploaded_at: string
  verified_at?: string
  rejection_reason?: string
}

export interface DocumentStatus {
  documents: {
    id_document: DocumentInfo | null
    proof_of_address: DocumentInfo | null
  }
  all_uploaded: boolean
  all_verified: boolean
  missing: string[]
}

// Document Upload Hooks
export function useDocumentStatus() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['document-status'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<DocumentStatus>('/documents/status', token)
    },
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async ({
      file,
      documentType,
      loanId,
    }: {
      file: File
      documentType: 'id_document' | 'proof_of_address'
      loanId?: number
    }) => {
      const token = await getToken()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', documentType)
      if (loanId) {
        formData.append('loan_id', loanId.toString())
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to upload document')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-status'] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (documentId: number) => {
      const token = await getToken()
      return api.delete<{ message: string }>(`/documents/${documentId}`, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-status'] })
    },
  })
}

// Credit Score Types
export interface CreditScoreResponse {
  score: number
  rating: string
  rating_color: string
  breakdown: {
    payment_history: number
    credit_utilization: number
    account_age: number
    income_stability: number
  }
  factors: {
    payment_history: { score: number; max: number; weight: string; description: string }
    credit_utilization: { score: number; max: number; weight: string; description: string }
    account_age: { score: number; max: number; weight: string; description: string }
    income_stability: { score: number; max: number; weight: string; description: string }
  }
  last_updated?: string
}

export interface CreditScoreHistoryItem {
  score: number
  previous_score: number | null
  change: number
  reason: string | null
  date: string
}

export interface SimulatorAccess {
  has_access: boolean
  access_type: 'loan_holder' | 'subscription' | 'none'
  message?: string
  subscription?: {
    plan: string
    next_billing: string | null
  }
  subscription_required?: boolean
  pricing?: {
    monthly: number
    annual: number
    currency: string
  }
  has_loan_history?: boolean
}

export interface SimulationResult {
  scenario: string
  current_score: number
  projected_score: number
  change: number
  new_rating: string
  message: string
  recovery_time: string
}

export interface AISimulationResponse {
  question: string
  analysis: string
  current_score: number
  projected_impact?: {
    best_case: number
    worst_case: number
    likely: number
  }
  recommendations: string[]
  factors_affected: string[]
}

export interface CreditTip {
  category: string
  priority: 'high' | 'medium' | 'low'
  tip: string
  potential_impact: string
}

export interface CreditTipsResponse {
  current_score: number
  rating: string
  tips: CreditTip[]
  factors: CreditScoreResponse['factors']
}

// Credit Score Hooks
export function useCreditScore() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['credit-score'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<CreditScoreResponse>('/credit/score', token)
    },
  })
}

export function useCreditScoreHistory(limit: number = 12) {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['credit-score-history', limit],
    queryFn: async () => {
      const token = await getToken()
      return api.get<{ history: CreditScoreHistoryItem[] }>(`/credit/score/history?limit=${limit}`, token)
    },
  })
}

export function useSimulatorAccess() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['simulator-access'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<SimulatorAccess>('/credit/simulator/access', token)
    },
  })
}

export function useSimulateScenario() {
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async ({ scenario, details }: { scenario: string; details?: Record<string, unknown> }) => {
      const token = await getToken()
      return api.post<SimulationResult>('/credit/simulator/scenario', { scenario, details }, token)
    },
  })
}

export function useAISimulation() {
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async ({ question, context }: { question: string; context?: Record<string, unknown> }) => {
      const token = await getToken()
      return api.post<AISimulationResponse>('/credit/simulator/ai', { question, context }, token)
    },
  })
}

export function useSubscribeToSimulator() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (planType: 'monthly' | 'annual') => {
      const token = await getToken()
      return api.post<{
        message: string
        subscription_id: number
        plan: string
        amount: number
        status: string
        payment_url: string
      }>('/credit/simulator/subscribe', { plan_type: planType }, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulator-access'] })
    },
  })
}

export function useCreditTips() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['credit-tips'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<CreditTipsResponse>('/credit/tips', token)
    },
  })
}

// Education Types
export interface EducationContent {
  id: string
  title: string
  description: string
  category: string
  type: 'article' | 'video' | 'tutorial'
  duration?: string
  thumbnail?: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  is_premium: boolean
}

export interface EducationContentDetail extends EducationContent {
  content?: string
  content_url?: string
}

export interface EducationCategory {
  id: string
  name: string
  description: string
  icon: string
  content_count: number
}

// Education Hooks
export function useEducationContent(filters?: {
  category?: string
  type?: string
  difficulty?: string
  search?: string
}) {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['education-content', filters],
    queryFn: async () => {
      const token = await getToken()
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.difficulty) params.append('difficulty', filters.difficulty)
      if (filters?.search) params.append('search', filters.search)

      const queryString = params.toString()
      return api.get<{ content: EducationContent[]; total: number }>(
        `/education/content${queryString ? `?${queryString}` : ''}`,
        token
      )
    },
  })
}

export function useEducationContentDetail(contentId: string) {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['education-content-detail', contentId],
    queryFn: async () => {
      const token = await getToken()
      return api.get<EducationContentDetail>(`/education/content/${contentId}`, token)
    },
    enabled: !!contentId,
  })
}

export function useEducationCategories() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['education-categories'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<{ categories: EducationCategory[] }>('/education/categories', token)
    },
  })
}

export function useRecommendedContent() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['recommended-content'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<{
        recommended: Array<EducationContent & { reason: string }>
      }>('/education/recommended', token)
    },
  })
}

// ==================== External Credit Types ====================

export interface ExternalCreditAccount {
  id: number
  account_type: string
  provider_name: string
  credit_limit: number | null
  current_balance: number
  interest_rate: number
  minimum_payment: number
  is_active: boolean
  payment_status: string
  created_at: string
}

export interface CreditItem {
  type: string
  provider: string
  amount: number
  interest_rate: number
  term_months: number
}

export interface CreditScenario {
  id: number
  name: string
  description: string | null
  credit_items: CreditItem[]
  projected_total_debt: number | null
  projected_monthly_payment: number | null
  projected_dti: number | null
  projected_total_interest: number | null
  risk_level: string | null
  created_at: string
}

export interface CreditPortfolio {
  depco_loans: Array<{
    id: number
    purpose: string
    amount: number
    monthly_payment: number
    interest_rate: number
    term_months: number
    status: string
    paid_months?: number
    start_date?: string
  }>
  depco_total_balance: number
  depco_monthly_payment: number
  external_accounts: Array<{
    id: number
    type: string
    provider: string
    balance: number
    limit: number | null
    monthly_payment: number
    interest_rate: number
    status: string
  }>
  external_total_balance: number
  external_monthly_payment: number
  total_credit_used: number
  total_monthly_payments: number
  monthly_income: number
  dti_ratio: number
  dti_status: 'safe' | 'caution' | 'risky'
  credit_score: number | null
  credit_rating: string | null
}

export interface MultiScenarioSimulationResult {
  current_total_debt: number
  current_monthly_payments: number
  current_dti: number
  projected_total_debt: number
  projected_monthly_payments: number
  projected_dti: number
  debt_increase: number
  payment_increase: number
  dti_increase: number
  new_credit_items: Array<{
    type: string
    provider: string
    amount: number
    interest_rate: number
    term_months: number
    monthly_payment: number
    total_interest: number
    total_repayment: number
  }>
  total_new_credit: number
  total_new_interest: number
  total_new_monthly_payment: number
  risk_level: 'low' | 'moderate' | 'high' | 'very_high'
  affordability_status: string
  recommendation: string
  remaining_monthly: number
}

export interface ScenarioComparison {
  current: {
    name: string
    total_debt: number
    monthly_payments: number
    dti: number
    risk_level: string
    remaining_monthly: number
  }
  scenarios: Array<{
    id: number
    name: string
    total_debt: number
    monthly_payments: number
    new_credit: number
    new_interest: number
    dti: number
    risk_level: string
    remaining_monthly: number
    credit_items: CreditItem[]
  }>
  monthly_income: number
  recommendation: {
    best_scenario_id: number
    best_scenario_name: string
    reason: string
  }
}

// ==================== External Credit Hooks ====================

export function useExternalAccounts() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['external-accounts'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<ExternalCreditAccount[]>('/credit/external', token)
    },
  })
}

export function useAddExternalAccount() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (data: {
      account_type: string
      provider_name: string
      credit_limit?: number
      current_balance: number
      interest_rate: number
      minimum_payment: number
      payment_status?: string
    }) => {
      const token = await getToken()
      return api.post<ExternalCreditAccount>('/credit/external', data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['credit-portfolio'] })
    },
  })
}

export function useUpdateExternalAccount() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async ({ id, data }: {
      id: number
      data: Partial<{
        provider_name: string
        credit_limit: number
        current_balance: number
        interest_rate: number
        minimum_payment: number
        payment_status: string
        is_active: boolean
      }>
    }) => {
      const token = await getToken()
      return api.put<ExternalCreditAccount>(`/credit/external/${id}`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['credit-portfolio'] })
    },
  })
}

export function useDeleteExternalAccount() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken()
      return api.delete<{ message: string }>(`/credit/external/${id}`, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['credit-portfolio'] })
    },
  })
}

// ==================== Portfolio Hook ====================

export function useCreditPortfolio() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['credit-portfolio'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<CreditPortfolio>('/credit/portfolio', token)
    },
  })
}

// ==================== Multi-Scenario Simulation Hooks ====================

export function useMultiScenarioSimulation() {
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (creditItems: CreditItem[]) => {
      const token = await getToken()
      return api.post<MultiScenarioSimulationResult>('/credit/simulate', { credit_items: creditItems }, token)
    },
  })
}

export function useCreditScenarios() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['credit-scenarios'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<CreditScenario[]>('/credit/scenarios', token)
    },
  })
}

export function useSaveScenario() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (data: {
      name: string
      description?: string
      credit_items: CreditItem[]
    }) => {
      const token = await getToken()
      return api.post<CreditScenario>('/credit/scenarios', data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-scenarios'] })
    },
  })
}

export function useUpdateScenario() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (data: {
      id: number
      name: string
      description?: string
      credit_items: CreditItem[]
    }) => {
      const token = await getToken()
      const { id, ...rest } = data
      return api.put<CreditScenario>(`/credit/scenarios/${id}`, rest, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-scenarios'] })
    },
  })
}

export function useDeleteScenario() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken()
      return api.delete<{ message: string }>(`/credit/scenarios/${id}`, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-scenarios'] })
    },
  })
}

export function useSeedScenarios() {
  const queryClient = useQueryClient()
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async () => {
      const token = await getToken()
      return api.post<{ message: string; scenarios: string[] }>('/credit/scenarios/seed', {}, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-scenarios'] })
    },
  })
}

export function useCompareScenarios() {
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (scenarioIds: number[]) => {
      const token = await getToken()
      return api.post<ScenarioComparison>('/credit/scenarios/compare', { scenario_ids: scenarioIds }, token)
    },
  })
}

// ==================== Imported Credit Score ====================

export interface ScoreImpactFactor {
  factor: string
  impact: number
  description: string
}

export interface ProjectedScoreImpact {
  current_score: number
  projected_score: number
  total_impact: number
  factors: ScoreImpactFactor[]
  confidence: string
  note: string
}

export interface ImportedCreditScore {
  id: number
  score: number
  score_band: string | null
  bureau: string
  min_score: number
  max_score: number
  normalized_score: number
  report_date: string | null
  notes: string | null
  projected_impact: ProjectedScoreImpact
  created_at: string
  updated_at: string
}

export interface ImportScoreInput {
  score: number
  bureau?: string
  score_band?: string
  min_score?: number
  max_score?: number
  report_date?: string
  notes?: string
}

export interface ScoreImpactSimulation extends ProjectedScoreImpact {
  credit_items: {
    type: string
    provider: string
    amount: number
    individual_impact: number
  }[]
}

export function useImportedScore() {
  const getToken = useApiToken()

  return useQuery({
    queryKey: ['imported-score'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<ImportedCreditScore | null>('/credit/imported-score', token)
    },
  })
}

export function useImportScore() {
  const getToken = useApiToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ImportScoreInput) => {
      const token = await getToken()
      return api.post<ImportedCreditScore>('/credit/imported-score', data as unknown as Record<string, unknown>, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imported-score'] })
      queryClient.invalidateQueries({ queryKey: ['credit-portfolio'] })
    },
  })
}

export function useDeleteImportedScore() {
  const getToken = useApiToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const token = await getToken()
      return api.delete<{ message: string }>('/credit/imported-score', token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imported-score'] })
    },
  })
}

export function useSimulateScoreImpact() {
  const getToken = useApiToken()

  return useMutation({
    mutationFn: async (creditItems: CreditItem[]) => {
      const token = await getToken()
      return api.post<ScoreImpactSimulation>('/credit/simulate-score-impact', { credit_items: creditItems }, token)
    },
  })
}
