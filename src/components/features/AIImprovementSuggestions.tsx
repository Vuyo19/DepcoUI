import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Briefcase,
  User,
  Shield,
  Target,
  Lightbulb
} from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '@/components/ui'
import { useImprovementSuggestions, type ImprovementSuggestion } from '@/hooks'

interface AIImprovementSuggestionsProps {
  rejectionReason?: string
  showWhenEligible?: boolean
  className?: string
}

const categoryIcons: Record<string, typeof Wallet> = {
  income: TrendingUp,
  expenses: Wallet,
  employment: Briefcase,
  profile: User,
  verification: Shield,
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
}

const impactBadge: Record<string, { bg: string; text: string }> = {
  high: { bg: 'bg-emerald-500', text: 'High Impact' },
  medium: { bg: 'bg-amber-500', text: 'Medium Impact' },
  low: { bg: 'bg-gray-500', text: 'Low Impact' },
}

function SuggestionCard({ suggestion, index }: { suggestion: ImprovementSuggestion; index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0)
  const CategoryIcon = categoryIcons[suggestion.category] || Target

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-lg overflow-hidden ${priorityColors[suggestion.priority]}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${suggestion.priority === 'high' ? 'bg-red-200' : suggestion.priority === 'medium' ? 'bg-amber-200' : 'bg-green-200'}`}>
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">{suggestion.title}</h4>
            <div className="flex items-center gap-2 text-sm opacity-75">
              <Clock className="h-3 w-3" />
              <span>{suggestion.timeframe}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${impactBadge[suggestion.impact].bg}`}>
            {impactBadge[suggestion.impact].text}
          </span>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-current/10">
              <p className="text-sm">{suggestion.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function AIImprovementSuggestions({
  rejectionReason,
  showWhenEligible = false,
  className = ''
}: AIImprovementSuggestionsProps) {
  const { data: suggestions, isLoading, error } = useImprovementSuggestions(rejectionReason)
  const [showAll, setShowAll] = useState(false)

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Analyzing your profile...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !suggestions) {
    return (
      <Card className={`border-amber-200 bg-amber-50 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-amber-700">
            <AlertCircle className="h-5 w-5" />
            <span>Unable to load suggestions. Please try again later.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!suggestions.suggestions?.length && !showWhenEligible) {
    return null
  }

  const displayedSuggestions = showAll
    ? suggestions.suggestions
    : suggestions.suggestions?.slice(0, 3)

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Improvement Guide</h3>
            <p className="text-sm text-muted-foreground">Personalized steps to improve your loan eligibility</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Overall Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <p className="text-blue-800">{suggestions.overall_message}</p>
          {suggestions.qualification_gap && (
            <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {suggestions.qualification_gap}
            </p>
          )}
        </motion.div>

        {/* Quick Wins */}
        {suggestions.quick_wins && suggestions.quick_wins.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-emerald-700">
              <Lightbulb className="h-5 w-5" />
              Quick Wins - Do These Today!
            </h4>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <ul className="space-y-2">
                {suggestions.quick_wins.map((win, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-emerald-800"
                  >
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{win}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        {displayedSuggestions && displayedSuggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Action Steps</h4>
            <div className="space-y-3">
              {displayedSuggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} index={index} />
              ))}
            </div>

            {suggestions.suggestions?.length > 3 && (
              <Button
                variant="ghost"
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                {showAll ? 'Show Less' : `Show ${suggestions.suggestions.length - 3} More Suggestions`}
              </Button>
            )}
          </div>
        )}

        {/* Estimated Timeline */}
        {suggestions.estimated_improvement_time && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-gray-50 rounded-lg p-3"
          >
            <Clock className="h-4 w-4" />
            <span>Estimated time to improve: <strong>{suggestions.estimated_improvement_time}</strong></span>
          </motion.div>
        )}

        {/* AI Disclaimer */}
        {suggestions.ai_available && (
          <p className="text-xs text-center text-muted-foreground">
            Suggestions powered by AI and personalized to your profile
          </p>
        )}
      </CardContent>
    </Card>
  )
}
