"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThankYouScreen() {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      {/* Thank You Content */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#FF8C42] rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#0A1F44]">Thank You!</h2>
        <p className="text-sm text-gray-600 leading-relaxed mt-4">
          Your information has been submitted successfully.
          <br />
          Your meeting is confirmed! Check your email for the invitation.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button className="px-6 py-2 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white rounded-md">
            Go to Home
          </Button>
          <Button className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md">
            Explore our Services
          </Button>
        </div>
      </div>
    </div>
  )
}
