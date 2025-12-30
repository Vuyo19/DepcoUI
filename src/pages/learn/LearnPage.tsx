import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  BookOpen,
  Video,
  FileText,
  TrendingUp,
  Wallet,
  PiggyBank,
  Home,
  Banknote,
  LineChart,
  Clock,
  Crown,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'
import {
  useEducationContent,
  useEducationCategories,
  useEducationContentDetail,
  useRecommendedContent,
  type EducationContent,
  type EducationCategory,
} from '@/hooks'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  credit: TrendingUp,
  budgeting: PiggyBank,
  savings: Wallet,
  loans: Banknote,
  rental: Home,
  investing: LineChart,
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  article: FileText,
  video: Video,
  tutorial: BookOpen,
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)

  const { data: categories, isLoading: isLoadingCategories } = useEducationCategories()
  const { data: contentData, isLoading: isLoadingContent } = useEducationContent({
    category: selectedCategory || undefined,
    type: selectedType || undefined,
    search: searchQuery || undefined,
  })
  const { data: recommended, isLoading: isLoadingRecommended } = useRecommendedContent()
  const { data: contentDetail, isLoading: isLoadingDetail } = useEducationContentDetail(
    selectedContentId || ''
  )

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
  }

  const handleContentClick = (contentId: string) => {
    setSelectedContentId(contentId)
  }

  const handleBackToList = () => {
    setSelectedContentId(null)
  }

  if (isLoadingCategories && isLoadingContent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  // Content Detail View
  if (selectedContentId && contentDetail) {
    const TypeIcon = TYPE_ICONS[contentDetail.type] || FileText
    const CategoryIcon = CATEGORY_ICONS[contentDetail.category] || BookOpen

    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBackToList}
            className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="border-b border-neutral-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${DIFFICULTY_COLORS[contentDetail.difficulty]}`}>
                    {contentDetail.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-neutral-500">
                    <TypeIcon className="h-4 w-4" />
                    {contentDetail.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-neutral-500">
                    <CategoryIcon className="h-4 w-4" />
                    {contentDetail.category}
                  </span>
                  {contentDetail.duration && (
                    <span className="inline-flex items-center gap-1 text-sm text-neutral-500">
                      <Clock className="h-4 w-4" />
                      {contentDetail.duration}
                    </span>
                  )}
                  {contentDetail.is_premium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                      <Crown className="h-3 w-3" />
                      Premium
                    </span>
                  )}
                </div>
                <CardTitle className="mt-4 text-2xl">{contentDetail.title}</CardTitle>
                <p className="mt-2 text-neutral-600">{contentDetail.description}</p>
              </CardHeader>
              <CardContent className="py-6">
                {isLoadingDetail ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner className="h-6 w-6" />
                  </div>
                ) : contentDetail.content ? (
                  <div className="prose prose-neutral max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: contentDetail.content
                          .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
                          .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
                          .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>')
                          .replace(/^\*\*(.+)\*\*$/gm, '<strong>$1</strong>')
                          .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
                          .replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')
                          .replace(/\n\n/g, '</p><p class="mb-4">')
                          .replace(/\|(.+)\|/g, (match: string) => {
                            const cells = match.split('|').filter(Boolean)
                            return `<tr>${cells.map((cell: string) => `<td class="border px-3 py-2">${cell.trim()}</td>`).join('')}</tr>`
                          })
                      }}
                    />
                  </div>
                ) : contentDetail.content_url ? (
                  <div className="rounded-xl bg-neutral-100 p-8 text-center">
                    <Video className="mx-auto h-12 w-12 text-neutral-400" />
                    <p className="mt-4 text-neutral-600">This is a video tutorial.</p>
                    <a
                      href={contentDetail.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block"
                    >
                      <Button>Watch Video</Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-neutral-500">Content coming soon...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Financial Education</h1>
          <p className="mt-1 text-neutral-600">
            Learn about credit, budgeting, and smart financial decisions
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, videos, and tutorials..."
              className="w-full rounded-xl border border-neutral-200 py-3 pl-12 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories?.categories.map((category: EducationCategory) => {
              const Icon = CATEGORY_ICONS[category.id] || BookOpen
              const isSelected = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    {category.content_count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Type Filter */}
        <div className="mb-8 flex items-center gap-4">
          <Filter className="h-4 w-4 text-neutral-500" />
          <div className="flex gap-2">
            {['article', 'video', 'tutorial'].map((type) => {
              const Icon = TYPE_ICONS[type] || FileText
              const isSelected = selectedType === type
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Content List */}
          <div className="lg:col-span-2">
            {isLoadingContent ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="h-8 w-8" />
              </div>
            ) : contentData?.content && contentData.content.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <AnimatePresence>
                  {contentData.content.map((content: EducationContent, index: number) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      index={index}
                      onClick={() => handleContentClick(content.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
                <h3 className="mt-4 text-lg font-medium text-neutral-900">No content found</h3>
                <p className="mt-2 text-neutral-500">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedType(null)
                    setSearchQuery('')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended for You */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRecommended ? (
                  <div className="flex items-center justify-center py-4">
                    <Spinner className="h-5 w-5" />
                  </div>
                ) : recommended?.recommended && recommended.recommended.length > 0 ? (
                  <div className="space-y-3">
                    {recommended.recommended.slice(0, 3).map((item: EducationContent & { reason: string }) => (
                      <button
                        key={item.id}
                        onClick={() => handleContentClick(item.id)}
                        className="block w-full rounded-lg border border-neutral-100 p-3 text-left transition-all hover:border-primary-200 hover:bg-neutral-50"
                      >
                        <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-primary-600">{item.reason}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">
                    Complete your profile to get personalized recommendations.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Credit Simulator CTA */}
            <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50">
              <CardContent className="py-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">Credit Simulator</h3>
                    <p className="mt-1 text-sm text-primary-700">
                      See how different decisions affect your credit score.
                    </p>
                    <Link to="/simulator">
                      <Button size="sm" className="mt-3 gap-1">
                        Try Simulator
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentCard({
  content,
  index,
  onClick,
}: {
  content: EducationContent
  index: number
  onClick: () => void
}) {
  const TypeIcon = TYPE_ICONS[content.type] || FileText
  const CategoryIcon = CATEGORY_ICONS[content.category] || BookOpen

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={onClick}
        className="block w-full rounded-xl border border-neutral-200 bg-white p-5 text-left transition-all hover:border-primary-200 hover:shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className={`inline-flex rounded-lg p-2 ${
            content.type === 'video'
              ? 'bg-red-50 text-red-600'
              : content.type === 'tutorial'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-neutral-100 text-neutral-600'
          }`}>
            <TypeIcon className="h-5 w-5" />
          </div>
          {content.is_premium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              <Crown className="h-3 w-3" />
              Premium
            </span>
          )}
        </div>

        <h3 className="mt-3 font-semibold text-neutral-900 line-clamp-2">
          {content.title}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
          {content.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${DIFFICULTY_COLORS[content.difficulty]}`}>
            {content.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
            <CategoryIcon className="h-3.5 w-3.5" />
            {content.category}
          </span>
          {content.duration && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
              <Clock className="h-3.5 w-3.5" />
              {content.duration}
            </span>
          )}
        </div>
      </button>
    </motion.div>
  )
}
