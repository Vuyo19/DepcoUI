import { Shield, Lock, Eye, UserCheck, FileText, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui'

export function POPIAPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-neutral-800 to-neutral-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Shield className="h-12 w-12 text-primary-400" />
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                POPIA Compliance
              </h1>
              <p className="mt-2 text-neutral-300">
                Protection of Personal Information Act
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-neutral-500">
            Last updated: January 2025
          </p>

          <div className="mt-8 prose prose-neutral max-w-none">
            <Card className="mb-8 border-primary-200 bg-primary-50">
              <div className="flex gap-4">
                <Shield className="h-6 w-6 flex-shrink-0 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Your Privacy Matters
                  </h3>
                  <p className="mt-1 text-neutral-600">
                    DEPCO is committed to protecting your personal information in
                    accordance with the Protection of Personal Information Act
                    (POPIA) of South Africa.
                  </p>
                </div>
              </div>
            </Card>

            <h2 className="text-2xl font-bold text-neutral-900">
              1. Introduction
            </h2>
            <p className="text-neutral-600">
              DEPCO (Pty) Ltd ("we", "us", or "our") respects your privacy and is
              committed to protecting your personal information. This POPIA
              Compliance Statement explains how we collect, use, store, and
              protect your personal information in accordance with the Protection
              of Personal Information Act 4 of 2013 (POPIA).
            </p>

            <h2 className="mt-8 text-2xl font-bold text-neutral-900">
              2. Information We Collect
            </h2>
            <p className="text-neutral-600">We collect the following categories of personal information:</p>
            <ul className="mt-4 space-y-3 text-neutral-600">
              <li className="flex gap-3">
                <UserCheck className="h-5 w-5 flex-shrink-0 text-primary-500" />
                <span>
                  <strong>Identity Information:</strong> Full name, ID number,
                  date of birth, gender
                </span>
              </li>
              <li className="flex gap-3">
                <FileText className="h-5 w-5 flex-shrink-0 text-primary-500" />
                <span>
                  <strong>Contact Information:</strong> Phone number, email
                  address, physical address
                </span>
              </li>
              <li className="flex gap-3">
                <Lock className="h-5 w-5 flex-shrink-0 text-primary-500" />
                <span>
                  <strong>Financial Information:</strong> Bank account details,
                  income information, expense data
                </span>
              </li>
              <li className="flex gap-3">
                <Eye className="h-5 w-5 flex-shrink-0 text-primary-500" />
                <span>
                  <strong>Technical Information:</strong> IP address, device
                  information, browsing data
                </span>
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-neutral-900">
              3. How We Use Your Information
            </h2>
            <p className="text-neutral-600">
              We process your personal information for the following purposes:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-600">
              <li>To assess your loan application</li>
              <li>To verify your identity</li>
              <li>To communicate with you about your account</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>To improve our services and customer experience</li>
              <li>To prevent fraud and ensure security</li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-neutral-900">
              4. Your Rights Under POPIA
            </h2>
            <p className="text-neutral-600">
              As a data subject, you have the following rights:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Card variant="outline" padding="sm">
                <h4 className="font-semibold text-neutral-900">
                  Right to Access
                </h4>
                <p className="mt-1 text-sm text-neutral-600">
                  Request a copy of the personal information we hold about you.
                </p>
              </Card>
              <Card variant="outline" padding="sm">
                <h4 className="font-semibold text-neutral-900">
                  Right to Correction
                </h4>
                <p className="mt-1 text-sm text-neutral-600">
                  Request correction of inaccurate or incomplete information.
                </p>
              </Card>
              <Card variant="outline" padding="sm">
                <h4 className="font-semibold text-neutral-900">
                  Right to Deletion
                </h4>
                <p className="mt-1 text-sm text-neutral-600">
                  Request deletion of your personal information where applicable.
                </p>
              </Card>
              <Card variant="outline" padding="sm">
                <h4 className="font-semibold text-neutral-900">
                  Right to Object
                </h4>
                <p className="mt-1 text-sm text-neutral-600">
                  Object to processing of your information for direct marketing.
                </p>
              </Card>
            </div>

            <h2 className="mt-8 text-2xl font-bold text-neutral-900">
              5. Data Security
            </h2>
            <p className="text-neutral-600">
              We implement appropriate technical and organizational measures to
              protect your personal information, including:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-600">
              <li>256-bit SSL encryption for data transmission</li>
              <li>Secure data centers with access controls</li>
              <li>Regular security audits and penetration testing</li>
              <li>Employee training on data protection</li>
              <li>Multi-factor authentication</li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-neutral-900">
              6. Data Retention
            </h2>
            <p className="text-neutral-600">
              We retain your personal information for as long as necessary to
              fulfill the purposes for which it was collected, or as required by
              law. Financial records are retained for a minimum of 5 years as
              required by the National Credit Act.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-neutral-900">
              7. Information Officer
            </h2>
            <Card variant="outline" className="mt-4">
              <p className="text-neutral-600">
                For any POPIA-related queries or to exercise your rights, please
                contact our Information Officer:
              </p>
              <div className="mt-4 space-y-2 text-neutral-700">
                <p>
                  <strong>Name:</strong> Privacy Officer
                </p>
                <p>
                  <strong>Email:</strong> privacy@depco.co.za
                </p>
                <p>
                  <strong>Phone:</strong> 0800 DEPCO (33726)
                </p>
                <p>
                  <strong>Address:</strong> 123 Financial Street, Sandton, 2196
                </p>
              </div>
            </Card>

            <Card className="mt-8 border-amber-200 bg-amber-50">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Complaints
                  </h3>
                  <p className="mt-1 text-neutral-600">
                    If you believe we have not handled your personal information
                    correctly, you have the right to lodge a complaint with the
                    Information Regulator at{' '}
                    <a
                      href="https://www.justice.gov.za/inforeg/"
                      className="text-primary-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.justice.gov.za/inforeg
                    </a>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
