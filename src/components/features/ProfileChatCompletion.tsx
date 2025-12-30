import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useProfileCompletionChat, useUserProfile } from '@/hooks'

interface ProfileChatCompletionProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
}

export function ProfileChatCompletion({
  isOpen,
  onClose,
  onComplete,
}: ProfileChatCompletionProps) {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [extractedData, setExtractedData] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: userProfile } = useUserProfile()
  void userProfile // Reserved for future personalization
  const profileCompletion = useProfileCompletionChat()

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content: "Hey! I noticed you haven't finished setting up your profile yet. It only takes a minute - shall we do it together?",
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && hasStarted) {
      inputRef.current?.focus()
    }
  }, [isOpen, hasStarted, messages])

  const handleStart = async () => {
    setHasStarted(true)
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: "Sure, let's do it!" },
    ])

    // Add loading message
    const loadingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: loadingId, type: 'bot', content: '...' },
    ])

    try {
      const response = await profileCompletion.mutateAsync({
        message: "Let's start",
        extractedData: {},
        isFirstMessage: true,
      })

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: response.response }
            : msg
        )
      )
      setExtractedData(response.extracted_data || {})
      setProgress(response.progress || 0)
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: "Oops, something went wrong. Let's try again - what's your phone number?" }
            : msg
        )
      )
    }
  }

  const handleSendMessage = async () => {
    const message = inputValue.trim()
    if (!message || profileCompletion.isPending) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: message },
    ])
    setInputValue('')

    // Add loading message
    const loadingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: loadingId, type: 'bot', content: '...' },
    ])

    try {
      const response = await profileCompletion.mutateAsync({
        message,
        conversationHistory: messages.map((m) => ({
          role: m.type,
          content: m.content,
        })),
        extractedData,
        isFirstMessage: false,
      })

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: response.response }
            : msg
        )
      )
      setExtractedData(response.extracted_data || {})
      setProgress(response.progress || 0)

      if (response.is_complete) {
        setIsComplete(true)
        // Add completion message after a short delay
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: 'complete',
              type: 'bot',
              content: "Profile saved! You're one step closer to your rental deposit. I'm here whenever you need me.",
            },
          ])
        }, 500)
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { ...msg, content: "Oops, something went wrong. Mind trying that again?" }
            : msg
        )
      )
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header with progress */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Complete Your Profile</h3>
                <p className="text-xs text-primary-100">
                  {hasStarted ? `${progress}% complete` : 'Quick setup'}
                </p>
              </div>
            </div>
            {!isComplete && (
              <button
                onClick={onClose}
                className="text-xs text-white/70 hover:text-white"
              >
                Later
              </button>
            )}
          </div>

          {/* Progress bar */}
          {hasStarted && (
            <div className="mt-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Chat messages */}
        <div className="h-[300px] overflow-y-auto bg-neutral-50 p-4">
          <div className="space-y-3">
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
                      'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-neutral-900 shadow-sm'
                    )}
                  >
                    {message.content === '...' ? (
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-neutral-100 bg-white p-4">
          {isComplete ? (
            <Button onClick={onComplete || onClose} className="w-full">
              Continue to Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : !hasStarted ? (
            <div className="flex gap-2">
              <Button onClick={handleStart} className="flex-1" disabled={profileCompletion.isPending}>
                {profileCompletion.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Let's do it!"
                )}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Maybe later
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                disabled={profileCompletion.isPending}
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-50"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputValue.trim() || profileCompletion.isPending}
                className="rounded-xl px-4"
              >
                {profileCompletion.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
