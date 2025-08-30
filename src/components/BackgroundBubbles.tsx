import React from 'react'
import { motion } from 'framer-motion'

const BackgroundBubbles = () => {
  const bubbles = [
    { id: 1, size: 200, x: '10%', y: '20%', delay: 0, duration: 20 },
    { id: 2, size: 150, x: '80%', y: '10%', delay: 2, duration: 25 },
    { id: 3, size: 300, x: '20%', y: '80%', delay: 4, duration: 30 },
    { id: 4, size: 180, x: '70%', y: '70%', delay: 6, duration: 22 },
    { id: 5, size: 250, x: '90%', y: '50%', delay: 8, duration: 28 },
    { id: 6, size: 120, x: '5%', y: '60%', delay: 10, duration: 18 },
    { id: 7, size: 220, x: '50%', y: '15%', delay: 12, duration: 24 },
    { id: 8, size: 160, x: '15%', y: '40%', delay: 14, duration: 26 },
    { id: 9, size: 280, x: '85%', y: '30%', delay: 16, duration: 32 },
    { id: 10, size: 140, x: '40%', y: '90%', delay: 18, duration: 20 },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main gradient bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full opacity-20"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(147, 51, 234, 0.1) 100%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Rotating rings */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute border-2 border-primary/10 rounded-full"
          style={{
            width: 100 + i * 80,
            height: 100 + i * 80,
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Wave effects */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full h-32 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          style={{
            top: `${40 + i * 20}%`,
            transform: 'rotate(-15deg)',
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 12 + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glowing orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-4 h-4 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full"
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
            filter: 'blur(2px)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + i,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default BackgroundBubbles
