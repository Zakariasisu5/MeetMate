import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, Star, MessageCircle, Calendar } from 'lucide-react';
import GlassCard from './GlassCard';
import { AnimatePresence } from 'framer-motion';

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    company: string;
    location: string;
    bio: string;
    interests: string[];
    rating: number;
    isOnline: boolean;
    lastActive: string;
  };
  connectStatus?: 'default' | 'pending' | 'connected';
  onConnect?: () => void;
  onMessage?: () => void;
  onSchedule?: () => void;
}

const ProfileCard = ({ user, connectStatus = 'default', onConnect, onMessage, onSchedule }: ProfileCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const getStatusText = (isOnline: boolean, lastActive: string) => {
    return isOnline ? 'Online' : `Last active ${lastActive}`;
  };

  return (
    <GlassCard className="relative group">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          <div className={`w-3 h-3 ${getStatusColor(user.isOnline)} rounded-full animate-pulse`} />
          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
        </div>
      </div>

      {/* Avatar Section */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {/* Avatar Ring */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 p-1 mx-auto">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white/60" />
              )}
            </div>
          </div>
          
          {/* Status Ring */}
          <div className="absolute -bottom-1 -right-1">
            <div className={`w-6 h-6 ${getStatusColor(user.isOnline)} rounded-full border-2 border-white`} />
          </div>
        </div>

        {/* Name and Role */}
        <h3 className="text-xl font-bold text-white mt-4">{user.name}</h3>
        <p className="text-white/60 text-sm">{user.role}</p>
        
        {/* Company and Location */}
        <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-white/60">
          <div className="flex items-center space-x-1">
            <Briefcase className="w-4 h-4" />
            <span>{user.company}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center space-x-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < user.rating ? 'text-yellow-400 fill-current' : 'text-white/20'}`} 
            />
          ))}
          <span className="text-sm text-white/60 ml-2">({user.rating}/5)</span>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <p className="text-white/80 text-sm leading-relaxed">{user.bio}</p>
      </div>

      {/* Interests */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Interests</h4>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest, index) => (
            <motion.span
              key={index}
              className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              {interest}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.button
          onClick={onConnect}
          disabled={connectStatus === 'pending' || connectStatus === 'connected'}
          className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-300
            ${connectStatus === 'connected'
              ? 'bg-green-500 text-white cursor-default'
              : connectStatus === 'pending'
                ? 'bg-yellow-400 text-white cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'}
          `}
          whileHover={connectStatus === 'default' ? { scale: 1.02 } : {}}
          whileTap={connectStatus === 'default' ? { scale: 0.98 } : {}}
        >
          {connectStatus === 'connected'
            ? 'Connected'
            : connectStatus === 'pending'
              ? 'Pending...'
              : 'Connect'}
        </motion.button>
        
        <motion.button
          onClick={onMessage}
          className="w-12 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.button
          onClick={onSchedule}
          className="w-12 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-30"
          >
            Send Message
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export default ProfileCard;

