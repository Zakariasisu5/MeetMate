"use client";

import React, { useState, useRef, useEffect } from 'react';

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
  }, [messages]);

  // Frontend-only: require VITE_SENSAY_API_KEY. Do not use the backend proxy.
  const frontendSensayKey = import.meta.env.VITE_SENSAY_API_KEY as string | undefined;
  const frontendSensayUrl = (import.meta.env.VITE_SENSAY_API_URL as string) || 'https://api.sensay.io/v1';
  const replicaUuid = (import.meta.env.VITE_SENSAY_REPLICA_UUID as string) || '';
  const frontendUserId = (import.meta.env.VITE_SENSAY_USER_ID as string) || '';
  const endpoints = [`${frontendSensayUrl.replace(/\/$/, '')}/chat/completions`];

  async function postToFirstWorking(urls: string[], payload: any) {
    let lastErr: any = null;
    for (const u of urls) {
      try {
        // Always call Sensay directly from the browser.
        if (u.includes('/chat/completions')) {
          if (!frontendSensayKey) {
            throw new Error('VITE_SENSAY_API_KEY not set in frontend environment');
          }

          // If a replica UUID is provided, use replica path and send org/user headers.
          if (replicaUuid) {
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
                skip_chat_history: false,
              })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || data?.details || `HTTP ${res.status}`);
            return data;
          }

          // Default non-replica Sensay call (Bearer auth)
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
      // If we called Sensay directly the shape may be different (choices -> message.content)
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
      <div className="max-w-2xl w-full bg-white rounded shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">AIchat (Sensay)</h1>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">Powered by <strong>Sensay AI</strong></div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {messages.length === 0 && <div className="text-gray-500">Say hi to your assistant.</div>}
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded max-w-[90%] ${m.role === 'user' ? 'ml-auto bg-blue-50 text-right' : 'bg-gray-100'}`}>
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {error && <div className="mb-3 text-red-600">{error}</div>}
        {!frontendSensayKey && (
          <div className="mb-3 text-yellow-700 bg-yellow-50 p-2 rounded text-sm">
            VITE_SENSAY_API_KEY is not set. This page runs Sensay entirely in the browser. Add <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_SENSAY_API_KEY</code> to your front-end env and rebuild.
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border p-2 rounded resize-none"
            rows={3}
            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
            disabled={loading || !frontendSensayKey}
          />
          <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading || !frontendSensayKey}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          This assistant runs entirely in the browser. Add your Sensay API key to your front-end env as <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_SENSAY_API_KEY</code> and (optionally) <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_SENSAY_API_URL</code>.
        </div>
      </div>
    </div>
  );
}