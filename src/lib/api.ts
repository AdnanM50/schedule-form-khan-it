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

export interface PartialFormPayload {
  email: string
  name: string
  service: string
  budget: string
  currentStep: string
  message: string
}

export const sendPartialFormData = async (payload: PartialFormPayload): Promise<Response> => {
  const response = await fetch('https://contact-form.up.railway.app/api/sendPartialFormData', {
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

Calendly Scheduled: ${formData.selectedDate && formData.selectedTime ? 'Yes' : 'No'}
Additional Notes: ${formData.referralSource}
Selected Date: ${formData.selectedDate ? formData.selectedDate.toLocaleDateString() : 'N/A'}
Selected Time: ${formData.selectedTime || 'N/A'}
Service Team: ${formData.serviceTeam}
Business Type: ${formData.businessType}
`.trim()
}

export const formatPartialFormDataToMessage = (formData: FormData, currentStep: number): string => {
  const stepMessages = {
    1: `User completed Personal Info step but didn't continue.`,
    2: `User completed Business Info step but didn't continue.`,
    3: `User completed Service Needs step but didn't continue.`,
    4: `User completed Schedule Meeting step but didn't submit.`
  }
  
  const baseMessage = stepMessages[currentStep as keyof typeof stepMessages] || `User reached step ${currentStep} but didn't complete the form.`
  
  let message = `${baseMessage}\n\n`
  
  // Add available data based on current step
  if (currentStep >= 1) {
    message += `Name: ${formData.fullName}\n`
    message += `Email: ${formData.email}\n`
    message += `Phone: ${formData.phone || 'N/A'}\n`
    message += `Referral Source: ${formData.referralSource}\n`
  }
  
  if (currentStep >= 2) {
    message += `Company: ${formData.companyName}\n`
    message += `Business Type: ${formData.businessType}\n`
    message += `Website: ${formData.website || 'N/A'}\n`
    message += `SEO Experience: ${formData.hasDoneSEO}\n`
  }
  
  if (currentStep >= 3) {
    message += `Goals: ${formData.goals.join(', ')}\n`
    message += `Service Team: ${formData.serviceTeam}\n`
  }
  
  if (currentStep >= 4) {
    message += `Selected Date: ${formData.selectedDate ? formData.selectedDate.toLocaleDateString() : 'N/A'}\n`
    message += `Selected Time: ${formData.selectedTime || 'N/A'}\n`
  }
  
  return message.trim()
}

export interface EventType {
  id: number
  slug: string
  length: number
  title: string
  owner: {
    timeZone: string
  }
}

export interface EventTypesResponse {
  message: string
  eventTypes: {
    status: string
    data: {
      eventTypeGroups: Array<{
        eventTypes: EventType[]
      }>
    }
  }
}

export interface AvailableSlotsResponse {
  message: string
  slots: {
    data: Record<string, Array<{ start: string; end: string }>>
    status: string
  }
}

export const getEventTypes = async (): Promise<EventTypesResponse> => {
  try {
    console.log('🌐 Making API call to getEventTypes...')
    const response = await fetch('https://contact-form.up.railway.app/api/getEventTypes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Event Types Response received:', data)
    return data
  } catch (error) {
    console.error('❌ Event Types API Call Failed:', error)
    throw error
  }
}

export interface AvailableTimesParams {
  eventTypeSlug: string
  startDate: string
  endDate: string
  timezone: string
}

// Create Cal.com booking
export const createCalcomBooking = async (bookingData: {
  name: string
  email: string
  timeZone: string
  startTime: string
  eventTypeId: number
}) => {
  try {
    console.log('🔄 Creating Cal.com booking:', bookingData)
    
    const response = await fetch('https://contact-form.up.railway.app/api/createCalcomBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Cal.com Booking Error:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Cal.com Booking Success:', data)
    return data
  } catch (error) {
    console.error('❌ Cal.com Booking Failed:', error)
    throw error
  }
}

export const getAvailableTimes = async (params: AvailableTimesParams): Promise<AvailableSlotsResponse> => {
  try {
    console.log('🌐 Making API call to getAvailableTimes with params:', params)
    
    const response = await fetch('https://contact-form.up.railway.app/api/getAvailableTimes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        eventTypeSlug: params.eventTypeSlug,
        startDate: params.startDate,
        endDate: params.endDate,
        timezone: params.timezone
      }),
    })

    console.log('📡 Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text()
      console.error('❌ Non-JSON response:', textResponse)
      throw new Error('Server returned non-JSON response')
    }

    const data = await response.json()
    console.log('✅ API Response received:', data)
    
    if (!data.slots || !data.slots.data) {
      console.error('❌ Invalid response structure:', data)
      throw new Error('Invalid response format: missing slots data')
    }

    console.log('✅ Valid slots data:', data.slots.data)
    return data
  } catch (error) {
    console.error('❌ API Call Failed:', error)
    throw error
  }
}
