"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import type { FormData } from "../consultation-booking"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ServiceNeedsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
}

const goals = [
  { id: "foot-traffic", label: "Increase local foot traffic/calls" },
  { id: "online-sales", label: "Boost online sales/revenue" },
  { id: "brand-awareness", label: "Improve brand awareness" },
  { id: "outrank-competitors", label: "Outrank specific competitors" },
  { id: "recover-rankings", label: "Recover lost rankings" },
  { id: "other-goal", label: "Other" },
]

const serviceTeams = [
  {
    id: "local-seo",
    label: "Local SEO",
    description: "Best for local businesses (plumbers, lawyers, doctors)",
  },
  {
    id: "ecommerce-seo",
    label: "E-Commerce SEO",
    description: "Optimized for Shopify, WooCommerce & online stores",
  },
  {
    id: "brand-seo",
    label: "Brand SEO & PR",
    description: "Build visibility for a person or company brand",
  },
  {
    id: "digital-marketing",
    label: "Digital Marketing Consultancy",
    description: "Strategy sessions to guide your growth",
  },
  {
    id: "rank-recovery",
    label: "Rank Drop/Penalty Recovery",
    description: "Fix sudden Google ranking issues",
  },
  {
    id: "seo-workshop",
    label: "SEO Workshop",
    description: "Training day for your company/institution",
  },
  {
    id: "other-service",
    label: "Other",
    description: "Custom requirements",
  },
]

export function ServiceNeedsStep({ formData, updateFormData, onNext, onBack }: ServiceNeedsStepProps) {
  const handleGoalToggle = (goalId: string) => {
    const currentGoals = formData.goals || []
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((id) => id !== goalId)
      : [...currentGoals, goalId]
    updateFormData({ goals: newGoals })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.goals.length === 0 || !formData.serviceTeam) {
      alert("Please select at least one goal and a service team")
      return
    }
    onNext()
  }

  return (
    <div className="max-w-[768px] mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Goals Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">What's your primary goal?</h3>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-3">
                <Checkbox
                  id={goal.id}
                  checked={formData.goals.includes(goal.id)}
                  onCheckedChange={() => handleGoalToggle(goal.id)}
                  className="!w-4 !h-4 !border-2 !border-orange-500 !bg-white data-[state=checked]:!bg-orange-500 data-[state=checked]:!border-orange-500 data-[state=checked]:!text-white"
                />
                <Label htmlFor={goal.id} className="text-sm font-normal cursor-pointer text-gray-700">
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Service Team Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Choose the Service You're Looking For</h3>
          <RadioGroup
            value={formData.serviceTeam}
            onValueChange={(value) => updateFormData({ serviceTeam: value })}
            className="space-y-3"
          >
            {serviceTeams.map((service) => (
              <div
                key={service.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                  formData.serviceTeam === service.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateFormData({ serviceTeam: service.id })}
              >
                <RadioGroupItem 
                  value={service.id} 
                  id={service.id} 
                  className="!mt-0.5 !w-4 !h-4 !border-2 !border-orange-500 !bg-white data-[state=checked]:!bg-orange-500 data-[state=checked]:!border-orange-500 data-[state=checked]:!text-white" 
                />
                <div className="flex-1">
                  <Label htmlFor={service.id} className="text-sm font-semibold cursor-pointer block text-gray-800">
                    {service.label}
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto px-4 sm:px-6 h-10 sm:h-12 text-sm sm:text-base font-medium bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto px-4 sm:px-6 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white h-10 sm:h-12 text-sm sm:text-base font-medium"
          >
            Continue to Next Step
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
