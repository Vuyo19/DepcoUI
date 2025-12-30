import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { Layout, PageTransition } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth'

// Pages
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoansPage } from '@/pages/loans/LoansPage'
import { ApplyPage } from '@/pages/apply/ApplyPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { BankVerifyPage } from '@/pages/apply/BankVerifyPage'
import { ExpenseProfilePage } from '@/pages/onboarding/ExpenseProfilePage'
import { ProfileOnboardingPage } from '@/pages/onboarding/ProfileOnboardingPage'
import { CreditSimulatorPage } from '@/pages/simulator/CreditSimulatorPage'
import { LearnPage } from '@/pages/learn/LearnPage'

// Public Pages
import { AboutPage } from '@/pages/public/AboutPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { FAQPage } from '@/pages/public/FAQPage'
import { HowItWorksPage } from '@/pages/public/HowItWorksPage'

// Legal Pages
import { POPIAPage } from '@/pages/legal/POPIAPage'
import { TermsPage } from '@/pages/legal/TermsPage'

export function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <PageTransition>
                <HomePage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <PageTransition>
                <AboutPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <PageTransition>
                <ContactPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout>
              <PageTransition>
                <FAQPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <Layout>
              <PageTransition>
                <HowItWorksPage />
              </PageTransition>
            </Layout>
          }
        />

        {/* Legal Pages */}
        <Route
          path="/popia"
          element={
            <Layout>
              <PageTransition>
                <POPIAPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <PageTransition>
                <TermsPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PageTransition>
                <POPIAPage />
              </PageTransition>
            </Layout>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <LoansPage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <ApplyPage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply/bank-verify"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <BankVerifyPage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/expenses"
          element={
            <ProtectedRoute>
              <Layout showFooter={false}>
                <PageTransition>
                  <ExpenseProfilePage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/profile"
          element={
            <ProtectedRoute>
              <Layout showFooter={false}>
                <PageTransition>
                  <ProfileOnboardingPage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulator"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <CreditSimulatorPage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <LearnPage />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}
