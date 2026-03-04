import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Network, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 text-center py-8 md:py-12 px-4"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Network className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-10 h-10 md:w-12 md:h-12 text-neon-purple" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-neon-blue" />
        </motion.div>
      </div>
      
      <motion.h1
        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 neon-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-primary via-neon-purple to-neon-blue bg-clip-text text-transparent">
          AI Agent Consensus Simulator
        </span>
      </motion.h1>
      
      <motion.p
        className="text-lg md:text-xl text-gray-300 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Endless PoC
      </motion.p>
      
      <motion.p
        className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Simulate AI agents voting in decentralized consensus mechanisms
      </motion.p>
    </motion.header>
  );
};

export default Header;
