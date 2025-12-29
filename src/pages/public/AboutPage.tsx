import { Link } from 'react-router-dom'
import {
  Target,
  Eye,
  Heart,
  Users,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Button, Card } from '@/components/ui'

const values = [
  {
    icon: Heart,
    title: 'Empathy First',
    description:
      'We understand the challenges first-time borrowers face. Our solutions are designed with your needs in mind.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description:
      'No hidden fees, no surprises. We believe in clear communication and honest lending practices.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description:
      'We use cutting-edge AI technology to give everyone a fair chance, regardless of traditional credit history.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      "We're building a community of financially empowered South Africans, one deposit at a time.",
  },
]

const team = [
  {
    name: 'Thandi Nkosi',
    role: 'CEO & Co-Founder',
    bio: 'Former banker with 15 years experience in consumer lending.',
  },
  {
    name: 'David van der Berg',
    role: 'CTO & Co-Founder',
    bio: 'AI specialist passionate about using technology for financial inclusion.',
  },
  {
    name: 'Nomvula Dlamini',
    role: 'Head of Operations',
    bio: 'Operations expert focused on delivering seamless customer experiences.',
  },
  {
    name: 'Michael Okonkwo',
    role: 'Head of Risk',
    bio: 'Risk management professional ensuring responsible lending practices.',
  },
]

const milestones = [
  { year: '2022', event: 'DEPCO founded in Johannesburg' },
  { year: '2023', event: 'Launched AI-powered credit assessment' },
  { year: '2023', event: 'Reached 5,000 customers served' },
  { year: '2024', event: 'Expanded to all 9 provinces' },
  { year: '2024', event: 'R50 million in deposits funded' },
]

export function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            About DEPCO
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-100">
            We're on a mission to make rental deposits accessible for every
            South African, regardless of their credit history.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <Card variant="outline" className="border-primary-200 bg-primary-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                To break down financial barriers and empower first-time renters
                across South Africa. We believe everyone deserves a fair chance
                at securing their dream home, regardless of their credit history.
              </p>
            </Card>

            <Card variant="outline" className="border-secondary-200 bg-secondary-50">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary-500">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                Our Vision
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                A South Africa where financial access is determined by potential,
                not just history. Where every young professional, student, or
                first-time worker can access the funds they need to start their
                independent life.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-lg text-neutral-600">
                <p>
                  DEPCO was born from a simple observation: too many young South
                  Africans were being denied housing because they couldn't afford
                  the upfront deposit, not because they couldn't afford the rent.
                </p>
                <p>
                  Our founders experienced this challenge firsthand. Despite having
                  stable jobs and regular income, traditional lenders wouldn't
                  consider them because they lacked credit history.
                </p>
                <p>
                  We built DEPCO to change that. Using AI and alternative data, we
                  assess creditworthiness differently – looking at income stability,
                  expense patterns, and overall financial behavior rather than just
                  traditional credit scores.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Our Journey
                </h3>
                <div className="mt-6 space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                        {milestone.year.slice(-2)}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {milestone.year}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {milestone.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <Card key={value.title} variant="outline" className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
                    <Icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-neutral-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-neutral-600">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              The people behind DEPCO's mission
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {member.name}
                </h3>
                <p className="text-primary-600">{member.role}</p>
                <p className="mt-2 text-sm text-neutral-600">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Ready to Join Our Community?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Be part of the movement that's changing how South Africans access
            rental deposits.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
