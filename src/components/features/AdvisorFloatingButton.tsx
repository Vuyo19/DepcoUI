import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { AIFinancialAdvisor } from './AIFinancialAdvisor'
import { cn } from '@/lib/utils'

export function AdvisorFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  const handleOpen = () => {
    setIsOpen(true)
    setHasUnread(false)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={handleOpen}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors',
          isOpen
            ? 'bg-neutral-800 hover:bg-neutral-700'
            : 'bg-primary-500 hover:bg-primary-600'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <Sparkles className="h-6 w-6 text-white" />
              {hasUnread && (
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent-500 ring-2 ring-white" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-8 right-24 z-40 rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white shadow-lg"
          >
            <span>Need financial advice?</span>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 border-8 border-transparent border-l-neutral-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Advisor Panel */}
      <AnimatePresence>
        {isOpen && (
          <AIFinancialAdvisor
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
