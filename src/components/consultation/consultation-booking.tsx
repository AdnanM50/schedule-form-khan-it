"use client"

import { useState } from "react"
import { StepIndicator } from "./step-indicator"
import { PersonalInfoStep } from "./_step-components/personal-info-step"
import { BusinessInfoStep } from "./_step-components/business-info-step"
import { ServiceNeedsStep } from "./_step-components/service-needs-step"
import { ScheduleMeetingStep } from "./_step-components/schedule-meeting-step"
import { ThankYouScreen } from "./thank-you-modal"
import Image from "next/image"
import { sendContactEmail, formatFormDataToMessage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { toast } = useToast()
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

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      // Format the form data into the message string as shown in the API example
      const message = formatFormDataToMessage(formData)
      
      // Send the contact email
      await sendContactEmail({
        name: formData.fullName,
        email: formData.email,
        message: message
      })
      
      // Show success toast
      toast({
        title: "Consultation Request Submitted!",
        description: "Thank you for your interest. We'll get back to you soon.",
        duration: 5000,
      })
      
      // Show success screen
      setShowThankYou(true)
    } catch (error) {
      console.error('Failed to submit form:', error)
      setSubmitError('Failed to submit your consultation request. Please try again.')
      
      // Show error toast
      toast({
        title: "Submission Failed",
        description: "Failed to submit your consultation request. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            width={150}
            height={150}
            src="/logo.png"
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
        <StepIndicator steps={steps} currentStep={currentStep} showThankYou={showThankYou} />

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
            showThankYou ? (
              <ThankYouScreen />
            ) : (
              <ScheduleMeetingStep
                formData={formData}
                updateFormData={updateFormData}
                onConfirm={handleConfirmBooking}
                onBack={handleBack}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}
