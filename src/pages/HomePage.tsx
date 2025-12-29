import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import {
  ArrowRight,
  Shield,
  Clock,
  Wallet,
  CheckCircle,
  Bot,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  PiggyBank,
  GraduationCap,
  Heart,
  Smartphone,
  Building,
  Award,
} from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { HeroSlider } from '@/components/features/HeroSlider'

const features = [
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Your data is protected with bank-level security and encryption.',
  },
  {
    icon: Clock,
    title: 'Quick Approval',
    description: 'Get approved in as little as 24 hours with our streamlined process.',
  },
  {
    icon: Wallet,
    title: 'Affordable Rates',
    description: 'Competitive interest rates from 9-15% tailored to your profile.',
  },
]

const benefits = [
  'No traditional credit history required',
  'Loans from R5,000 to R15,000',
  'Flexible 12-month repayment terms',
  'AI-powered assessment for fair evaluation',
  'Mobile-first, apply from anywhere',
  'South African focused platform',
]

const howItWorks = [
  {
    step: 1,
    title: 'Create Your Account',
    description: 'Sign up in under 2 minutes with just your ID and basic details.',
    icon: Users,
  },
  {
    step: 2,
    title: 'Tell Us About You',
    description: 'Share your income and expenses so we can find your best rate.',
    icon: Target,
  },
  {
    step: 3,
    title: 'Get Instant Assessment',
    description: 'Our AI reviews your profile and gives you a decision fast.',
    icon: Bot,
  },
  {
    step: 4,
    title: 'Receive Your Funds',
    description: 'Once approved, funds are deposited directly to your account.',
    icon: Wallet,
  },
]

const extraBenefits = [
  {
    icon: Bot,
    title: 'AI Financial Advisor',
    description:
      'Get personalized financial advice 24/7. Our AI advisor helps you budget, save, and make smarter money decisions.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Build Your Credit Profile',
    description:
      'Every on-time payment helps build your credit history, opening doors to better financial products in the future.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: GraduationCap,
    title: 'Financial Education',
    description:
      'Access free resources and tips on budgeting, saving, and managing your finances effectively.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: PiggyBank,
    title: 'Smart Budgeting Tools',
    description:
      'Track your expenses, set savings goals, and understand your spending patterns with our built-in tools.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Heart,
    title: 'Support When You Need It',
    description:
      'Life happens. We offer flexible payment arrangements if you face unexpected financial difficulties.',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    icon: Smartphone,
    title: 'Manage Everything Mobile',
    description:
      'Apply, track payments, and manage your loan entirely from your phone. No paperwork, no branch visits.',
    color: 'bg-cyan-100 text-cyan-600',
  },
]

const stats = [
  { value: '10,000+', label: 'South Africans Helped' },
  { value: 'R50M+', label: 'Deposits Funded' },
  { value: '24hrs', label: 'Average Approval Time' },
  { value: '4.8/5', label: 'Customer Rating' },
]

const testimonials = [
  {
    quote:
      "DEPCO made it possible for me to move into my first apartment. As someone without credit history, I thought I'd never qualify for a loan.",
    name: 'Thabo M.',
    location: 'Johannesburg',
    avatar: 'TM',
  },
  {
    quote:
      "The process was so easy! I applied on my phone during lunch and had approval by the end of the day. The AI advisor also helped me budget better.",
    name: 'Naledi K.',
    location: 'Cape Town',
    avatar: 'NK',
  },
  {
    quote:
      "What I love most is how they look at more than just credit scores. They considered my salary and expenses, which made all the difference.",
    name: 'Sipho D.',
    location: 'Durban',
    avatar: 'SD',
  },
]

const faqs = [
  {
    question: 'Who can apply for a DEPCO loan?',
    answer:
      'Any South African citizen or permanent resident over 18 with a valid ID, proof of income, and a bank account can apply. We welcome first-time borrowers!',
  },
  {
    question: 'How is DEPCO different from traditional lenders?',
    answer:
      "We use AI-powered assessment that looks beyond traditional credit scores. We consider your income, expenses, and overall financial picture to give you a fair chance.",
  },
  {
    question: 'What can I use the loan for?',
    answer:
      'DEPCO loans are specifically designed for rental deposits, but can also cover moving costs, first month rent, or security deposits for your new home.',
  },
  {
    question: 'How quickly can I get the money?',
    answer:
      'Most applications are reviewed within 24 hours. Once approved, funds are typically deposited into your account within 1-2 business days.',
  },
]

export function HomePage() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex flex-col">
      {/* Hero Section with Slider */}
      <HeroSlider />

      {/* Stats Bar */}
      <section className="bg-primary-600 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Why Choose DEPCO?
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              We make rental deposits accessible for everyone
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} variant="outline" className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
                    <Icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-neutral-600">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Get your rental deposit in 4 simple steps
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {howItWorks.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="relative text-center">
                  {index < howItWorks.length - 1 && (
                    <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-primary-200 md:block" />
                  )}
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg">
                    <Icon className="h-7 w-7" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-500 text-xs font-bold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-primary-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
                Built for First-Time Borrowers
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                We understand that traditional credit checks don't tell the whole
                story. Our AI-powered system looks at your complete financial
                picture to give you a fair chance.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-500" />
                    <span className="text-neutral-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to={isSignedIn ? '/apply' : '/register'}>
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    {isSignedIn ? 'Apply Now' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-8 shadow-2xl">
                <div className="flex h-full flex-col justify-center text-white">
                  <p className="text-lg font-medium opacity-90">
                    Average loan amount
                  </p>
                  <p className="mt-2 text-5xl font-bold">R10,000</p>
                  <p className="mt-6 text-lg font-medium opacity-90">
                    Monthly payment from
                  </p>
                  <p className="mt-2 text-4xl font-bold">R925/month</p>
                  <p className="mt-4 text-sm opacity-75">
                    *Based on 12-month term at 11% interest
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Than Just a Loan */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-4 py-1 text-sm font-medium text-secondary-700">
              <Lightbulb className="h-4 w-4" />
              More Than Just a Loan
            </span>
            <h2 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
              Your Financial Partner for Life
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              DEPCO isn't just about lending money. We're here to help you build a
              stronger financial future with tools, education, and support.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {extraBenefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={benefit.title}
                  variant="outline"
                  className="transition-shadow hover:shadow-lg"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${benefit.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-neutral-600">{benefit.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-900 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Real stories from real South Africans we've helped
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="bg-neutral-800 border-neutral-700"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-neutral-400">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-neutral-300">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.question} variant="outline">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-neutral-600">{faq.answer}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-neutral-600">Still have questions?</p>
            <Link to="/contact" className="mt-2 inline-block">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm font-medium">POPIA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span className="text-sm font-medium">NCR Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">10,000+ Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to move into your dream home?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Join thousands of South Africans who have secured their rental
            deposits with DEPCO. Apply in minutes, get approved in hours.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to={isSignedIn ? '/apply' : '/register'}>
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                {isSignedIn ? 'Start Application' : 'Create Free Account'}
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-primary-200">
            No obligation. No hidden fees. Check your rate without affecting your credit score.
          </p>
        </div>
      </section>
    </div>
  )
}
