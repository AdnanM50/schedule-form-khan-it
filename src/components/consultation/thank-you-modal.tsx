"use client"

import { Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThankYouModalProps {
  onClose: () => void
}

export function ThankYouModal({ onClose }: ThankYouModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#FF8C42] rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your information has been submitted successfully.
            <br />
            Your meeting is confirmed! Check your email for the invitation.
          </p>
        </div>

        {/* Optional: Close Button */}
        <div className="mt-8">
          <Button onClick={onClose} className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
