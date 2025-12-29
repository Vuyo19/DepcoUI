export {
  useLoans,
  useLoan,
  useCreateLoanApplication,
  useCalculateLoan,
  useMakePayment,
} from './useLoans'

export {
  useExpenseProfile,
  useSaveExpenseProfile,
  useUpdateExpenseProfile,
} from './useExpenseProfile'

export {
  useBankVerification,
  useInitiateBankVerification,
  useVerifyBankAccount,
  useSupportedBanks,
} from './useBankVerification'

// API hooks for backend integration
export {
  useApiToken,
  useUserProfile,
  useUpdateProfile,
  useUpdateExpenses,
  useAffordability,
  useLoans as useApiLoans,
  useLoan as useApiLoan,
  useApplyForLoan,
  useAcceptLoan,
  useRejectLoan,
  useChatHistory,
  useSendChatMessage,
  useClearChatHistory,
  useBankVerificationChat,
  useProfileCompletionChat,
  useKYCStatus,
  useCompleteKYC,
  useImprovementSuggestions,
  useQuickAssessment,
  useDocumentStatus,
  useUploadDocument,
  useDeleteDocument,
} from './useApi'

export type {
  UserProfile,
  Loan as ApiLoan,
  ChatResponse,
  AffordabilityAssessment,
  KYCStatus,
  KYCData,
  ImprovementSuggestion,
  ImprovementSuggestionsResponse,
  QuickAssessmentResponse,
  ProfileCompletionResponse,
  ProfileCompletionMessage,
  DocumentInfo,
  DocumentStatus,
} from './useApi'
