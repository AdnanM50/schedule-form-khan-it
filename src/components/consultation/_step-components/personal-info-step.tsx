"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "../consultation-booking"
import { ArrowRight } from "lucide-react"

interface PersonalInfoStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
}

export function PersonalInfoStep({ formData, updateFormData, onNext }: PersonalInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-border p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            required
            className="w-full"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            required
            className="w-full"
          />
        </div>

        {/* Mobile/WhatsApp */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Mobile/WhatsApp
          </Label>
          <div className="flex gap-2">
            <Select value={formData.countryCode} onValueChange={(value) => updateFormData({ countryCode: value })}>
              <SelectTrigger className="w-24">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🇧🇩</span>
                    <span className="text-sm">{formData.countryCode}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+88">
                  <span className="flex items-center gap-2">
                    <span>🇧🇩</span>
                    <span>+88</span>
                  </span>
                </SelectItem>
                <SelectItem value="+1">
                  <span className="flex items-center gap-2">
                    <span>🇺🇸</span>
                    <span>+1</span>
                  </span>
                </SelectItem>
                <SelectItem value="+44">
                  <span className="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>+44</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              required
              className="flex-1"
            />
          </div>
        </div>

        {/* Where did you hear about us? */}
        <div className="space-y-2">
          <Label htmlFor="referralSource" className="text-sm font-medium">
            Where did you hear about us?
          </Label>
          <Select
            value={formData.referralSource}
            onValueChange={(value) => updateFormData({ referralSource: value })}
            required
          >
            <SelectTrigger id="referralSource">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google Search</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white h-12 text-base font-medium"
        >
          Continue to Next Step
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
