"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; text: string };

export default function SensayPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: '👋 Hi, I’m your MeetMate Assistant. Ask me anything about MeetMate!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);
  // Frontend-only: require VITE_SENSAY_API_KEY. Do not use backend proxy.
  const frontendSensayKey = import.meta.env.VITE_SENSAY_API_KEY as string | undefined;
  const frontendSensayUrl = (import.meta.env.VITE_SENSAY_API_URL as string) || 'https://api.sensay.io/v1';
  const replicaUuid = (import.meta.env.VITE_SENSAY_REPLICA_UUID as string) || '';
  const frontendUserId = (import.meta.env.VITE_SENSAY_USER_ID as string) || '';
  if (!frontendSensayKey) {
    console.warn('VITE_SENSAY_API_KEY not set - Sensay frontend will not work');
  }
  const endpoints = [`${frontendSensayUrl.replace(/\/$/, '')}/chat/completions`];

  async function postToFirstWorking(urls: string[], payload: any) {
    let lastErr: any = null;
    for (const u of urls) {
      try {
        // frontend-only: call Sensay chat/completions directly
        if (u.includes('/chat/completions')) {
          // If a replica UUID is provided, call the replica endpoint using org headers
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

        // Fallback generic POST (kept for completeness)
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
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full bg-gradient-to-br from-blue-700/80 via-purple-800/80 to-indigo-900/80 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-blue-600/60 to-purple-700/60">
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

        {/* Messages area */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {messages.length === 0 && <div className="text-white/80">Say hi to your assistant.</div>}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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

        {/* Error / missing key */}
        <div className="p-4 border-t border-white/20 bg-gradient-to-t from-indigo-900/30 to-transparent">
          {error && <div className="mb-3 text-red-400">{error}</div>}
          {!frontendSensayKey && (
            <div className="mb-3 text-yellow-200 bg-yellow-800/20 p-2 rounded text-sm">
              VITE_SENSAY_API_KEY is not set. The assistant will not work until you add this key to your front-end env.
            </div>
          )}

          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40 shadow-inner resize-none"
              rows={3}
              placeholder="Ask me anything about MeetMate (profiles, events, matches)..."
              disabled={loading}
            />
            <button onClick={send} disabled={loading || !input.trim()} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center disabled:opacity-50 shadow-lg">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="mt-3 text-xs text-white/70">
            This assistant runs entirely in the browser. Add your Sensay API key to your front-end env as <code className="bg-white/10 px-1 py-0.5 rounded">VITE_SENSAY_API_KEY</code> and (optionally) <code className="bg-white/10 px-1 py-0.5 rounded">VITE_SENSAY_API_URL</code>.
          </div>
        </div>
      </div>
    </div>
  );
}