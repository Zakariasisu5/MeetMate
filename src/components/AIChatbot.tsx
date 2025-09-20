import { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import faqs from '../meetmateFaq.json';

type Faq = {
  question: string;
  answer: string;
};

type Message = {
  text: string;
  isUser: boolean;
  source?: 'SensayAPI' | 'synthesized' | 'fallback' | 'system' | 'meetmate-faq';
};

const unrelatedKeywords = [
  'weather', 'stock', 'movie', 'news', 'recipe', 'game', 'sports', 'music', 'travel', 'politics', 'health', 'finance', 'shopping', 'food', 'car', 'joke', 'random'
];

function tokenize(s: string) {
  return s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean)
}

function levenshtein(a: string, b: string) {
  const al = a.length, bl = b.length
  const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0))
  for (let i = 0; i <= al; i++) dp[i][0] = i
  for (let j = 0; j <= bl; j++) dp[0][j] = j
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[al][bl]
}

function scoreMatch(query: string, text: string) {
  const qTokens = tokenize(query)
  const tTokens = tokenize(text)
  const common = qTokens.filter(t => tTokens.includes(t)).length
  const commonScore = common / Math.max(1, tTokens.length)
  // normalized levenshtein on whole string
  const lev = levenshtein(query.toLowerCase(), text.toLowerCase())
  const levScore = 1 - lev / Math.max(query.length, text.length, 1)
  // combine
  return Math.max(0, 0.6 * commonScore + 0.4 * levScore)
}

function findBestFaqMatches(question: string, top = 5): { faq: Faq; score: number }[] {
  const arr = (faqs as Faq[]).map(f => ({ faq: f, score: scoreMatch(question, f.question) }))
  arr.sort((a, b) => b.score - a.score)
  return arr.slice(0, top)
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: '👋 Hi, I’m your MeetMate Assistant. Ask me anything about MeetMate!', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Prefer scrolling the container to bottom so the latest response is visible above the input.
    const c = messagesContainerRef.current;
    if (c) {
      try {
        c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
        return;
      } catch (e) {
        // fallback
      }
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  useEffect(() => {
    // autofocus input when chat opens
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  const topFaqs = useMemo(() => faqs as Faq[], [])

  const SUPPORT_EMAIL = 'support@meetmate.ai'

  const generateReply = (text: string) => {
    const trimmed = text.trim()
    const lowerInput = trimmed.toLowerCase()

    const GREETINGS = ['hi', 'hello', 'hey', 'hiya', 'good morning', 'good afternoon', 'good evening']
    if (GREETINGS.some(g => lowerInput === g || lowerInput.startsWith(g + ' ') || lowerInput.startsWith(g + '!') || lowerInput.startsWith(g + ','))) {
      // Deterministic friendly greeting (no randomness) so responses feel consistent.
      const reply = `Hi there! 👋 I'm your MeetMate Assistant — how can I help you with MeetMate today?`
      // Suggest real FAQ topics so suggestions link to accurate answers
      const greetSuggestions = topFaqs.slice(0, 3).map(f => f.question)
      return { reply, source: 'synthesized' as const, suggestions: greetSuggestions }
    }
    if (unrelatedKeywords.some(word => lowerInput.includes(word))) {
      const fallbackSuggestions = topFaqs.slice(0, 3).map(f => f.question)
      return {
        reply: `I can only help with MeetMate-related questions. If you need help outside of MeetMate (like weather or news), try a web search. For MeetMate help, try one of the topics below.`,
        source: 'fallback' as const,
        suggestions: fallbackSuggestions
      }
    }

    const matches = findBestFaqMatches(text, 6)
    const best = matches[0]
    const second = matches[1]

    // high confidence: return the FAQ answer verbatim for accuracy
    if (best && best.score >= 0.6) {
      return { reply: best.faq.answer, source: 'meetmate-faq' as const, suggestions: matches.slice(0,3).map(m => m.faq.question) }
    }

    // moderate confidence: synthesize
    if (best && best.score >= 0.35) {
      const synthesized = `I found some relevant information that may help:\n\n• ${best.faq.question}: ${best.faq.answer}${second && second.score > 0 ? `\n\n• ${second.faq.question}: ${second.faq.answer}` : ''}\n\nIf this doesn't fully answer your question, feel free to rephrase or email ${SUPPORT_EMAIL}.`
      return { reply: synthesized, source: 'synthesized' as const, suggestions: matches.slice(0,3).map(m => m.faq.question) }
    }

    // low confidence: provide topics and a polite escalation path
    const topics = matches.slice(0,3).filter(m => m.score > 0).map(m => m.faq.question)
    if (topics.length > 0) {
      const reply = `I don't have a precise answer, but these topics might help:\n\n- ${topics.join('\n- ')}\n\nTry one of the topics above, rephrase your question, or email ${SUPPORT_EMAIL} for direct help.`
      return { reply, source: 'fallback' as const, suggestions: topics }
    }

    // No matches at all: polite fallback with support email and suggested areas
    return {
      reply: `I'm sorry — I don't have that information right now. You can ask about events, matches, or profile setup. If you need direct help, email ${SUPPORT_EMAIL} and our team will assist you promptly.`,
      source: 'fallback' as const,
      suggestions: topFaqs.slice(0,3).map(f=>f.question)
    }
  }

  const handleSend = (fromSuggestion?: string) => {
    const text = fromSuggestion ?? input.trim()
    if (!text) return;
    setMessages(msgs => [...msgs, { text, isUser: true }]);
    setInput('');
    setIsTyping(true);

    // Compute reply
    const { reply, source, suggestions: sug } = generateReply(text)

    // Simulate typing delay based on reply length
    const delay = Math.min(2000 + reply.length * 10, 4500)
    setTimeout(() => {
      setMessages(msgs => [...msgs, { text: reply, isUser: false, source }])
      setSuggestions(sug)
      setIsTyping(false)
    }, delay)
  }

  const handleSuggestionClick = (s: string) => {
    // send suggestion directly
    setMessages(msgs => [...msgs, { text: s, isUser: true }])
    setIsTyping(true)
    const { reply, source, suggestions: sug } = generateReply(s)
    const delay = Math.min(1500 + reply.length * 8, 4000)
    setTimeout(() => {
      setMessages(msgs => [...msgs, { text: reply, isUser: false, source }])
      setSuggestions(sug)
      setIsTyping(false)
    }, delay)
  }

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
          {/* Messages (flexible area so input stays docked at the bottom) */}
            <div ref={messagesContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar min-h-0 pb-28">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl shadow-md transition-all ${msg.isUser ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-white/20 text-white/90 backdrop-blur-md border border-white/10'}`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line break-words">{msg.text}</div>
                  {/* source display removed to keep responses clean */}
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
                  <span className="text-xs text-white/70">MeetMate Assistant is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Suggestion chips */}
          {suggestions.length > 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSuggestionClick(s)} className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20">{s}</button>
              ))}
            </div>
          )}
          {/* Input */}
          <div className="p-4 border-t border-white/20 bg-gradient-to-t from-indigo-900/30 to-transparent rounded-b-3xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                ref={inputRef}
                placeholder="Ask me anything about MeetMate (profiles, events, matches)..."
                className="flex-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40 shadow-inner"
              />
              <button
                onClick={() => handleSend()}
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
