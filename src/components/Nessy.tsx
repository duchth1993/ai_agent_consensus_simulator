import React from 'react';
import { motion } from 'framer-motion';

interface NessyProps {
  mood: 'happy' | 'sad' | 'neutral';
  showCheckmark?: boolean;
}

const Nessy: React.FC<NessyProps> = ({ mood, showCheckmark = false }) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0, scale: 0.5 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="relative"
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Body */}
        <motion.ellipse
          cx="60"
          cy="70"
          rx="35"
          ry="30"
          fill="url(#bodyGradient)"
          animate={{ 
            ry: mood === 'happy' ? [30, 32, 30] : [30, 28, 30],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Head */}
        <motion.circle
          cx="60"
          cy="40"
          r="25"
          fill="url(#headGradient)"
          animate={{ 
            cy: mood === 'happy' ? [40, 38, 40] : [40, 42, 40],
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        
        {/* Eyes */}
        <motion.ellipse
          cx="50"
          cy="38"
          rx="5"
          ry={mood === 'happy' ? 3 : 5}
          fill="white"
        />
        <motion.ellipse
          cx="70"
          cy="38"
          rx="5"
          ry={mood === 'happy' ? 3 : 5}
          fill="white"
        />
        
        {/* Pupils */}
        <motion.circle
          cx="50"
          cy="38"
          r="2"
          fill="#1E1B4B"
          animate={{ cx: [50, 51, 50] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="70"
          cy="38"
          r="2"
          fill="#1E1B4B"
          animate={{ cx: [70, 71, 70] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Mouth */}
        {mood === 'happy' ? (
          <motion.path
            d="M50 50 Q60 58 70 50"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        ) : mood === 'sad' ? (
          <motion.path
            d="M50 55 Q60 48 70 55"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <motion.line
            x1="50"
            y1="52"
            x2="70"
            y2="52"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        
        {/* Fins */}
        <motion.path
          d="M25 60 Q15 50 20 40 Q25 50 25 60"
          fill="url(#finGradient)"
          animate={{ rotate: mood === 'happy' ? [0, 10, 0] : [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ transformOrigin: '25px 60px' }}
        />
        <motion.path
          d="M95 60 Q105 50 100 40 Q95 50 95 60"
          fill="url(#finGradient)"
          animate={{ rotate: mood === 'happy' ? [0, -10, 0] : [0, 5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ transformOrigin: '95px 60px' }}
        />
        
        {/* Tail */}
        <motion.path
          d="M60 100 Q50 110 40 105 Q55 100 60 100 Q65 100 80 105 Q70 110 60 100"
          fill="url(#tailGradient)"
          animate={{ 
            d: mood === 'happy' 
              ? ["M60 100 Q50 110 40 105 Q55 100 60 100 Q65 100 80 105 Q70 110 60 100",
                 "M60 100 Q50 115 35 108 Q55 100 60 100 Q65 100 85 108 Q70 115 60 100",
                 "M60 100 Q50 110 40 105 Q55 100 60 100 Q65 100 80 105 Q70 110 60 100"]
              : undefined
          }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
        
        {/* Sparkles for happy mood */}
        {mood === 'happy' && (
          <>
            <motion.circle
              cx="90"
              cy="25"
              r="3"
              fill="#FFD700"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="30"
              cy="20"
              r="2"
              fill="#FFD700"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="85"
              cy="45"
              r="2"
              fill="#FFD700"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}
        
        {/* Tear for sad mood */}
        {mood === 'sad' && (
          <motion.ellipse
            cx="52"
            cy="48"
            rx="2"
            ry="4"
            fill="#3B82F6"
            initial={{ cy: 45, opacity: 0 }}
            animate={{ cy: [45, 55, 45], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        <defs>
          <linearGradient id="bodyGradient" x1="25" y1="40" x2="95" y2="100">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="headGradient" x1="35" y1="15" x2="85" y2="65">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="tailGradient" x1="40" y1="100" x2="80" y2="115">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Checkmark badge */}
      {showCheckmark && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Nessy;
