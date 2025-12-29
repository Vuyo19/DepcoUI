import { api } from './api'
import type { ApiResponse } from '@/types'

interface AdvisorMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AdvisorConversation {
  id: string
  messages: AdvisorMessage[]
  createdAt: string
  updatedAt: string
}

export const advisorService = {
  async sendMessage(
    message: string,
    conversationId?: string,
    token?: string
  ): Promise<ApiResponse<{ response: string; conversationId: string }>> {
    return api.post(
      '/advisor/chat',
      {
        message,
        conversationId,
      },
      token
    )
  },

  async getConversationHistory(
    conversationId: string,
    token: string
  ): Promise<ApiResponse<AdvisorConversation>> {
    return api.get(`/advisor/conversations/${conversationId}`, token)
  },

  async getConversations(
    token: string
  ): Promise<ApiResponse<AdvisorConversation[]>> {
    return api.get('/advisor/conversations', token)
  },

  async getFinancialTips(token?: string): Promise<
    ApiResponse<
      Array<{
        id: string
        title: string
        content: string
        category: string
      }>
    >
  > {
    return api.get('/advisor/tips', token)
  },

  async getPersonalizedAdvice(
    topic: string,
    token: string
  ): Promise<ApiResponse<{ advice: string }>> {
    return api.post('/advisor/advice', { topic }, token)
  },
}
