// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  idNumber: string
  dateOfBirth: string
  createdAt: string
  updatedAt: string
}

// Loan types
export interface Loan {
  id: string
  userId: string
  amount: number
  term: number
  interestRate: number
  monthlyPayment: number
  status: LoanStatus
  purpose: string
  createdAt: string
  updatedAt: string
}

export type LoanStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'disbursed'
  | 'active'
  | 'completed'
  | 'defaulted'

// Expense Profile types
export interface ExpenseProfile {
  id: string
  userId: string
  monthlyIncome: number
  rentAmount: number
  transportCost: number
  foodExpenses: number
  utilitiesCost: number
  otherExpenses: number
  createdAt: string
  updatedAt: string
}

// Bank Verification types
export interface BankVerification {
  id: string
  userId: string
  bankName: string
  accountNumber: string
  accountType: string
  verified: boolean
  verifiedAt: string | null
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  idNumber: string
  dateOfBirth: string
  password: string
  confirmPassword: string
}

export interface LoanApplicationFormData {
  amount: number
  term: number
  purpose: string
  employmentStatus: string
  employerName?: string
  monthlyIncome: number
}
