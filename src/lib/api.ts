export interface ContactEmailPayload {
  name: string
  email: string
  message: string
}

export interface FormData {
  // Personal Info
  fullName: string
  email: string
  phone: string
  referralSource: string

  // Business Info
  companyName: string
  businessType: string
  website: string
  hasDoneSEO: string

  // Service Needs
  goals: string[]
  serviceTeam: string

  // Schedule Meeting
  selectedDate: Date | null
  selectedTime: string
}

export const sendContactEmail = async (payload: ContactEmailPayload): Promise<Response> => {
  const response = await fetch('https://contact-form.up.railway.app/api/sendContactEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response
}

export const formatFormDataToMessage = (formData: FormData): string => {
  const fullPhone = formData.phone || 'N/A'
  
  return `
Phone: ${fullPhone}
Company: ${formData.companyName}
Website: ${formData.website || 'N/A'}
Services: ${formData.goals.join(', ')}
Google Ranking: ${formData.hasDoneSEO}
GBP Verified: ${formData.hasDoneSEO}
Budget: N/A
Calendly Scheduled: ${formData.selectedDate && formData.selectedTime ? 'Yes' : 'No'}
Additional Notes: ${formData.referralSource}
Selected Date: ${formData.selectedDate ? formData.selectedDate.toLocaleDateString() : 'N/A'}
Selected Time: ${formData.selectedTime || 'N/A'}
Service Team: ${formData.serviceTeam}
Business Type: ${formData.businessType}
`.trim()
}
