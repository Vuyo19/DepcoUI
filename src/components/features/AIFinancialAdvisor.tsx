import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Loader2, X, Minimize2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useSendChatMessage, useChatHistory } from '@/hooks'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  isLoading?: boolean
}

interface AIFinancialAdvisorProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
}

// Loan journey-focused questions
const suggestedQuestions = [
  "What's my next step?",
  'Am I ready to apply?',
  'How much can I borrow?',
  'What do I need to complete?',
]

export function AIFinancialAdvisor({
  isOpen,
  onClose,
  onMinimize,
}: AIFinancialAdvisorProps) {
  const location = useLocation()
  const currentPage = location.pathname.split('/')[1] || 'dashboard'

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // API hooks
  const { data: chatHistory, isLoading: isLoadingHistory, refetch: refetchHistory } = useChatHistory()
  const sendMessage = useSendChatMessage()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      // Refetch history when opening
      if (!hasLoadedHistory) {
        refetchHistory()
      }
    }
  }, [isOpen, hasLoadedHistory, refetchHistory])

  // Load chat history from backend
  useEffect(() => {
    if (chatHistory && !hasLoadedHistory) {
      if (chatHistory.length > 0) {
        const historyMessages: Message[] = chatHistory.map((msg, index) => ({
          id: `history-${index}`,
          type: msg.role === 'assistant' ? 'bot' : 'user',
          content: msg.content,
        }))
        setMessages(historyMessages)
      } else {
        // Welcome message for new users
        setMessages([
          {
            id: 'welcome',
            type: 'bot',
            content:
              "Hey! I'm Depi, your personal guide to getting your rental deposit loan. I'm here to help you through every step of the journey - no pressure, just support. What can I help you with?",
          },
        ])
      }
      setHasLoadedHistory(true)
    }
  }, [chatHistory, hasLoadedHistory])

  const handleSend = async (message: string) => {
    if (!message.trim() || sendMessage.isPending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Add loading message
    const loadingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: loadingId, type: 'bot', content: '', isLoading: true },
    ])

    try {
      const response = await sendMessage.mutateAsync({
        message,
        currentPage: currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
      })

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: response.response, isLoading: false }
            : msg
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content:
                  "Oops! I had a little hiccup there. Mind trying again? I'm here to help!",
                isLoading: false,
              }
            : msg
        )
      )
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-4 z-50 w-[380px] overflow-hidden rounded-2xl bg-white shadow-2xl sm:right-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Depi</h3>
              <p className="text-xs text-primary-100">Your loan journey guide</p>
            </div>
          </div>
          <div className="flex gap-1">
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[350px] overflow-y-auto bg-neutral-50 p-4">
        {isLoadingHistory && !hasLoadedHistory ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-neutral-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading our conversation...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-2',
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.type === 'bot' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <Bot className="h-4 w-4 text-primary-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5',
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-neutral-900 shadow-sm'
                    )}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm">
                        {message.content}
                      </p>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200">
                      <User className="h-4 w-4 text-neutral-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested Questions - show only for first message */}
      {messages.length <= 1 && !isLoadingHistory && (
        <div className="border-t border-neutral-100 bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium text-neutral-500">
            Quick questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                disabled={sendMessage.isPending}
                className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:bg-primary-100 hover:text-primary-700 disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-neutral-100 bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(inputValue)
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Depi anything..."
            disabled={sendMessage.isPending}
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-50"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputValue.trim() || sendMessage.isPending}
            className="rounded-xl px-4"
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}
