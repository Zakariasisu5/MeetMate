"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; text: string };

export default function AIChatAssistantFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: '👋 Hi, I’m your MeetMate Assistant. Ask me anything about MeetMate!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  // Frontend-only Sensay config
  const frontendSensayKey = import.meta.env.VITE_SENSAY_API_KEY as string | undefined;
  const frontendSensayUrl = (import.meta.env.VITE_SENSAY_API_URL as string) || 'https://api.sensay.io/v1';
  const replicaUuid = (import.meta.env.VITE_SENSAY_REPLICA_UUID as string) || '';
  const frontendUserId = (import.meta.env.VITE_SENSAY_USER_ID as string) || '';

  const endpoints = [`${frontendSensayUrl.replace(/\/$/, '')}/chat/completions`];

  async function postToFirstWorking(urls: string[], payload: any) {
    let lastErr: any = null;
    for (const u of urls) {
      try {
        if (u.includes('/chat/completions')) {
          if (replicaUuid) {
            if (!frontendSensayKey) throw new Error('VITE_SENSAY_API_KEY not set in frontend environment');
            const replicaUrl = `${frontendSensayUrl.replace(/\/$/, '')}/replicas/${encodeURIComponent(replicaUuid)}/chat/completions`;
            const headers: Record<string,string> = {
              'Content-Type': 'application/json',
              'X-ORGANIZATION-SECRET': frontendSensayKey,
            };
            if (frontendUserId) headers['X-USER-ID'] = frontendUserId;
            const res = await fetch(replicaUrl, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                content: payload.message ?? payload.query,
                source: 'web',
                skip_chat_history: false
              })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || data?.details || `HTTP ${res.status}`);
            return data;
          }

          if (!frontendSensayKey) {
            throw new Error('VITE_SENSAY_API_KEY not set in frontend environment');
          }
          const res = await fetch(u, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${frontendSensayKey}`,
            },
            body: JSON.stringify({
              model: 'sensay-llama-3',
              messages: [
                { role: 'system', content: 'You are MeetMate AI. Answer any question about the MeetMate platform, its features, usage, and troubleshooting.' },
                { role: 'user', content: payload.message ?? payload.query }
              ]
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || data?.details || `HTTP ${res.status}`);
          return data;
        }

        const res = await fetch(u, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || data?.details || `HTTP ${res.status}`);
        return data;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  }

  const send = async () => {
    if (!input.trim()) return;
    setError(null);
    const userMsg: Message = { role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await postToFirstWorking(endpoints, { message: userMsg.text });
      const assistantText =
        data?.answer ||
        data?.content ||
        data?.reply ||
        data?.choices?.[0]?.message?.content ||
        JSON.stringify(data);
      const assistant: Message = { role: 'assistant', text: assistantText };
      setMessages((m) => [...m, assistant]);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) send();
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open MeetMate Assistant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>

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
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl shadow-md transition-all ${m.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-white/20 text-white/90 backdrop-blur-md border border-white/10'}`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line break-words">{m.text}</div>
                </div>
              </div>
            ))}

            {loading && (
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

            <div ref={endRef} />
          </div>
          {/* Input */}
          <div className="p-4 border-t border-white/20 bg-gradient-to-t from-indigo-900/30 to-transparent rounded-b-3xl">
            {error && <div className="mb-3 text-red-400">{error}</div>}
            {!frontendSensayKey && (
              <div className="mb-3 text-yellow-200 bg-yellow-800/20 p-2 rounded text-sm">
                VITE_SENSAY_API_KEY is not set. The assistant will not work until you add this key to your front-end env.
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask me anything about MeetMate (profiles, events, matches)..."
                className="flex-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40 shadow-inner"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
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
