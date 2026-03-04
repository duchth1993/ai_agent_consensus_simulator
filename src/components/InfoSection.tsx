import React from 'react';
import { motion } from 'framer-motion';
import { Info, Shield, Cpu, Network } from 'lucide-react';

const InfoSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-6 h-6 text-primary flex-shrink-0" />
        <h3 className="text-lg font-semibold">About This Simulation</h3>
      </div>
      
      <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
        This PoC demonstrates how AI agents can enhance consensus in Endless's decentralized 
        cloud infrastructure. Privacy is preserved through end-to-end encryption (E2EE) and 
        decentralized relay networks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-dark rounded-xl p-4">
          <Cpu className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-medium mb-2">AI Agents</h4>
          <p className="text-xs text-gray-400">
            Autonomous agents participate in Byzantine fault-tolerant consensus voting
          </p>
        </div>
        
        <div className="glass-dark rounded-xl p-4">
          <Shield className="w-8 h-8 text-neon-purple mb-3" />
          <h4 className="font-medium mb-2">Privacy First</h4>
          <p className="text-xs text-gray-400">
            All votes protected by DID, E2EE, and decentralized relay infrastructure
          </p>
        </div>
        
        <div className="glass-dark rounded-xl p-4">
          <Network className="w-8 h-8 text-neon-blue mb-3" />
          <h4 className="font-medium mb-2">BFT Consensus</h4>
          <p className="text-xs text-gray-400">
            Tolerates up to 33% faulty nodes while maintaining network integrity
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoSection;
