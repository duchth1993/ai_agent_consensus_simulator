import React from 'react';
import { motion } from 'framer-motion';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="relative z-10 text-center py-8 px-4"
    >
      <div className="glass-dark rounded-xl p-4 md:p-6 max-w-2xl mx-auto">
        <p className="text-gray-400 text-sm md:text-base mb-3">
          PoC for Endless Monthly Contribution Program
        </p>
        
        <div className="flex items-center justify-center gap-2 text-primary font-medium mb-4">
          <span className="text-lg">#EndlessDev</span>
          <Heart className="w-4 h-4 text-red-400 animate-pulse" />
        </div>
        
        <a
          href="https://github.com/endless-labs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-deep-blue/50 hover:bg-deep-blue rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
          aria-label="View on GitHub"
        >
          <Github className="w-4 h-4" />
          View on GitHub
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;
