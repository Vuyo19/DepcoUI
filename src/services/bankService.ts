import { api } from './api'
import type { BankVerification, ApiResponse } from '@/types'

export const bankService = {
  async getBankVerification(
    token: string
  ): Promise<ApiResponse<BankVerification | null>> {
    return api.get('/bank/verification', token)
  },

  async initiateBankVerification(
    data: {
      bankName: string
      accountType: string
    },
    token: string
  ): Promise<ApiResponse<BankVerification>> {
    return api.post('/bank/verification/initiate', data, token)
  },

  async verifyBankAccount(
    verificationId: string,
    otp: string,
    token: string
  ): Promise<ApiResponse<BankVerification>> {
    return api.post(
      `/bank/verification/${verificationId}/verify`,
      { otp },
      token
    )
  },

  async getSupportedBanks(): Promise<
    ApiResponse<Array<{ code: string; name: string; logo: string }>>
  > {
    return api.get('/bank/supported')
  },
}
