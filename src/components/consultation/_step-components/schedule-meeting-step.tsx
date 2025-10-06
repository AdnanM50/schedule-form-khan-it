"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { FormData } from "../consultation-booking"
import { ChevronLeft, ChevronRight, Clock, Video, Globe, AlertCircle } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDay,
} from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScheduleMeetingStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onConfirm: () => void
  onBack: () => void
}

export function ScheduleMeetingStep({ formData, updateFormData, onConfirm, onBack }: ScheduleMeetingStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9)) // October 2025
  const [timezone, setTimezone] = useState("Asia/Dhaka")
  const [timeFormat, setTimeFormat] = useState("12h")

  const timeSlots12h = ["12:00am", "12:30am", "8:00pm", "8:30pm", "10:00pm", "10:30pm", "11:00pm"]
  const timeSlots24h = ["00:00", "00:30", "20:00", "20:30", "22:00", "22:30", "23:00"]
  const timeSlots = timeFormat === "12h" ? timeSlots12h : timeSlots24h

  const handleDateSelect = (date: Date) => {
    updateFormData({ selectedDate: date })
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

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = getDay(monthStart)

  const calendarDays = Array(startDayOfWeek).fill(null).concat(daysInMonth)

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* Left Sidebar - Meeting Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-semibold text-gray-700">👤</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Md Faruk Khan</p>
            </div>
          </div>

          {/* Meeting Title */}
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">SEO Strategy Call</h3>
            <p className="text-xs lg:text-sm text-gray-600 mt-2 leading-relaxed">
              Book your strategy call today to explore how SEO and AI-driven search optimization can accelerate your
              business growth.
            </p>
          </div>

          {/* Meeting Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>30min</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Video className="w-4 h-4 text-gray-500" />
              <span>Google Meet</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-gray-500" />
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-8 border-0 p-0 text-sm text-gray-700 hover:text-gray-900 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                  <SelectItem value="America/New_York">America/New York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2.5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-800 font-medium">Requires confirmation</p>
          </div>
        </div>

        {/* Right Side - Calendar and Time Slots */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
          <div className="grid md:grid-cols-[1fr_200px] gap-4 lg:gap-6">
            {/* Calendar */}
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="w-full">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />
                    }

                    const isSelected = formData.selectedDate && isSameDay(day, formData.selectedDate)
                    const isCurrentMonth = isSameMonth(day, currentMonth)

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        disabled={!isCurrentMonth}
                        className={cn(
                          "aspect-square flex items-center justify-center text-sm rounded-md transition-colors",
                          "hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                          isSelected && "bg-[#FF8C42] text-white hover:bg-[#FF8C42] font-semibold",
                          !isSelected && isCurrentMonth && "text-gray-900",
                          !isSelected && !isCurrentMonth && "text-gray-400",
                        )}
                      >
                        {format(day, "d")}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="md:border-l md:border-gray-200 md:pl-4 lg:pl-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-900">
                  {formData.selectedDate ? format(formData.selectedDate, "EEEE, MMM d") : "Select a date"}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded-md",
                      timeFormat === "12h" ? "bg-[#FF8C42] text-white" : "bg-white border border-gray-200 hover:bg-gray-50",
                    )}
                    onClick={() => setTimeFormat("12h")}
                  >
                    12h
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded-md",
                      timeFormat === "24h" ? "bg-[#FF8C42] text-white" : "bg-white border border-gray-200 hover:bg-gray-50",
                    )}
                    onClick={() => setTimeFormat("24h")}
                  >
                    24h
                  </Button>
                </div>
              </div>
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeSelect(time)}
                    disabled={!formData.selectedDate}
                    className={cn(
                      "w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors text-left",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      formData.selectedTime === time
                        ? "bg-[#FF8C42] text-white"
                        : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-900",
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="sm:w-auto px-6 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          className="flex-1 sm:flex-none sm:min-w-[180px] bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white font-medium"
          disabled={!formData.selectedDate || !formData.selectedTime}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  )
}
