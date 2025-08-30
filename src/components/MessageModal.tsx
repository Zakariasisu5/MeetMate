import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import ApiService from '../services/api';

interface MessageModalProps {
  user: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ user, onClose, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Refined: send message with userId and message
      await ApiService.chatWithAI({ prompt: message, context: user.id });
      setSuccess(true);
      onSendMessage && onSendMessage(message);
    } catch (err: any) {
      setError('Failed to send message. Please try again.');
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
          <MessageCircle className="w-12 h-12 text-primary mb-2" />
          <h2 className="text-2xl font-bold mb-2 text-center">Message {user.name}</h2>
          <p className="text-muted-foreground text-center">Start a conversation and build your network.</p>
        </div>
        {success ? (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <span className="text-green-600 font-semibold">Message sent successfully!</span>
            <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl bg-primary text-white font-semibold">Close</button>
          </div>
        ) : (
          <>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            <textarea
              className="w-full h-24 p-2 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <div className="flex justify-end space-x-3 mt-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold">Cancel</button>
              <button onClick={handleSendMessage} disabled={loading || !message.trim()} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary/80 transition-all duration-200 disabled:opacity-50">
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MessageModal;
