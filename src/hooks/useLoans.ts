import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { loanService } from '@/services'
import type { LoanApplicationFormData } from '@/types'

export function useLoans() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return loanService.getLoans(token)
    },
  })
}

export function useLoan(id: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['loan', id],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return loanService.getLoan(id, token)
    },
    enabled: !!id,
  })
}

export function useCreateLoanApplication() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoanApplicationFormData) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return loanService.createLoanApplication(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}

export function useCalculateLoan(amount: number, term: number) {
  return useQuery({
    queryKey: ['loan-calculation', amount, term],
    queryFn: () => loanService.calculateLoan(amount, term),
    enabled: amount > 0 && term > 0,
  })
}

export function useMakePayment(loanId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (amount: number) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return loanService.makePayment(loanId, amount, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan', loanId] })
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}
