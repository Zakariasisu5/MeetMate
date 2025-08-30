import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI Matchmaker Bot. I can help you find the perfect connections at conferences. What are you looking for?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): string => {
    const responses = [
      "Great! I've found 3 potential matches for you. Would you like me to schedule a coffee chat?",
      "Based on your interests, I recommend connecting with Sarah from TechCorp. She's also interested in AI and blockchain.",
      "Perfect timing! There's a networking event tomorrow at 3 PM. Should I add you to the guest list?",
      "I've analyzed your profile and found several professionals with complementary skills. Let me show you the matches.",
      "That sounds interesting! I can help you find people with similar goals. What's your main objective for this conference?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 border-b border-border/30">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg"></div>
              <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground">AI Matchmaker Bot</h3>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
            <div className="ml-auto">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/30'
                      : 'bg-gradient-to-r from-secondary/20 to-background/40 text-foreground border border-border/30'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-r from-secondary/20 to-background/40 border border-border/30 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/30 bg-background/50">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about matches..."
              className="flex-1 bg-secondary/20 border border-border/30 rounded-2xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-primary to-accent p-3 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Chatbot
