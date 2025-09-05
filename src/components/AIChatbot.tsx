import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import faqs from '../meetmateFaq.json';

type Faq = {
  question: string;
  answer: string;
};

function findBestFaqMatch(question: string): Faq | null {
  // Simple keyword match, can be improved with fuzzy search
  const lowerQ = question.toLowerCase();
  let best: Faq | null = null;
  let bestScore = 0;
  (faqs as Faq[]).forEach(faq => {
    const score = faq.question.toLowerCase().split(' ').filter(word => lowerQ.includes(word)).length;
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  });
  return bestScore > 0 ? best : null;
}

const unrelatedKeywords = [
  'weather', 'stock', 'movie', 'news', 'recipe', 'game', 'sports', 'music', 'travel', 'politics', 'health', 'finance', 'shopping', 'food', 'car', 'joke', 'random'
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: '👋 Hi, I’m your MeetMate Assistant. Ask me anything about MeetMate!',
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { text: input, isUser: true }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      let response = '';
      const lowerInput = input.toLowerCase();
      if (unrelatedKeywords.some(word => lowerInput.includes(word))) {
        response = 'I can only answer questions about MeetMate.';
      } else {
        const match = findBestFaqMatch(input);
        if (match) {
          response = match.answer;
        } else {
          response = 'I don’t have that information yet, but the MeetMate team will add it soon.';
        }
      }
      setMessages(msgs => [...msgs, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating button to toggle chat */}
      <button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[520px] bg-gradient-to-br from-blue-700/80 via-purple-800/80 to-indigo-900/80 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl flex flex-col md:w-96 md:h-[520px] md:right-6 md:bottom-24 sm:w-[95vw] sm:h-[60vh] sm:right-2 sm:bottom-2 sm:rounded-2xl sm:border sm:border-white/30 sm:z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-blue-600/60 to-purple-700/60 rounded-t-3xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-wide">MeetMate Assistant</h3>
                <p className="text-xs text-white/70">Online</p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
          </div>
          {/* Powered by Sensay */}
          <div className="px-4 py-1 bg-white/10 text-xs text-white/70 text-right font-medium border-b border-white/10">
            🤖 Powered by Sensay AI
          </div>
          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[350px] custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl shadow-md transition-all ${msg.isUser ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-white/20 text-white/90 backdrop-blur-md border border-white/10'}`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line break-words">{msg.text}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs text-white/70">MeetMate Assistant is typing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="p-4 border-t border-white/20 bg-gradient-to-t from-indigo-900/30 to-transparent rounded-b-3xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40 shadow-inner"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center disabled:opacity-50 shadow-lg"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
