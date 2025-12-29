import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Search, MessageCircle } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { cn } from '@/lib/utils'

const faqCategories = [
  {
    name: 'Getting Started',
    faqs: [
      {
        question: 'Who can apply for a DEPCO loan?',
        answer:
          'Any South African citizen or permanent resident over 18 with a valid ID, proof of income, and a bank account can apply. We welcome first-time borrowers and those with limited credit history.',
      },
      {
        question: 'How much can I borrow?',
        answer:
          'DEPCO offers loans from R5,000 to R15,000, specifically designed for rental deposits. The amount you qualify for depends on your income, expenses, and overall financial profile.',
      },
      {
        question: 'What documents do I need to apply?',
        answer:
          'You\'ll need: (1) Valid South African ID or passport, (2) Proof of income (payslip or bank statements), (3) Proof of residence, and (4) Bank account details. All documents can be uploaded digitally.',
      },
      {
        question: 'How long does the application process take?',
        answer:
          'Most applications are reviewed within 24 hours. Once approved, funds are typically deposited into your account within 1-2 business days.',
      },
    ],
  },
  {
    name: 'Loan Terms & Rates',
    faqs: [
      {
        question: 'What are the interest rates?',
        answer:
          'Our interest rates range from 9% to 15% per annum, depending on your risk profile. The rate you receive is personalized based on your income, expenses, and financial behavior.',
      },
      {
        question: 'What is the repayment term?',
        answer:
          'DEPCO offers flexible repayment terms of 6 or 12 months. You can choose the term that best fits your budget and financial situation.',
      },
      {
        question: 'Are there any hidden fees?',
        answer:
          'No! DEPCO is committed to transparency. You\'ll see all fees upfront before accepting your loan offer, including the initiation fee and monthly service fee as regulated by the National Credit Act.',
      },
      {
        question: 'Can I pay off my loan early?',
        answer:
          'Yes! You can pay off your loan early at any time without any early settlement penalties. We actually encourage it as it saves you on interest.',
      },
    ],
  },
  {
    name: 'Payments & Account',
    faqs: [
      {
        question: 'How do I make payments?',
        answer:
          'Payments are automatically deducted from your bank account via debit order on your chosen payment date. You can also make additional payments through EFT or the DEPCO app.',
      },
      {
        question: 'What happens if I miss a payment?',
        answer:
          'If you anticipate difficulties making a payment, contact us immediately. We offer flexible arrangements for genuine hardship cases. Late payments may incur fees and affect your credit profile.',
      },
      {
        question: 'Can I change my payment date?',
        answer:
          'Yes, you can request to change your payment date once during your loan term. Contact our support team to make this change.',
      },
      {
        question: 'How do I check my loan balance?',
        answer:
          'Log into your DEPCO account to view your current balance, payment history, and upcoming payments. You can also contact our support team for this information.',
      },
    ],
  },
  {
    name: 'AI & Credit Assessment',
    faqs: [
      {
        question: 'How is DEPCO different from traditional lenders?',
        answer:
          'DEPCO uses AI-powered assessment that looks beyond traditional credit scores. We analyze your income stability, expense patterns, and overall financial behavior to give you a fair chance.',
      },
      {
        question: 'Will applying affect my credit score?',
        answer:
          'Checking your eligibility with DEPCO does a soft credit check, which doesn\'t affect your score. A hard credit check is only done once you accept a loan offer.',
      },
      {
        question: 'What is the AI Financial Advisor?',
        answer:
          'Our AI Financial Advisor is a free tool available to all DEPCO users. It provides personalized budgeting tips, savings advice, and helps you understand your finances better.',
      },
      {
        question: 'Can I improve my chances of approval?',
        answer:
          'Yes! Completing your expense profile, maintaining stable income, and keeping your expenses manageable all improve your chances. Our AI considers your complete financial picture.',
      },
    ],
  },
  {
    name: 'Security & Privacy',
    faqs: [
      {
        question: 'Is my information secure?',
        answer:
          'Absolutely. DEPCO uses bank-level encryption (256-bit SSL) to protect your data. We\'re also POPIA compliant and never share your information with third parties without consent.',
      },
      {
        question: 'How do you protect against fraud?',
        answer:
          'We use multi-factor authentication, fraud detection algorithms, and regular security audits to protect your account. Report any suspicious activity immediately.',
      },
      {
        question: 'Can I delete my account and data?',
        answer:
          'Yes, you have the right to request deletion of your data under POPIA. Contact our support team to initiate this process. Note that some data may be retained for legal compliance.',
      },
    ],
  },
]

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (question: string) => {
    setOpenItems((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    )
  }

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-100">
            Find answers to common questions about DEPCO loans and services
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <Input
              placeholder="Search for answers..."
              leftIcon={<Search className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {filteredCategories.length > 0 ? (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <h2 className="mb-6 text-2xl font-bold text-neutral-900">
                    {category.name}
                  </h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq) => (
                      <Card
                        key={faq.question}
                        variant="outline"
                        padding="none"
                        className="overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(faq.question)}
                          className="flex w-full items-center justify-between p-6 text-left"
                        >
                          <span className="font-semibold text-neutral-900">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 flex-shrink-0 text-neutral-500 transition-transform',
                              openItems.includes(faq.question) && 'rotate-180'
                            )}
                          />
                        </button>
                        {openItems.includes(faq.question) && (
                          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
                            <p className="text-neutral-600">{faq.answer}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-neutral-600">
                No results found for "{searchQuery}"
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            Still have questions?
          </h2>
          <p className="mt-4 text-neutral-600">
            Our support team is ready to help you
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/contact">
              <Button leftIcon={<MessageCircle className="h-4 w-4" />}>
                Contact Support
              </Button>
            </Link>
            <Button variant="outline">Chat with AI Advisor</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
