import { api } from './api'
import type { Loan, LoanApplicationFormData, ApiResponse, PaginatedResponse } from '@/types'

export const loanService = {
  async getLoans(token: string): Promise<PaginatedResponse<Loan>> {
    return api.get('/loans', token)
  },

  async getLoan(id: string, token: string): Promise<ApiResponse<Loan>> {
    return api.get(`/loans/${id}`, token)
  },

  async createLoanApplication(
    data: LoanApplicationFormData,
    token: string
  ): Promise<ApiResponse<Loan>> {
    return api.post('/loans/apply', data as unknown as Record<string, unknown>, token)
  },

  async calculateLoan(
    amount: number,
    term: number
  ): Promise<{
    monthlyPayment: number
    totalInterest: number
    totalAmount: number
    interestRate: number
  }> {
    return api.post('/loans/calculate', { amount, term })
  },

  async makePayment(
    loanId: string,
    amount: number,
    token: string
  ): Promise<ApiResponse<{ transactionId: string }>> {
    return api.post(`/loans/${loanId}/payment`, { amount }, token)
  },

  async getPaymentHistory(
    loanId: string,
    token: string
  ): Promise<
    PaginatedResponse<{
      id: string
      amount: number
      date: string
      status: string
    }>
  > {
    return api.get(`/loans/${loanId}/payments`, token)
  },
}
