import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Card } from '@/components/ui'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['0800 DEPCO (33726)', '+27 11 123 4567'],
    description: 'Mon-Fri, 8am-6pm SAST',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['support@depco.co.za', 'applications@depco.co.za'],
    description: 'We respond within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Office',
    details: ['123 Financial Street', 'Sandton, Johannesburg', '2196'],
    description: 'By appointment only',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Monday - Friday: 8am - 6pm', 'Saturday: 9am - 1pm'],
    description: 'Closed on public holidays',
  },
]

const subjects = [
  'General Inquiry',
  'Loan Application Status',
  'Payment Questions',
  'Technical Support',
  'Complaints',
  'Partnership Opportunities',
  'Other',
]

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Message sent! We\'ll get back to you soon.')
      reset()
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-100">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <Card key={info.title} variant="outline">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                    {info.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {info.details.map((detail, index) => (
                      <p key={index} className="text-neutral-700">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    {info.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Quick Links */}
      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Send us a Message
                </h2>
                <p className="mt-2 text-neutral-600">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-8 space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                      label="Phone Number (Optional)"
                      placeholder="081 234 5678"
                      {...register('phone')}
                    />
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Subject
                      </label>
                      <select
                        className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        {...register('subject')}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1.5 text-sm text-red-500">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    leftIcon={<Send className="h-4 w-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <Card variant="outline" className="border-primary-200 bg-primary-50">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Live Chat
                  </h3>
                </div>
                <p className="mt-2 text-neutral-600">
                  Chat with our AI advisor or a support agent in real-time.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  Start Chat
                </Button>
              </Card>

              <Card variant="outline">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-secondary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Help Center
                  </h3>
                </div>
                <p className="mt-2 text-neutral-600">
                  Find answers to common questions in our FAQ section.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  View FAQ
                </Button>
              </Card>

              <Card className="bg-neutral-900">
                <h3 className="text-lg font-semibold text-white">
                  Need Urgent Help?
                </h3>
                <p className="mt-2 text-neutral-300">
                  For urgent matters regarding your loan or account, call our
                  priority line.
                </p>
                <p className="mt-4 text-2xl font-bold text-primary-400">
                  0800 DEPCO
                </p>
                <p className="text-sm text-neutral-400">
                  Available Mon-Fri, 8am-6pm
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-neutral-100">
            <div className="flex h-80 items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-neutral-400" />
                <p className="mt-4 text-neutral-600">
                  123 Financial Street, Sandton, Johannesburg
                </p>
                <Button variant="outline" className="mt-4">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
