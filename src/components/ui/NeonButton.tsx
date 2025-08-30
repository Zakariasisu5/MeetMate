import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const NeonButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  className = ''
}: NeonButtonProps) => {
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]',
      border: 'border-blue-500/50'
    },
    secondary: {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-600',
      glow: 'shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]',
      border: 'border-purple-500/50'
    },
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-teal-600',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]',
      border: 'border-green-500/50'
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-500 to-pink-600',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]',
      border: 'border-red-500/50'
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const selectedVariant = variants[variant];
  const selectedSize = sizes[size];

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-semibold text-white
        ${selectedVariant.bg}
        ${selectedVariant.glow}
        ${selectedVariant.border}
        ${selectedSize}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <span className={`relative z-10 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        {children}
      </span>
    </motion.button>
  );
};

export default NeonButton;

