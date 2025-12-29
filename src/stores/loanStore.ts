import { create } from 'zustand'
import type { Loan } from '@/types'

interface LoanState {
  loans: Loan[]
  currentLoan: Loan | null
  isLoading: boolean
  error: string | null
  setLoans: (loans: Loan[]) => void
  setCurrentLoan: (loan: Loan | null) => void
  addLoan: (loan: Loan) => void
  updateLoan: (id: string, updates: Partial<Loan>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useLoanStore = create<LoanState>((set) => ({
  loans: [],
  currentLoan: null,
  isLoading: false,
  error: null,

  setLoans: (loans) => set({ loans }),

  setCurrentLoan: (loan) => set({ currentLoan: loan }),

  addLoan: (loan) =>
    set((state) => ({
      loans: [...state.loans, loan],
    })),

  updateLoan: (id, updates) =>
    set((state) => ({
      loans: state.loans.map((loan) =>
        loan.id === id ? { ...loan, ...updates } : loan
      ),
      currentLoan:
        state.currentLoan?.id === id
          ? { ...state.currentLoan, ...updates }
          : state.currentLoan,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}))
