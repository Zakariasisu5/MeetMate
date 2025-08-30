import React, { useState } from 'react';
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

  const handleSchedule = async () => {
    if (!date) return;
    setLoading(true);
    setError('');
    try {
      // Refined: create event with userId
      await ApiService.createEvent({
        title: `Meeting with ${user.name}`,
        description: `Scheduled via MeetMate for user ${user.id}`,
        date,
        location: 'Conference',
      });
      setSuccess(true);
      onSchedule && onSchedule(date);
    } catch (err: any) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
  <div className="bg-gradient-to-br from-primary/30 via-accent/20 to-background rounded-3xl shadow-2xl p-8 w-full max-w-md border border-primary/20 relative">
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
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <span className="text-green-600 font-semibold">Meeting scheduled!</span>
            <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl bg-primary text-white font-semibold">Close</button>
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
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarModal;
