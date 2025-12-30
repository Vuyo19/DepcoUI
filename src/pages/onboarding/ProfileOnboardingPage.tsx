import { useNavigate, useLocation } from 'react-router-dom'
import { ProfileOnboardingForm, type ProfileFormData } from '@/components/features/ProfileOnboardingForm'
import { useUpdateProfile, useUserProfile } from '@/hooks'
import { Loader2 } from 'lucide-react'

export function ProfileOnboardingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: userProfile, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()

  // Get redirect path from state, default to /dashboard
  const redirectTo = (location.state as { from?: string })?.from || '/dashboard'

  const handleComplete = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync({
      phone_number: data.phone_number,
      id_number: data.id_number,
      date_of_birth: data.date_of_birth,
      address_street: data.address_street,
      address_city: data.address_city,
      address_province: data.address_province,
      address_postal_code: data.address_postal_code,
    })
    navigate(redirectTo)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  // Map existing profile data to form format
  const existingData: Partial<ProfileFormData> = {
    phone_number: userProfile?.phone_number || '',
    id_number: userProfile?.id_number || '',
    date_of_birth: userProfile?.date_of_birth ? new Date(userProfile.date_of_birth).toISOString().split('T')[0] : '',
    address_street: userProfile?.address_street || '',
    address_city: userProfile?.address_city || '',
    address_province: userProfile?.address_province || '',
    address_postal_code: userProfile?.address_postal_code || '',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-neutral-600">
            We need a few details to verify your identity
          </p>
        </div>
        <ProfileOnboardingForm
          onComplete={handleComplete}
          existingData={existingData}
        />
      </div>
    </div>
  )
}
