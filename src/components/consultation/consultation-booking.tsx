"use client"

import { useState } from "react"
import { StepIndicator } from "./step-indicator"
import { PersonalInfoStep } from "./_step-components/personal-info-step"
import { BusinessInfoStep } from "./_step-components/business-info-step"
import { ServiceNeedsStep } from "./_step-components/service-needs-step"
import { ScheduleMeetingStep } from "./_step-components/schedule-meeting-step"
import { ThankYouModal } from "./thank-you-modal"

export interface FormData {
  // Personal Info
  fullName: string
  email: string
  countryCode: string
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

const steps = [
  { number: 1, label: "Personal Info" },
  { number: 2, label: "Business Info" },
  { number: 3, label: "Service Needs" },
  { number: 4, label: "Schedule Meeting" },
]

export default function ConsultationBooking() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showThankYou, setShowThankYou] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    countryCode: "+88",
    phone: "",
    referralSource: "",
    companyName: "",
    businessType: "",
    website: "",
    hasDoneSEO: "",
    goals: [],
    serviceTeam: "",
    selectedDate: null,
    selectedTime: "",
  })

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConfirmBooking = () => {
    setShowThankYou(true)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GzQRMj2wxz5VDXkODhGEhObXqRvjZP.png"
            alt="MD Faruk Khan Logo"
            className="h-12 w-auto"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Schedule Your Free Consultation</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Let's discuss how we can grow your business together
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <div className="mt-8 sm:mt-12">
          {currentStep === 1 && (
            <PersonalInfoStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <BusinessInfoStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <ServiceNeedsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <ScheduleMeetingStep
              formData={formData}
              updateFormData={updateFormData}
              onConfirm={handleConfirmBooking}
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      {/* Thank You Modal */}
      {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
    </div>
  )
}
