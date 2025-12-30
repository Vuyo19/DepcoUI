import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { userService } from '@/services'
import type { ExpenseProfile } from '@/types'

export function useExpenseProfile() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['expense-profile'],
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return userService.getExpenseProfile(token)
    },
  })
}

export function useSaveExpenseProfile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: Omit<ExpenseProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return userService.saveExpenseProfile(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-profile'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] })
    },
  })
}

export function useUpdateExpenseProfile() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<ExpenseProfile>) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return userService.updateExpenseProfile(data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-profile'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] })
    },
  })
}
