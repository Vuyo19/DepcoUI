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
