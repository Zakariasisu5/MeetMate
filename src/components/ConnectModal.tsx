import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import ApiService from '../services/api';

interface ConnectModalProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    company?: string;
  };
  onClose: () => void;
  onSendRequest: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ user, onClose, onSendRequest }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    try {
      // Refined: send RSVP as a connection request
      await ApiService.createRSVP({ eventId: user.id, status: 'going' });
      setSuccess(true);
      onSendRequest && onSendRequest();
    } catch (err: any) {
      setError('Failed to send request. Please try again.');
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
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-primary" />
          ) : (
            <UserPlus className="w-12 h-12 text-primary mb-2" />
          )}
          <h2 className="text-2xl font-bold mb-2 text-center">Connect with {user.name}</h2>
          {user.role && <div className="text-primary font-semibold mb-1">{user.role}</div>}
          {user.company && <div className="text-muted-foreground mb-2">{user.company}</div>}
          <p className="text-muted-foreground text-center">Send a connection request to start networking.</p>
        </div>
        {!success && (
          <textarea
            className="w-full h-20 p-2 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            disabled={loading}
          />
        )}
        {success ? (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2 animate-bounce" />
            <span className="text-green-600 font-semibold text-lg">Request sent successfully!</span>
            <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl bg-primary text-white font-semibold shadow-lg">Close</button>
          </div>
        ) : (
          <>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold">Cancel</button>
              <button onClick={handleSendRequest} disabled={loading} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary/80 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectModal;
