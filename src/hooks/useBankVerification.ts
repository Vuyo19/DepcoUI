import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { bankService } from '@/services'

export function useBankVerification() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['bank-verification'],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return bankService.getBankVerification(token)
    },
  })
}

export function useInitiateBankVerification() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { bankName: string; accountType: string }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return bankService.initiateBankVerification(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-verification'] })
    },
  })
}

export function useVerifyBankAccount() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      verificationId,
      otp,
    }: {
      verificationId: string
      otp: string
    }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return bankService.verifyBankAccount(verificationId, otp, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-verification'] })
    },
  })
}

export function useSupportedBanks() {
  return useQuery({
    queryKey: ['supported-banks'],
    queryFn: () => bankService.getSupportedBanks(),
  })
}
