"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  { id: "foot-traffic", label: "Increase local foot traffic" },
  { id: "online-sales", label: "Boost online sales/revenue" },
  { id: "brand-awareness", label: "Improve brand awareness" },
  { id: "quality-leads", label: "Generate quality Leads/calls" },
  { id: "google-ranking", label: "Rank higher on Google" },
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
    description: "Specialized in Shopify, WooCommerce & other e-stores",
  },
  {
    id: "brand-seo",
    label: "Brand SEO & PR",
    description: "Scale visibility for brands/companies",
  },
  {
    id: "digital-marketing",
    label: "Digital Marketing Consultancy",
    description: "Full-funnel marketing strategy & execution",
  },
  {
    id: "tech-recovery",
    label: "Tech Stack/Penalty Recovery",
    description: "Fix website issues affecting search",
  },
  {
    id: "seo-workshop",
    label: "SEO Workshop",
    description: "Training day for your content/marketing team",
  },
  {
    id: "other-service",
    label: "Other",
    description: "Custom requirement",
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
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-border p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Goals Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">What are your main goals?</h3>
          <p className="text-sm text-muted-foreground">(Choose all that apply)</p>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-3">
                <Checkbox
                  id={goal.id}
                  checked={formData.goals.includes(goal.id)}
                  onCheckedChange={() => handleGoalToggle(goal.id)}
                />
                <Label htmlFor={goal.id} className="text-sm font-normal cursor-pointer">
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Service Team Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Choose the Service Team/s looking for</h3>
          <RadioGroup
            value={formData.serviceTeam}
            onValueChange={(value) => updateFormData({ serviceTeam: value })}
            className="space-y-3"
          >
            {serviceTeams.map((service) => (
              <div
                key={service.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={service.id} id={service.id} className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor={service.id} className="text-sm font-medium cursor-pointer block">
                    {service.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 text-base font-medium bg-transparent"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white h-12 text-base font-medium"
          >
            Continue to Next Step
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
