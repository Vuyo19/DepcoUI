import { Link } from 'react-router-dom'
import {
  UserPlus,
  FileText,
  Bot,
  Wallet,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Smartphone,
} from 'lucide-react'
import { Button, Card } from '@/components/ui'

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Create Your Account',
    description:
      'Sign up in under 2 minutes using your South African ID. No paperwork, no branch visits – everything is done online.',
    details: [
      'Provide your personal details',
      'Verify your phone number',
      'Create a secure password',
    ],
    time: '2 minutes',
  },
  {
    number: 2,
    icon: FileText,
    title: 'Complete Your Profile',
    description:
      'Tell us about your income and expenses. This helps us understand your financial situation and find the best rate for you.',
    details: [
      'Upload proof of income',
      'Share your monthly expenses',
      'Complete bank verification',
    ],
    time: '5-10 minutes',
  },
  {
    number: 3,
    icon: Bot,
    title: 'AI-Powered Assessment',
    description:
      'Our AI reviews your complete financial picture, not just traditional credit scores. This gives first-time borrowers a fair chance.',
    details: [
      'Income stability analysis',
      'Expense pattern review',
      'Alternative data assessment',
    ],
    time: 'Instant to 24 hours',
  },
  {
    number: 4,
    icon: Wallet,
    title: 'Receive Your Funds',
    description:
      "Once approved, accept your loan offer and funds are deposited directly into your bank account. It's that simple.",
    details: [
      'Review your personalized offer',
      'Accept terms electronically',
      'Funds in your account',
    ],
    time: '1-2 business days',
  },
]

const benefits = [
  {
    icon: Clock,
    title: 'Fast Process',
    description: 'From application to funds in as little as 24 hours.',
  },
  {
    icon: Shield,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with all costs shown upfront.',
  },
  {
    icon: Smartphone,
    title: '100% Digital',
    description: 'Apply and manage everything from your phone.',
  },
]

export function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            How It Works
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-100">
            Getting your rental deposit has never been easier. Here's our simple
            4-step process.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 1

              return (
                <div
                  key={step.number}
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white">
                        {step.number}
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600">
                        <Clock className="h-4 w-4" />
                        {step.time}
                      </div>
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                      {step.title}
                    </h2>
                    <p className="mt-4 text-lg text-neutral-600">
                      {step.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-secondary-500" />
                          <span className="text-neutral-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100">
                      <Icon className="h-32 w-32 text-primary-500" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="bg-primary-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div key={benefit.title} className="text-center text-white">
                  <Icon className="mx-auto h-10 w-10" />
                  <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-primary-100">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Example Timeline */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">
              Real Example Timeline
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              See how Thabo got his R10,000 deposit loan
            </p>
          </div>

          <Card className="mt-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-600">
                  Mon
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    Monday, 9:00 AM
                  </p>
                  <p className="text-neutral-600">
                    Thabo creates his DEPCO account and completes his profile
                    during his morning commute.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-600">
                  Mon
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    Monday, 2:00 PM
                  </p>
                  <p className="text-neutral-600">
                    Our AI completes the assessment. Thabo receives a loan offer
                    of R10,000 at 11% interest.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-600">
                  Mon
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    Monday, 3:00 PM
                  </p>
                  <p className="text-neutral-600">
                    Thabo reviews the terms and accepts the offer electronically.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary-100 font-semibold text-secondary-600">
                  Tue
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">
                    Tuesday, 10:00 AM
                  </p>
                  <p className="text-neutral-600">
                    R10,000 is deposited into Thabo's bank account. He's ready to
                    pay his rental deposit!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            Join thousands of South Africans who have secured their rental
            deposits with DEPCO.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Create Free Account
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" size="lg">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
