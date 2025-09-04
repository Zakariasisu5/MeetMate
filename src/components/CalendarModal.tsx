import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle, XCircle } from 'lucide-react';
import ApiService from '../services/api';

interface CalendarModalProps {
  user: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onSchedule: (date: string) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ user, onClose, onSchedule }) => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [meetings, setMeetings] = useState<any[]>([]);

  // Simulate current user
  const currentUserId = localStorage.getItem('currentUserId') || 'me';
  const meetingKey = `meetings_${[currentUserId, user.id].sort().join('_')}`;

  // Load meetings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(meetingKey);
    setMeetings(saved ? JSON.parse(saved) : []);
  }, [meetingKey, success]);

  const handleSchedule = () => {
    if (!date) return;
    setLoading(true);
    setError('');
    try {
      const newMeeting = {
        id: Date.now(),
        title: `Meeting with ${user.name}`,
        date,
        with: user.name,
        userId: user.id,
      };
      const updated = [...meetings, newMeeting];
      setMeetings(updated);
      localStorage.setItem(meetingKey, JSON.stringify(updated));
      setSuccess(true);
      onSchedule && onSchedule(date);
      // Update dashboard meetings count
      const statsKey = `stats-${currentUserId}`;
      const stats = JSON.parse(localStorage.getItem(statsKey) || '{}');
      stats.meetings = (stats.meetings || 0) + 1;
      localStorage.setItem(statsKey, JSON.stringify(stats));
    } catch (err) {
      setError('Failed to schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/60 via-purple-900/60 to-black/80 backdrop-blur-[6px]"
    >
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-blue-200/30 to-purple-200/30 backdrop-blur-2xl shadow-2xl border border-white/20" style={{ filter: 'blur(0px)' }}></div>
        <div className="relative z-10 bg-white/60 dark:bg-black/60 rounded-3xl p-8 flex flex-col items-center shadow-2xl backdrop-blur-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-primary">
          <XCircle className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center mb-6">
          <CalendarCheck className="w-12 h-12 text-primary mb-2" />
          <h2 className="text-2xl font-bold mb-2 text-center">Schedule with {user.name}</h2>
          <p className="text-muted-foreground text-center">Pick a date and time to schedule your meeting.</p>
        </div>
        {success ? (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2 animate-bounce" />
            <span className="text-green-600 font-semibold text-lg">Meeting scheduled!</span>
            <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl bg-primary text-white font-semibold shadow-lg">Close</button>
          </div>
        ) : (
          <>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            <input
              type="datetime-local"
              className="w-full p-2 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={date}
              onChange={e => setDate(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end space-x-3 mt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold">Cancel</button>
              <button onClick={handleSchedule} disabled={loading || !date} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary/80 transition-all duration-200 disabled:opacity-50">
                {loading ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
            {/* Upcoming meetings */}
            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Upcoming Meetings</h3>
              {meetings.length === 0 && <div className="text-gray-400 text-sm">No meetings scheduled.</div>}
              <ul className="space-y-2">
                {meetings.map((m) => (
                  <li key={m.id} className="bg-white/70 dark:bg-black/30 rounded-xl px-4 py-2 flex flex-col">
                    <span className="font-medium">{m.title}</span>
                    <span className="text-xs text-gray-500">{new Date(m.date).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarModal;
