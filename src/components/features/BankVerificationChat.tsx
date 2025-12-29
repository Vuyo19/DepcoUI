import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  options?: string[]
}

interface BankVerificationChatProps {
  onComplete: (data: BankVerificationData) => void
  onSkip?: () => void
}

interface BankVerificationData {
  bankName: string
  accountType: string
}

const banks = [
  'FNB',
  'Standard Bank',
  'Absa',
  'Nedbank',
  'Capitec',
  'African Bank',
  'TymeBank',
  'Discovery Bank',
]

const accountTypes = ['Cheque Account', 'Savings Account', 'Credit Account']

export function BankVerificationChat({
  onComplete,
  onSkip,
}: BankVerificationChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedAccountType, setSelectedAccountType] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      addBotMessage(
        "Hey there! 👋 Let's quickly verify your bank account. This helps us get your deposit to you faster!",
        []
      )
      setTimeout(() => {
        addBotMessage('Which bank do you use?', banks)
      }, 1000)
    }, 500)
  }, [])

  const addBotMessage = (content: string, options: string[] = []) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'bot',
          content,
          options,
        },
      ])
      setIsTyping(false)
    }, 600)
  }

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content,
      },
    ])
  }

  const handleOptionSelect = (option: string) => {
    addUserMessage(option)

    if (currentStep === 0) {
      setSelectedBank(option)
      setCurrentStep(1)
      setTimeout(() => {
        addBotMessage(`Great choice! ${option} is awesome 🏦`, [])
        setTimeout(() => {
          addBotMessage('What type of account is it?', accountTypes)
        }, 800)
      }, 500)
    } else if (currentStep === 1) {
      setSelectedAccountType(option)
      setCurrentStep(2)
      setTimeout(() => {
        addBotMessage(
          "Perfect! That's all we need for now. We'll verify your account securely in the background. ✨",
          []
        )
        setTimeout(() => {
          setIsComplete(true)
        }, 1000)
      }, 500)
    }
  }

  const handleComplete = () => {
    onComplete({
      bankName: selectedBank,
      accountType: selectedAccountType,
    })
  }

  return (
    <div className="flex h-[500px] flex-col rounded-2xl bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
          <Bot className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900">DEPCO Assistant</h3>
          <p className="text-sm text-secondary-500">Bank Verification</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex gap-3',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'bot' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <Bot className="h-4 w-4 text-primary-600" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.type === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                )}
              >
                <p className="text-sm">{message.content}</p>
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm transition-colors hover:bg-primary-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {message.type === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200">
                  <User className="h-4 w-4 text-neutral-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
              <Bot className="h-4 w-4 text-primary-600" />
            </div>
            <div className="rounded-2xl bg-neutral-100 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100">
              <CheckCircle className="h-8 w-8 text-secondary-600" />
            </div>
            <p className="mt-4 font-semibold text-neutral-900">
              Verification Started!
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              We'll notify you once it's complete
            </p>
            <Button className="mt-6" onClick={handleComplete}>
              Continue to Application
            </Button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      {!isComplete && (
        <div className="border-t border-neutral-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Your data is encrypted and secure
            </p>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
