import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 48 48" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main logo elements */}
      <g filter="url(#glow)">
        {/* Chat bubble base */}
        <path 
          d="M8 12C8 8.68629 10.6863 6 14 6H28C31.3137 6 34 8.68629 34 12V28C34 31.3137 31.3137 34 28 34H20L14 40L16 34H14C10.6863 34 8 31.3137 8 28V12Z" 
          fill="url(#logoGradient)"
          stroke="#1E40AF"
          strokeWidth="1.5"
        />
        
        {/* Heart symbol */}
        <path 
          d="M24 18C22.5 18 21.5 19 21.5 20.5C21.5 22 22.5 23 24 23C25.5 23 26.5 22 26.5 20.5C26.5 19 25.5 18 24 18Z" 
          fill="white"
        />
        <path 
          d="M24 20C23.5 20 23 20.5 23 21C23 21.5 23.5 22 24 22C24.5 22 25 21.5 25 21C25 20.5 24.5 20 24 20Z" 
          fill="white"
        />
        
        {/* AI/Network dots */}
        <circle cx="16" cy="16" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="32" cy="16" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="24" cy="28" r="1.5" fill="white" opacity="0.8"/>
        
        {/* Connection lines */}
        <path 
          d="M17.5 16L30.5 16" 
          stroke="white" 
          strokeWidth="1" 
          opacity="0.6"
          strokeLinecap="round"
        />
        <path 
          d="M24 17.5L24 26.5" 
          stroke="white" 
          strokeWidth="1" 
          opacity="0.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export default Logo

