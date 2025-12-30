import { api } from './api'
import type { User, ExpenseProfile, ApiResponse } from '@/types'

export const userService = {
  async getProfile(token: string): Promise<ApiResponse<User>> {
    return api.get('/users/me', token)
  },

  async updateProfile(
    data: Partial<User>,
    token: string
  ): Promise<ApiResponse<User>> {
    return api.patch('/users/me', data as Record<string, unknown>, token)
  },

  async getExpenseProfile(token: string): Promise<ApiResponse<ExpenseProfile>> {
    return api.get('/users/me/expenses', token)
  },

  async saveExpenseProfile(
    data: Omit<ExpenseProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    token: string
  ): Promise<ApiResponse<ExpenseProfile>> {
    return api.put('/users/me/expenses', data as Record<string, unknown>, token)
  },

  async updateExpenseProfile(
    data: Partial<ExpenseProfile>,
    token: string
  ): Promise<ApiResponse<ExpenseProfile>> {
    return api.put('/users/me/expenses', data as Record<string, unknown>, token)
  },

  async deleteAccount(token: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete('/users/me', token)
  },
}
