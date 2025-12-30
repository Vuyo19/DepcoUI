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
  // Credit Score hooks
  useCreditScore,
  useCreditScoreHistory,
  useSimulatorAccess,
  useSimulateScenario,
  useAISimulation,
  useSubscribeToSimulator,
  useCreditTips,
  // Education hooks
  useEducationContent,
  useEducationContentDetail,
  useEducationCategories,
  useRecommendedContent,
  // External Credit & Multi-Scenario Simulation hooks
  useExternalAccounts,
  useAddExternalAccount,
  useUpdateExternalAccount,
  useDeleteExternalAccount,
  useCreditPortfolio,
  useMultiScenarioSimulation,
  useCreditScenarios,
  useSaveScenario,
  useUpdateScenario,
  useDeleteScenario,
  useSeedScenarios,
  useCompareScenarios,
  // Imported Credit Score hooks
  useImportedScore,
  useImportScore,
  useDeleteImportedScore,
  useSimulateScoreImpact,
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
  // Credit types
  CreditScoreResponse,
  CreditScoreHistoryItem,
  SimulatorAccess,
  SimulationResult,
  AISimulationResponse,
  CreditTip,
  CreditTipsResponse,
  // Education types
  EducationContent,
  EducationContentDetail,
  EducationCategory,
  // External Credit & Multi-Scenario types
  ExternalCreditAccount,
  CreditItem,
  CreditScenario,
  CreditPortfolio,
  MultiScenarioSimulationResult,
  ScenarioComparison,
  // Imported Credit Score types
  ImportedCreditScore,
  ImportScoreInput,
  ScoreImpactFactor,
  ProjectedScoreImpact,
  ScoreImpactSimulation,
} from './useApi'
