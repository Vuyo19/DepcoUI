import { FileText } from 'lucide-react'
import { Card } from '@/components/ui'

export function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-800 to-neutral-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <FileText className="h-12 w-12 text-primary-400" />
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Terms of Service
              </h1>
              <p className="mt-2 text-neutral-300">
                Please read these terms carefully before using our services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-neutral-500">Last updated: January 2025</p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                1. Agreement to Terms
              </h2>
              <p className="mt-4 text-neutral-600">
                By accessing or using DEPCO's services, you agree to be bound by
                these Terms of Service and all applicable laws and regulations. If
                you do not agree with any of these terms, you are prohibited from
                using our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                2. Eligibility
              </h2>
              <p className="mt-4 text-neutral-600">To use DEPCO's services, you must:</p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-600">
                <li>Be at least 18 years of age</li>
                <li>Be a South African citizen or permanent resident</li>
                <li>Have a valid South African ID document</li>
                <li>Have a valid South African bank account</li>
                <li>Have a regular source of income</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                3. Loan Terms
              </h2>
              <p className="mt-4 text-neutral-600">
                DEPCO provides personal loans for rental deposits subject to the
                following:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-600">
                <li>Loan amounts range from R5,000 to R15,000</li>
                <li>Interest rates range from 9% to 15% per annum</li>
                <li>Repayment terms are 6 or 12 months</li>
                <li>All loans are subject to credit assessment and approval</li>
                <li>
                  Fees and charges are disclosed before loan acceptance as per the
                  National Credit Act
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                4. Your Responsibilities
              </h2>
              <p className="mt-4 text-neutral-600">As a DEPCO user, you agree to:</p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-600">
                <li>Provide accurate and truthful information</li>
                <li>Keep your account credentials secure</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Make loan repayments on time as agreed</li>
                <li>Update your contact information when it changes</li>
                <li>Not use our services for any illegal purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                5. Credit Assessment
              </h2>
              <p className="mt-4 text-neutral-600">
                By applying for a loan, you consent to DEPCO:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-600">
                <li>
                  Conducting credit checks with registered credit bureaus
                </li>
                <li>Verifying your identity and income</li>
                <li>Using AI-powered assessment to evaluate your application</li>
                <li>
                  Reporting your payment history to credit bureaus
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                6. Late Payments & Default
              </h2>
              <Card variant="outline" className="mt-4 border-amber-200 bg-amber-50">
                <p className="text-neutral-700">
                  <strong>Important:</strong> Failure to make payments on time may
                  result in:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-1 text-neutral-600">
                  <li>Late payment fees as disclosed in your loan agreement</li>
                  <li>Negative impact on your credit score</li>
                  <li>Collection actions to recover outstanding amounts</li>
                  <li>Legal proceedings if necessary</li>
                </ul>
              </Card>
              <p className="mt-4 text-neutral-600">
                If you're experiencing financial difficulty, please contact us
                immediately. We may be able to offer hardship arrangements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                7. Intellectual Property
              </h2>
              <p className="mt-4 text-neutral-600">
                All content on DEPCO's platform, including text, graphics, logos,
                and software, is the property of DEPCO (Pty) Ltd and is protected
                by South African intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                8. Limitation of Liability
              </h2>
              <p className="mt-4 text-neutral-600">
                DEPCO shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of our
                services, except where such limitation is prohibited by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                9. Dispute Resolution
              </h2>
              <p className="mt-4 text-neutral-600">
                Any disputes arising from these terms shall be:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-600">
                <li>First, attempted to be resolved through our internal complaints process</li>
                <li>Then, referred to the National Credit Regulator if unresolved</li>
                <li>Finally, resolved through arbitration under South African law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                10. Changes to Terms
              </h2>
              <p className="mt-4 text-neutral-600">
                DEPCO reserves the right to modify these terms at any time. We will
                notify you of significant changes via email or through our
                platform. Continued use of our services after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                11. Governing Law
              </h2>
              <p className="mt-4 text-neutral-600">
                These terms are governed by the laws of the Republic of South
                Africa, including but not limited to the National Credit Act 34 of
                2005, the Consumer Protection Act 68 of 2008, and the Protection of
                Personal Information Act 4 of 2013.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-900">
                12. Contact Us
              </h2>
              <Card variant="outline" className="mt-4">
                <p className="text-neutral-600">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="mt-4 space-y-2 text-neutral-700">
                  <p>
                    <strong>Email:</strong> legal@depco.co.za
                  </p>
                  <p>
                    <strong>Phone:</strong> 0800 DEPCO (33726)
                  </p>
                  <p>
                    <strong>Address:</strong> 123 Financial Street, Sandton,
                    Johannesburg, 2196
                  </p>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
