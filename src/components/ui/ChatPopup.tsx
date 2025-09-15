import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

type ChatMessage = {
  id: string
  from: "me" | "them"
  text: string
  ts: number
}

type Match = {
  id: string
  name: string
  avatar: string
}

type Props = {
  match: Match
  messages: ChatMessage[]
  onSend: (text: string) => void
  onClose: () => void
}

const ChatPopup = ({ match, messages, onSend, onClose }: Props) => {
  const [text, setText] = useState("")
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    // scroll to bottom when messages change
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [textareaRef])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText("")
    // keep focus after send
    setTimeout(() => textareaRef.current?.focus(), 10)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed right-4 bottom-4 z-50 w-96 max-w-full">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
          <img src={match.avatar} alt={match.name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-white" />
          <div className="flex-1">
            <div className="font-semibold">{match.name}</div>
            <div className="text-xs opacity-80">Ready to chat</div>
          </div>
          <button onClick={onClose} className="text-sm bg-white/10 px-2 py-1 rounded-md">Close</button>
        </div>

        <div ref={containerRef} className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet — say hi 👋</div>}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`${m.from === "me" ? "bg-indigo-600 text-white rounded-bl-2xl" : "bg-white border border-gray-200 text-gray-900 rounded-br-2xl"} px-4 py-2 rounded-lg shadow-sm max-w-[78%] text-sm`}> 
                <div>{m.text}</div>
                <div className={`text-[11px] mt-1 ${m.from === "me" ? "text-indigo-100" : "text-gray-400"} text-right`}>{new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-3 bg-white border-t flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message... (Enter to send, Shift+Enter for newline)"
            className="flex-1 resize-none h-12 max-h-40 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 text-black placeholder-gray-400"
          />
          <button onClick={handleSend} className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow">Send</button>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatPopup
