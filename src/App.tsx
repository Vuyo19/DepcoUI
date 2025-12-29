import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, SignedIn } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AnimatedRoutes } from '@/components/layout'
import { AdvisorFloatingButton } from '@/components/features'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App() {
  if (!clerkPubKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Configuration Required
          </h1>
          <p className="mt-2 text-neutral-600">
            Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AnimatedRoutes />

          {/* AI Advisor - Only show when signed in */}
          <SignedIn>
            <AdvisorFloatingButton />
          </SignedIn>

          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default App
