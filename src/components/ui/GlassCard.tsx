import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ children, className = '', hover = true, onClick }: GlassCardProps) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/10 backdrop-blur-xl
        border border-white/20 shadow-2xl
        ${hover ? 'hover:bg-white/15 hover:border-white/30 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
      
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;

