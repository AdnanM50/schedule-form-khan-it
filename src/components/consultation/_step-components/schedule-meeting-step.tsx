"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
import type { FormData } from "../consultation-booking"
import { ChevronLeft, ChevronRight, Clock, Video, Globe } from "lucide-react"
import { format, addMonths, subMonths } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface ScheduleMeetingStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onConfirm: () => void
  onBack: () => void
}

const timeSlots = ["12:30am", "8:00pm", "8:30pm", "10:00pm", "10:30pm", "11:00pm"]

export function ScheduleMeetingStep({ formData, updateFormData, onConfirm, onBack }: ScheduleMeetingStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9)) // October 2025

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateFormData({ selectedDate: date })
    }
  }

  const handleTimeSelect = (time: string) => {
    updateFormData({ selectedTime: time })
  }

  const handleConfirm = () => {
    if (!formData.selectedDate || !formData.selectedTime) {
      alert("Please select both a date and time")
      return
    }
    onConfirm()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Left Sidebar - Meeting Details */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-semibold">MK</span>
            </div>
            <div>
              <p className="text-sm font-medium">Md Faruk Khan</p>
            </div>
          </div>

          {/* Meeting Title */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">SEO Strategy Call</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Book your strategy call today to explore how SEO and AI-driven search optimization can accelerate your
              business growth.
            </p>
          </div>

          {/* Meeting Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>30min</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Video className="w-4 h-4 text-muted-foreground" />
              <span>Google Meet</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>Asia/Dhaka</span>
            </div>
          </div>

          {/* Requires confirmation */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">⚠️ Requires confirmation</p>
          </div>
        </div>

        {/* Right Side - Calendar and Time Slots */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <div className="grid md:grid-cols-[1fr_200px] gap-6">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={formData.selectedDate || undefined}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border-0"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center hidden",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-12 w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_range_end: "day-range-end",
                  day_selected:
                    "bg-[#FF8C42] text-white hover:bg-[#FF8C42] hover:text-white focus:bg-[#FF8C42] focus:text-white rounded-md",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>

            {/* Time Slots */}
            <div className="border-l border-border pl-6">
              <div className="mb-4">
                <p className="text-sm font-semibold mb-1">
                  {formData.selectedDate ? format(formData.selectedDate, "EEEE, MMM d") : "Select a date"}
                </p>
                <p className="text-xs text-muted-foreground">Jan</p>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeSelect(time)}
                    className={cn(
                      "w-full px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      formData.selectedTime === time
                        ? "bg-[#FF8C42] text-white"
                        : "bg-white border border-border hover:bg-muted",
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onBack} className="px-6 bg-transparent">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white"
              disabled={!formData.selectedDate || !formData.selectedTime}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
