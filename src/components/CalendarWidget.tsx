import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react'

interface TimeSlot {
  id: string
  time: string
  duration: number
  available: boolean
  suggested: boolean
}

interface MeetingSuggestion {
  id: string
  title: string
  attendees: string[]
  location: string
  time: string
  duration: number
}

const CalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00', duration: 30, available: true, suggested: true },
    { id: '2', time: '10:00', duration: 60, available: true, suggested: false },
    { id: '3', time: '11:00', duration: 30, available: false, suggested: false },
    { id: '4', time: '13:00', duration: 60, available: true, suggested: true },
    { id: '5', time: '14:00', duration: 30, available: true, suggested: false },
    { id: '6', time: '15:00', duration: 60, available: true, suggested: true },
    { id: '7', time: '16:00', duration: 30, available: true, suggested: false },
  ]

  const meetingSuggestions: MeetingSuggestion[] = [
    {
      id: '1',
      title: 'Coffee Chat with Sarah',
      attendees: ['Sarah Chen', 'You'],
      location: 'Conference Center Cafe',
      time: '13:00',
      duration: 30
    },
    {
      id: '2',
      title: 'Tech Discussion',
      attendees: ['Mike Johnson', 'Alex Kim', 'You'],
      location: 'Main Hall',
      time: '15:00',
      duration: 60
    }
  ]

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getDayNumber = (date: Date) => {
    return date.getDate()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Meeting Scheduler</h3>
              <p className="text-sm text-muted-foreground">Find the perfect time to connect</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-secondary/20 to-background/40 rounded-2xl p-4 border border-border/30">
              <h4 className="font-semibold text-foreground mb-4">Select Date</h4>
              
              {/* Current month view */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {Array.from({ length: 31 }, (_, i) => {
                  const date = new Date(2025, 0, i + 1)
                  const isCurrentMonth = i < 31
                  const isSelected = selectedDate.getDate() === i + 1
                  
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-8 h-8 rounded-full text-sm transition-all duration-200 ${
                        isCurrentMonth
                          ? isSelected
                            ? 'bg-gradient-to-r from-primary to-accent text-white'
                            : isToday(date)
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'text-foreground hover:bg-secondary/30'
                          : 'text-muted-foreground/30'
                      }`}
                      onClick={() => isCurrentMonth && setSelectedDate(date)}
                      disabled={!isCurrentMonth}
                    >
                      {i + 1}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Time slots */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-secondary/20 to-background/40 rounded-2xl p-4 border border-border/30">
              <h4 className="font-semibold text-foreground mb-4">Available Times</h4>
              
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <motion.button
                    key={slot.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTimeSlot(slot.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                      selectedTimeSlot === slot.id
                        ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary'
                        : slot.available
                        ? 'bg-background/40 border border-border/30 text-foreground hover:border-primary/30 hover:bg-primary/10'
                        : 'bg-secondary/20 border border-border/20 text-muted-foreground cursor-not-allowed'
                    }`}
                    disabled={!slot.available}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{slot.time}</span>
                        <span className="text-xs text-muted-foreground">({slot.duration}m)</span>
                      </div>
                      {slot.suggested && (
                        <div className="flex items-center space-x-1 text-xs text-accent">
                          <CheckCircle className="w-3 h-3" />
                          <span>Suggested</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Meeting suggestions */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-secondary/20 to-background/40 rounded-2xl p-4 border border-border/30">
              <h4 className="font-semibold text-foreground mb-4">Suggested Meetings</h4>
              
              <div className="space-y-3">
                {meetingSuggestions.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-background/40 border border-border/30 rounded-xl p-3 hover:border-primary/30 transition-all duration-300"
                  >
                    <h5 className="font-medium text-foreground mb-2">{meeting.title}</h5>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{meeting.time} ({meeting.duration}m)</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{meeting.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{meeting.attendees.join(', ')}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-3 bg-gradient-to-r from-primary to-accent text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                      Schedule Meeting
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick schedule button */}
        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary to-accent text-white py-3 px-8 rounded-2xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <Calendar className="w-5 h-5" />
            <span>Quick Schedule</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default CalendarWidget
