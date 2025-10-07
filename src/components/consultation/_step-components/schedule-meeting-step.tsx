"use client"

import { useState, useEffect, useMemo } from "react"
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
  isSubmitting?: boolean
  submitError?: string | null
}

export function ScheduleMeetingStep({ formData, updateFormData, onConfirm, onBack, isSubmitting = false, submitError }: ScheduleMeetingStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9)) // October 2025
  const [timezone, setTimezone] = useState("Asia/Dhaka")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [slotsData, setSlotsData] = useState<Record<string, Array<{ start: string; end: string }>> | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [slotsInfo, setSlotsInfo] = useState<string | null>(null)

  // Optional fallback sample slots (useful if API is unreachable locally)
  const FALLBACK_SLOTS: Record<string, Array<{ start: string; end: string }>> = {
    "2025-10-10": [
      { start: "2025-10-10T09:00:00.000+06:00", end: "2025-10-10T09:30:00.000+06:00" },
      { start: "2025-10-10T09:30:00.000+06:00", end: "2025-10-10T10:00:00.000+06:00" },
      { start: "2025-10-10T10:00:00.000+06:00", end: "2025-10-10T10:30:00.000+06:00" },
    ],
    "2025-10-11": [
      { start: "2025-10-11T09:00:00.000+06:00", end: "2025-10-11T09:30:00.000+06:00" },
      { start: "2025-10-11T09:30:00.000+06:00", end: "2025-10-11T10:00:00.000+06:00" },
      { start: "2025-10-11T10:00:00.000+06:00", end: "2025-10-11T10:30:00.000+06:00" },
      { start: "2025-10-11T10:30:00.000+06:00", end: "2025-10-11T11:00:00.000+06:00" },
      { start: "2025-10-11T11:00:00.000+06:00", end: "2025-10-11T11:30:00.000+06:00" },
      { start: "2025-10-11T11:30:00.000+06:00", end: "2025-10-11T12:00:00.000+06:00" },
      { start: "2025-10-11T12:00:00.000+06:00", end: "2025-10-11T12:30:00.000+06:00" },
      { start: "2025-10-11T12:30:00.000+06:00", end: "2025-10-11T13:00:00.000+06:00" },
      { start: "2025-10-11T13:00:00.000+06:00", end: "2025-10-11T13:30:00.000+06:00" },
      { start: "2025-10-11T13:30:00.000+06:00", end: "2025-10-11T14:00:00.000+06:00" },
      { start: "2025-10-11T14:00:00.000+06:00", end: "2025-10-11T14:30:00.000+06:00" },
      { start: "2025-10-11T14:30:00.000+06:00", end: "2025-10-11T15:00:00.000+06:00" },
      { start: "2025-10-11T15:00:00.000+06:00", end: "2025-10-11T15:30:00.000+06:00" },
      { start: "2025-10-11T15:30:00.000+06:00", end: "2025-10-11T16:00:00.000+06:00" },
      { start: "2025-10-11T16:00:00.000+06:00", end: "2025-10-11T16:30:00.000+06:00" },
      { start: "2025-10-11T16:30:00.000+06:00", end: "2025-10-11T17:00:00.000+06:00" },
    ],
  }

  // helper: format ISO time string into user's selected timezone and format
  const formatSlotTime = (iso: string) => {
    try {
      const date = new Date(iso)
      const opts: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: timeFormat === "12h",
        timeZone: timezone,
      }
      // use en-US to ensure AM/PM when hour12 true
      return new Intl.DateTimeFormat("en-US", opts).format(date)
    } catch (e) {
      return iso
    }
  }

  // helper: produce the date key used by API data (yyyy-MM-dd)
  const formatDateKey = (d: Date) => {
    try {
      return format(d, "yyyy-MM-dd")
    } catch (e) {
      return ""
    }
  }

  // keep a small fallback in case API is not available
  const timeSlots12h = ["09:00 AM", "09:30 AM", "10:00 AM"]
  const timeSlots24h = ["09:00", "09:30", "10:00"]

  // Fetch function refactored so we can call it on Retry
  const fetchSlotsOnce = async (retries = 1) => {
    setLoadingSlots(true)
    setSlotsError(null)
    setSlotsInfo(null)
    try {
      const res = await fetch("https://contact-form.up.railway.app/api/getAvailableTimes")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const data = json?.slots?.data || {}
      setSlotsData(data)
      setSlotsError(null)
    } catch (err) {
      console.error("Failed to fetch slots", err)
      if (retries > 0) {
        setTimeout(() => void fetchSlotsOnce(retries - 1), 800)
        return
      }
      // final failure: load sample slots so UI still works and inform the user
      setSlotsData(FALLBACK_SLOTS)
      setSlotsInfo("Using sample slots because the API could not be reached.")
      setSlotsError(null)
    } finally {
      setLoadingSlots(false)
    }
  }

  // fetch available slots once on mount (server returns several days)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!cancelled) await fetchSlotsOnce(1)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // prepare a Set of available date keys to quickly check calendar days
  const availableDateKeys = useMemo(() => {
    if (!slotsData) return new Set<string>()
    return new Set(Object.keys(slotsData))
  }, [slotsData])

  // helper to check if a calendar day has slots
  const dayHasSlots = (d: Date) => availableDateKeys.has(formatDateKey(d))

  // derive slots for the selected date (key format: yyyy-MM-dd)
  const selectedDateKey = formData.selectedDate ? formatDateKey(formData.selectedDate) : null
  const availableForDate: Array<{ start: string; end: string }> = selectedDateKey && slotsData ? (slotsData[selectedDateKey] || []) : []

  // prepare display items: label (start - end) and unique key (start_iso)
  const displaySlots: Array<{ key: string; label: string }> = availableForDate.length
    ? availableForDate.map((s) => ({ key: s.start, label: `${formatSlotTime(s.start)} - ${formatSlotTime(s.end)}` }))
    : []

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
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_230px]">
          {/* --- Left Column: Profile + Meeting Details --- */}
          <div className="border-r border-gray-200 p-6 flex flex-col gap-5">
            {/* Profile */}
            <div className="flex items-center gap-3">
              <img
                src="/avatar.png"
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <p className="text-sm font-medium text-gray-900">Md Faruk Khan</p>
            </div>

            {/* Meeting Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SEO Strategy Call</h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Book your strategy call today to explore how SEO and AI-driven search optimization can accelerate your
                business growth.
              </p>
            </div>

            {/* Meeting Details */}
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                
                <Clock className="w-[35px] h-[35px] text-[#F47E20] border rounded-[8px] p-[8px] border-gray-300 " />
                <span className="text-[#0C1115]">30m</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Video className="w-[35px] h-[35px] text-[#F47E20] border rounded-[8px] p-[8px] border-gray-300 " />
                <span className="text-[#0C1115]">Google Meet</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-[35px] h-[35px] text-[#F47E20] border rounded-[8px] p-[8px] border-gray-300 " />
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="h-8 border-0 p-0 text-sm text-[#0C1115] shadow-none hover:text-gray-900 focus:ring-0">
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

            <div className="bg-yellow-50 border border-[#FDE68A] rounded-full p-2.5 flex items-center gap-2 mt-auto">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-yellow-800 font-medium">Requires confirmation</p>
            </div>
          </div>

          {/* --- Middle Column: Calendar --- */}
          <div className="p-6 border-r border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{format(currentMonth, "MMMM yyyy")}</h3>
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

            {/* Days header */}
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
                    // only disable if calendar month day and slotsData loaded and day has no slots
                    disabled={!isCurrentMonth || (slotsData ? !dayHasSlots(day) : false)}
                    className={cn(
                      "aspect-square flex items-center justify-center text-sm rounded-md transition-colors",
                      "hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                      isSelected && "bg-[#FF8C42] text-white font-semibold",
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

          {/* --- Right Column: Time Slots --- */}
          <div className="p-6">
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

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {loadingSlots && <div className="text-sm text-gray-500 p-2">Loading available times...</div>}
              {!loadingSlots && slotsError && (
                <div className="text-sm text-red-500 p-2">
                  <div>{slotsError}</div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => void fetchSlotsOnce(1)}>
                      Retry
                    </Button>
                    <Button size="sm" onClick={() => { setSlotsData(FALLBACK_SLOTS); setSlotsError(null) }}>
                      Load sample slots
                    </Button>
                  </div>
                </div>
              )}
              {!loadingSlots && !slotsError && formData.selectedDate && displaySlots.length === 0 && (
                <div className="text-sm text-gray-500 p-2">No available slots for this date.</div>
              )}
              {!loadingSlots && !slotsError && displaySlots.length > 0 &&
                displaySlots.map((slot) => (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() => handleTimeSelect(slot.label)}
                    disabled={!formData.selectedDate}
                    className={cn(
                      "w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors text-left",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      formData.selectedTime === slot.label
                        ? "bg-[#FF8C42] text-white"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-900",
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
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
      
      <div className="flex justify-end gap-3 pt-6 border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="px-6 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white font-medium"
            disabled={!formData.selectedDate || !formData.selectedTime || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </Button>
        </div>
    </>
  )
}
