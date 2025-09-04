import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, XCircle } from 'lucide-react';

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
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use current user from localStorage (simulate auth)
  const currentUserId = localStorage.getItem('currentUserId') || 'me';
  const chatKey = `chat_${[currentUserId, user.id].sort().join('_')}`;

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(chatKey);
    setMessages(saved ? JSON.parse(saved) : []);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    // eslint-disable-next-line
  }, [chatKey]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    try {
      const newMsg = {
        id: Date.now(),
        text: message,
        sender: currentUserId,
        receiver: user.id,
        timestamp: new Date().toISOString(),
      };
      const updated = [...messages, newMsg];
      setMessages(updated);
      localStorage.setItem(chatKey, JSON.stringify(updated));
      setMessage('');
      setSuccess(true);
      onSendMessage && onSendMessage(message);
      setTimeout(() => setSuccess(false), 1000);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/60 via-purple-900/60 to-black/80 backdrop-blur-[6px]"
    >
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-blue-200/30 to-purple-200/30 backdrop-blur-2xl shadow-2xl border border-white/20" style={{ filter: 'blur(0px)' }}></div>
        <div className="relative z-10 bg-white/60 dark:bg-black/60 rounded-3xl p-8 flex flex-col items-center shadow-2xl backdrop-blur-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-primary">
          <XCircle className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center mb-6">
          <MessageCircle className="w-12 h-12 text-primary mb-2" />
          <h2 className="text-2xl font-bold mb-2 text-center">Message {user.name}</h2>
          <p className="text-muted-foreground text-center">Start a conversation and build your network.</p>
        </div>
        {/* Previous messages */}
        <div className="max-h-48 overflow-y-auto mb-4 bg-white/10 rounded-xl p-2">
          {messages.length === 0 && <div className="text-center text-gray-400 text-sm">No messages yet.</div>}
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-2 flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-xl text-sm max-w-xs break-words ${msg.sender === currentUserId ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {success && (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2 animate-bounce" />
            <span className="text-green-600 font-semibold text-lg">Message sent successfully!</span>
          </div>
        )}
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
        </div>
      </div>
    </motion.div>
  );
};

export default MessageModal;
