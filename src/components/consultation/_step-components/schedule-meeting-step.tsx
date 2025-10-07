"use client"

import { useState, useEffect } from "react"
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
  isBefore,
  startOfDay,
} from "date-fns"
import { cn } from "@/lib/utils"
import { getAvailableTimes, createCalcomBooking, sendContactEmail, formatFormDataToMessage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ScheduleMeetingStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onConfirm: () => void
  onBack: () => void
  isSubmitting?: boolean
  submitError?: string | null
}

export function ScheduleMeetingStep({ formData, updateFormData, onConfirm, onBack, isSubmitting = false, submitError }: ScheduleMeetingStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date()) // Current month
  const [timeFormat, setTimeFormat] = useState("12h")
  const [slotsData, setSlotsData] = useState<Record<string, Array<{ start: string; end: string }>> | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false)
  const { toast } = useToast()
  
  // Fixed meeting duration and timezone
  const selectedDuration = "30"
  const timezone = "Asia/Dhaka"

  // Helper function to format time from API response
  const formatSlotTime = (iso: string) => {
    try {
      const date = new Date(iso)
      const opts: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: timeFormat === "12h",
        timeZone: timezone,
      }
      return new Intl.DateTimeFormat("en-US", opts).format(date)
    } catch (e) {
      return iso
    }
  }

  // Helper function to format date key (yyyy-MM-dd)
  const formatDateKey = (d: Date) => {
    try {
      return format(d, "yyyy-MM-dd")
    } catch (e) {
      return ""
    }
  }

  // Fetch available slots from API
  const fetchAvailableSlots = async (startDate: Date, endDate: Date) => {
    setLoadingSlots(true)
    setSlotsError(null)
    
    try {
      console.log('🔄 Fetching available slots from API...')
      
      const params = {
        eventTypeSlug: `${selectedDuration}min`,
        startDate: formatDateKey(startDate),
        endDate: formatDateKey(endDate),
        timezone: timezone
      }
      
      console.log('📅 API Params:', params)
      const data = await getAvailableTimes(params)
      console.log('✅ API Success:', data)
      setSlotsData(data.slots.data)
    } catch (error) {
      console.error('❌ API Failed:', error)
      setSlotsError('Failed to load available time slots.')
      setSlotsData(null)
    } finally {
      setLoadingSlots(false)
    }
  }

  // Fetch slots for current month on component mount
  useEffect(() => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    fetchAvailableSlots(startOfMonth, endOfMonth)
  }, [currentMonth])

  const handleDateSelect = (date: Date) => {
    updateFormData({ selectedDate: date })
    // Fetch slots for the selected date (same day as start and end)
    fetchAvailableSlots(date, date)
  }

  const handleTimeSelect = (time: string) => {
    updateFormData({ selectedTime: time })
  }

  const handleConfirm = async () => {
    if (!formData.selectedDate || !formData.selectedTime) {
      toast({
        title: "Selection Required",
        description: "Please select both a date and time",
        variant: "destructive",
      })
      return
    }

    setIsBookingSubmitting(true)

    try {
      // Extract start time from selected time (format: "09:00 AM - 09:30 AM")
      const timeParts = formData.selectedTime.split(' - ')
      const startTimeStr = timeParts[0]
      
      // Convert to ISO format for the API
      const selectedDateStr = format(formData.selectedDate, 'yyyy-MM-dd')
      const startTimeISO = `${selectedDateStr}T${startTimeStr.includes('AM') || startTimeStr.includes('PM') 
        ? convertTo24Hour(startTimeStr) 
        : startTimeStr}:00.000+06:00`

      // API 1: Create Cal.com booking
      const bookingData = {
        name: formData.fullName,
        email: formData.email,
        timeZone: timezone,
        startTime: startTimeISO,
        eventTypeId: 3583077 // Fixed event type ID for 30min meeting
      }

      console.log('🔄 Submitting booking data:', bookingData)
      await createCalcomBooking(bookingData)

      // API 2: Send contact email
      const message = formatFormDataToMessage(formData)
      const emailData = {
        email: formData.email,
        name: formData.fullName,
        message: message
      }

      console.log('🔄 Sending contact email:', emailData)
      await sendContactEmail(emailData)

      // Both APIs successful, proceed with confirmation
      onConfirm()
      
    } catch (error) {
      console.error('❌ Booking submission failed:', error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : 'Failed to book your consultation. Please try again.',
        variant: "destructive",
      })
    } finally {
      setIsBookingSubmitting(false)
    }
  }

  // Helper function to convert 12h to 24h format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    
    if (hours === '12') {
      hours = '00'
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString()
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = getDay(monthStart)
  const calendarDays = Array(startDayOfWeek).fill(null).concat(daysInMonth)

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-200 ">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_230px]">
          {/* --- Left Column: Profile + Meeting Details --- */}
          <div className="border-r-0 lg:border-r border-gray-200 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
            {/* Profile */}
            <div className="flex items-center gap-3">
              <img
                src="/ceo.png"
                alt="profile"
                className="w-10 h-10 rounded-full object-cover  border-gray-300"
              />
              <p className="text-sm font-medium text-gray-900">Md Faruk Khan</p>
            </div>

            {/* Meeting Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedDuration} Min Meeting
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Book your strategy call today to explore how SEO and AI-driven search optimization can accelerate your
                business growth.
              </p>
            </div>

            {/* Meeting Details */}
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock className="w-[35px] h-[35px] text-[#F47E20] border rounded-[8px] p-[8px] border-gray-300 " />
                <span className="text-[#0C1115]">30 Min Meeting (30 min)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Video className="w-[35px] h-[35px] text-[#F47E20] border rounded-[8px] p-[8px] border-gray-300 " />
                <span className="text-[#0C1115]">Google Meet</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-[35px] h-[35px] text-[#F47E20] border rounded-[8px] p-[8px] border-gray-300 " />
                <span className="text-[#0C1115]">Asia/Dhaka</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-[#FDE68A] rounded-full p-2.5 flex items-center gap-2 mt-auto">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-yellow-800 font-medium">Requires confirmation</p>
            </div>
          </div>

          {/* --- Middle Column: Calendar --- */}
          <div className="p-4 sm:p-6 border-r-0 lg:border-r border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{format(currentMonth, "MMMM yyyy")}</h3>
               <div className="flex gap-1">
                 <Button
                   variant="ghost"
                   size="icon"
                   className="h-8 w-8"
                   onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                   disabled={isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(new Date()))}
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

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-gray-500 py-1 sm:py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square min-h-[32px] sm:min-h-[40px]" />
                }

                const isSelected = formData.selectedDate && isSameDay(day, formData.selectedDate)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isPastDate = isBefore(day, startOfDay(new Date()))
                const dateKey = formatDateKey(day)
                const hasSlots = slotsData && slotsData[dateKey] && slotsData[dateKey].length > 0

                return (
                   <button
                     key={day.toISOString()}
                     type="button"
                     onClick={() => handleDateSelect(day)}
                     disabled={!isCurrentMonth || isPastDate}
                     className={cn(
                       "aspect-square min-h-[32px] sm:min-h-[40px] flex items-center justify-center text-xs sm:text-sm rounded-md transition-colors",
                       "hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                       isSelected && "bg-[#FF8C42] text-white font-semibold",
                       !isSelected && isCurrentMonth && !isPastDate && "text-gray-900",
                       !isSelected && !isCurrentMonth && "text-gray-400",
                       isPastDate && "text-gray-300",
                       hasSlots && !isSelected && isCurrentMonth && !isPastDate && "border border-green-300 bg-green-50",
                     )}
                   >
                     {format(day, "d")}
                   </button>
                )
              })}
            </div>
          </div>

          {/* --- Right Column: Time Slots --- */}
          <div className="p-4 sm:p-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              {formData.selectedDate ? format(formData.selectedDate, "EEEE, MMM d") : "Select a date"}
            </p>
            <div className="flex gap-2 mb-4 ">
              <div className="flex items-center bg-[#EDF1FD] rounded-[8px] p-1">
                <button
                  type="button"
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-[6px] transition-colors",
                    timeFormat === "12h" ? "bg-[#0A1F44] text-white" : "text-gray-700"
                  )}
                  onClick={() => setTimeFormat("12h")}
                >
                  12h
                </button>
                <button
                  type="button"
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-[6px] transition-colors",
                    timeFormat === "24h" ? "bg-[#0A1F44] text-white" : "text-gray-700"
                  )}
                  onClick={() => setTimeFormat("24h")}
                >
                  24h
                </button>
              </div>
            </div>

             <div className="space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto">
               {!formData.selectedDate && (
                 <div className="text-sm text-gray-500 p-2">Please select a date first</div>
               )}
               {loadingSlots && (
                 <div className="text-sm text-gray-500 p-2">Loading available time slots...</div>
               )}
               {slotsError && (
                 <div className="text-sm text-red-500 p-2">
                   <div>{slotsError}</div>
                   <button 
                     onClick={() => formData.selectedDate && fetchAvailableSlots(formData.selectedDate, formData.selectedDate)}
                     className="mt-2 px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"
                   >
                     Retry
                   </button>
                 </div>
               )}
               {formData.selectedDate && !loadingSlots && !slotsError && slotsData && (() => {
                 const selectedDateKey = formatDateKey(formData.selectedDate)
                 const availableSlots = slotsData[selectedDateKey] || []
                 
                 if (availableSlots.length === 0) {
                   return <div className="text-sm text-gray-500 p-2">No available slots for this date.</div>
                 }
                 
                 return availableSlots.map((slot) => {
                   const timeLabel = `${formatSlotTime(slot.start)} - ${formatSlotTime(slot.end)}`
                   return (
                     <button
                       key={slot.start}
                       type="button"
                       onClick={() => handleTimeSelect(timeLabel)}
                       className={cn(
                         "w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors text-left",
                         formData.selectedTime === timeLabel
                           ? "bg-[#FF8C42] text-white"
                           : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-900",
                       )}
                     >
                       {timeLabel}
                     </button>
                   )
                 })
               })()}
             </div>
          </div>
        </div>
        
      </div>
      
      {/* Error Message */}
      {submitError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-4 sm:px-6 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent text-sm sm:text-base"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="px-4 sm:px-6 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white font-medium text-sm sm:text-base"
            disabled={!formData.selectedDate || !formData.selectedTime || isBookingSubmitting}
          >
            {isBookingSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
    </>
  )
}
