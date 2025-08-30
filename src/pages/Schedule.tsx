import { useState } from 'react'
import { motion } from 'framer-motion'
import AIChatbot from '../components/ui/AIChatbot'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Coffee,
  MessageCircle,
  Video,
  Phone,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Meeting {
  id: string
  title: string
  type: 'coffee' | 'video' | 'phone' | 'in-person'
  date: string
  time: string
  duration: number
  location: string
  attendees: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false)
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Coffee Chat with Anna Chen',
      type: 'coffee',
      date: '2024-01-15',
      time: '10:00',
      duration: 30,
      location: 'Conference Center Cafe',
      attendees: ['Anna Chen', 'You'],
      status: 'scheduled',
      notes: 'Discuss DeFi product design collaboration opportunities'
    },
    {
      id: '2',
      title: 'Video Call with Marcus Rodriguez',
      type: 'video',
      date: '2024-01-15',
      time: '14:00',
      duration: 45,
      location: 'Zoom',
      attendees: ['Marcus Rodriguez', 'You'],
      status: 'scheduled',
      notes: 'Deep dive into smart contract development and DeFi protocols'
    },
    {
      id: '3',
      title: 'Networking Lunch with Sarah Kim',
      type: 'in-person',
      date: '2024-01-16',
      time: '12:00',
      duration: 60,
      location: 'Downtown Restaurant',
      attendees: ['Sarah Kim', 'You'],
      status: 'scheduled',
      notes: 'Discuss Web3 marketing strategies and community building'
    }
  ])

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    type: 'coffee' as Meeting['type'],
    date: '',
    time: '',
    duration: 30,
    location: '',
    attendees: [''],
    notes: ''
  })

  const meetingTypes = [
    { id: 'coffee', label: 'Coffee Chat', icon: Coffee, color: 'text-orange-600' },
    { id: 'video', label: 'Video Call', icon: Video, color: 'text-blue-600' },
    { id: 'phone', label: 'Phone Call', icon: Phone, color: 'text-green-600' },
    { id: 'in-person', label: 'In-Person', icon: Users, color: 'text-purple-600' },
  ]

  const getCurrentMonthDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    // Add previous month's days to fill first week
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i)
      days.unshift({ date: prevDate, isCurrentMonth: false })
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    // Add next month's days to fill last week
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }

    return days
  }

  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return meetings.filter(meeting => meeting.date === dateStr)
  }

  const addMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast.error('Please fill in all required fields')
      return
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      type: newMeeting.type,
      date: newMeeting.date,
      time: newMeeting.time,
      duration: newMeeting.duration,
      location: newMeeting.location,
      attendees: newMeeting.attendees.filter(a => a.trim()),
      status: 'scheduled',
      notes: newMeeting.notes
    }

    setMeetings([...meetings, meeting])
    setShowNewMeetingModal(false)
    setNewMeeting({
      title: '',
      type: 'coffee',
      date: '',
      time: '',
      duration: 30,
      location: '',
      attendees: [''],
      notes: ''
    })
    toast.success('Meeting scheduled successfully!')
  }

  const cancelMeeting = (meetingId: string) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, status: 'cancelled' as const }
        : meeting
    ))
    toast.success('Meeting cancelled')
  }

  const completeMeeting = (meetingId: string) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, status: 'completed' as const }
        : meeting
    ))
    toast.success('Meeting marked as completed')
  }

  const getMeetingTypeIcon = (type: Meeting['type']) => {
    const meetingType = meetingTypes.find(t => t.id === type)
    if (!meetingType) return null
    const Icon = meetingType.icon
    return <Icon className={`h-4 w-4 ${meetingType.color}`} />
  }

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Meeting Schedule
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Schedule and manage your conference meetings
          </p>
        </div>
        
        <button
          onClick={() => setShowNewMeetingModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Meeting</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="card space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                  className="p-2 rounded-2xl hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="text-sm text-primary hover:underline"
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                  className="p-2 rounded-2xl hover:bg-accent"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {getCurrentMonthDays().map((dayData, index) => {
                const meetingsForDay = getMeetingsForDate(dayData.date)
                const isToday = dayData.date.toDateString() === new Date().toDateString()
                const isSelected = dayData.date.toDateString() === selectedDate.toDateString()
                
                return (
                  <div
                    key={index}
                    className={`p-2 min-h-[80px] border rounded-2xl cursor-pointer transition-colors ${
                      isToday ? 'bg-primary/10 border-primary' : ''
                    } ${
                      isSelected ? 'bg-accent border-accent-foreground' : ''
                    } ${
                      !dayData.isCurrentMonth ? 'text-muted-foreground/50' : ''
                    }`}
                    onClick={() => setSelectedDate(dayData.date)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {dayData.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {meetingsForDay.slice(0, 2).map(meeting => (
                        <div
                          key={meeting.id}
                          className="text-xs p-1 rounded-lg bg-primary/20 text-primary truncate"
                          title={meeting.title}
                        >
                          {getMeetingTypeIcon(meeting.type)}
                          <span className="ml-1">{meeting.time}</span>
                        </div>
                      ))}
                      {meetingsForDay.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{meetingsForDay.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
          
          <div className="space-y-3">
            {meetings
              .filter(meeting => meeting.status === 'scheduled')
              .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
              .slice(0, 5)
              .map(meeting => (
                <div key={meeting.id} className="card p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getMeetingTypeIcon(meeting.type)}
                      <div>
                        <h3 className="font-medium text-foreground text-sm">
                          {meeting.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {meeting.date} at {meeting.time}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{meeting.duration} min</span>
                    <MapPin className="h-3 w-3" />
                    <span>{meeting.location}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => completeMeeting(meeting.id)}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-lg hover:bg-green-200"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => cancelMeeting(meeting.id)}
                      className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-lg hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* AI Scheduling Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20"
      >
        <div className="flex items-start space-x-3">
          <Sparkles className="h-6 w-6 text-primary mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">AI Scheduling Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              Based on your profile and match preferences, we recommend scheduling coffee chats during these time slots:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setNewMeeting(prev => ({ ...prev, time }))
                    setShowNewMeetingModal(true)
                  }}
                  className="btn-secondary text-sm"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowNewMeetingModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-primary/30 via-accent/20 to-background rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-primary/20 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Schedule New Meeting</h3>
              <button
                onClick={() => setShowNewMeetingModal(false)}
                className="p-2 rounded-2xl hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Meeting Title</label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="input mt-1"
                  placeholder="Coffee chat with..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Meeting Type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {meetingTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewMeeting({ ...newMeeting, type: type.id as Meeting['type'] })}
                      className={`p-3 rounded-2xl border text-sm font-medium transition-colors ${
                        newMeeting.type === type.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Time</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="input mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                <select
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                  className="input mt-1"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Location</label>
                <input
                  type="text"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  className="input mt-1"
                  placeholder="Conference center, cafe, etc."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Notes</label>
                <textarea
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  className="input mt-1 min-h-[80px] resize-none"
                  placeholder="Meeting agenda or notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowNewMeetingModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={addMeeting}
                className="btn-primary flex-1"
              >
                Schedule Meeting
              </button>
            </div>
          </motion.div>
        </motion.div>
        
      )}
      <AIChatbot/>
    </div>
  )
}

export default Schedule
