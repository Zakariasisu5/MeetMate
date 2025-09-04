import React, { useState, useEffect } from 'react'
import ConnectModal from './ConnectModal';
import CalendarModal from './CalendarModal';
import MessageModal from './MessageModal';
import { motion } from 'framer-motion'
import { MapPin, Briefcase, MessageCircle, Calendar, ExternalLink } from 'lucide-react'

interface ProfileCardProps {
  profile: {
    id: string
    name: string
    title: string
    company: string
    location: string
    avatar: string
    skills: string[]
    matchScore: number
    status: 'online' | 'offline' | 'busy'
    isVerified: boolean
  }
  connectStatus?: 'default' | 'pending' | 'connected';
  onConnect?: () => void
  onSchedule?: () => void
  onMessage?: () => void
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, connectStatus = 'default', onConnect, onSchedule, onMessage }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  // Modal state
  const [showConnect, setShowConnect] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  // Handlers
  const handleConnect = () => {
    if (connectStatus !== 'pending' && connectStatus !== 'connected' && onConnect) {
      onConnect();
    }
  };
  const handleSchedule = () => { if (onSchedule) onSchedule(); };
  const handleMessage = () => { if (onMessage) onMessage(); };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'busy': return 'bg-yellow-400'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Available for chat'
      case 'busy': return 'In a meeting'
      case 'offline': return 'Last seen 2h ago'
      default: return 'Unknown'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-gradient-to-br from-background/80 to-secondary/20 backdrop-blur-xl border border-border/30 rounded-3xl p-6 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header with avatar and status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar with status ring */}
            <div className="relative">
              <div className={`absolute inset-0 ${getStatusColor(profile.status)} rounded-full blur-sm`} />
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-background">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${profile.name}&background=3B82F6&color=fff&size=64`
                  }}
                />
              </div>
              {/* Status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(profile.status)} rounded-full border-2 border-background`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-foreground">{profile.name}</h3>
                {profile.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{profile.title}</p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Briefcase className="w-3 h-3" />
                <span>{profile.company}</span>
              </div>
            </div>
          </div>
          
          {/* Match score */}
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-foreground">{profile.matchScore}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Match</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{profile.location}</span>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">Skills & Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 4).map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full text-xs text-primary font-medium"
              >
                {skill}
              </motion.span>
            ))}
            {profile.skills.length > 4 && (
              <span className="px-3 py-1 bg-secondary/20 border border-border/30 rounded-full text-xs text-muted-foreground">
                +{profile.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3 mt-4">
          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={connectStatus === 'pending' || connectStatus === 'connected'}
            className={`flex-1 rounded-lg py-3 px-4 font-medium transition-all duration-300
              ${connectStatus === 'connected'
                ? 'bg-green-500 text-white'
                : connectStatus === 'pending'
                  ? 'bg-yellow-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:from-primary/80'}
            `}
          >
            {connectStatus === 'connected'
              ? 'Connected'
              : connectStatus === 'pending'
                ? 'Pending'
                : 'Connect'}
          </button>
          {/* Schedule Button */}
          <button
            onClick={handleSchedule}
            className="flex-1 rounded-lg py-3 px-4 font-medium bg-gradient-to-r from-secondary/20 to-background/40 border border-border/30 text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
          >
            Schedule
          </button>
          {/* Message Button */}
          <button
            onClick={handleMessage}
            className="flex-1 rounded-lg py-3 px-4 font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
          >
            Message
          </button>
        </div>
        {/* Modals */}
        {showConnect && (
          <ConnectModal
            user={profile}
            onClose={() => setShowConnect(false)}
            onSendRequest={handleConnect}
          />
        )}
        {showSchedule && (
          <CalendarModal
            user={profile}
            onClose={() => setShowSchedule(false)}
            onSchedule={() => setShowSchedule(false)}
          />
        )}
        {showMessage && (
          <MessageModal
            user={profile}
            onClose={() => setShowMessage(false)}
            onSendMessage={() => {}}
          />
        )}
      </div>

      {/* Hover tooltip for status */}
      <div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="bg-background/90 backdrop-blur-xl border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground whitespace-nowrap">
          {getStatusText(profile.status)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/90" />
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileCard
