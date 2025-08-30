import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, TrendingUp, Calendar, Medal } from 'lucide-react'

const FloatingCTA = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-gradient-to-br from-background/95 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full hover:bg-secondary/30 transition-colors duration-200"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-2xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center space-x-3 group"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Find My Match</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-secondary/20 to-background/40 border border-border/30 text-foreground py-3 px-4 rounded-2xl font-medium hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Meeting</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 text-accent py-3 px-4 rounded-2xl font-medium hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Medal className="w-4 h-4" />
                <span>View Badges</span>
              </motion.button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground text-center">
                Need help? Chat with our AI assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 group"
      >
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Inner content */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-ping opacity-20" />
      </motion.button>
    </div>
  )
}

export default FloatingCTA
