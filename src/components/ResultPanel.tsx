import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Shield, Lock, Radio } from 'lucide-react';
import { SimulationState } from '../types';
import Nessy from './Nessy';

interface ResultPanelProps {
  simulationState: SimulationState;
  totalAgents: number;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ simulationState, totalAgents }) => {
  if (simulationState.phase !== 'complete' || !simulationState.result) {
    return null;
  }

  const getResultConfig = () => {
    switch (simulationState.result) {
      case 'success':
        return {
          title: 'CONSENSUS REACHED',
          color: 'text-green-400',
          bgColor: 'from-green-500/20 to-emerald-500/10',
          borderColor: 'border-green-500/30',
          icon: CheckCircle,
          nessyMood: 'happy' as const,
        };
      case 'failure':
        return {
          title: 'CONSENSUS FAILED',
          color: 'text-red-400',
          bgColor: 'from-red-500/20 to-rose-500/10',
          borderColor: 'border-red-500/30',
          icon: XCircle,
          nessyMood: 'sad' as const,
        };
      case 'partial':
        return {
          title: 'PARTIAL AGREEMENT',
          color: 'text-yellow-400',
          bgColor: 'from-yellow-500/20 to-amber-500/10',
          borderColor: 'border-yellow-500/30',
          icon: AlertCircle,
          nessyMood: 'neutral' as const,
        };
      default:
        return {
          title: 'UNKNOWN',
          color: 'text-gray-400',
          bgColor: 'from-gray-500/20 to-gray-500/10',
          borderColor: 'border-gray-500/30',
          icon: AlertCircle,
          nessyMood: 'neutral' as const,
        };
    }
  };

  const config = getResultConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`glass rounded-2xl p-6 md:p-8 border ${config.borderColor} relative overflow-hidden`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgColor} pointer-events-none`} />
        
        {/* Success particles */}
        {simulationState.result === 'success' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, #8B5CF6, #3B82F6)`,
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Shake animation for failure */}
        <motion.div
          animate={simulationState.result === 'failure' ? { x: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              {/* Result title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center md:justify-start gap-3 mb-4"
              >
                <Icon className={`w-8 h-8 md:w-10 md:h-10 ${config.color}`} />
                <h2 className={`text-2xl md:text-4xl font-bold ${config.color}`}>
                  {config.title}
                </h2>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              >
                <div className="glass-dark rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{simulationState.yesVotes}</div>
                  <div className="text-xs text-gray-400">Yes Votes</div>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{simulationState.noVotes}</div>
                  <div className="text-xs text-gray-400">No Votes</div>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{simulationState.abstainVotes}</div>
                  <div className="text-xs text-gray-400">Abstained</div>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-primary">{simulationState.totalSteps}</div>
                  <div className="text-xs text-gray-400">Time Steps</div>
                </div>
              </motion.div>

              {/* Consensus percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Agreement Rate</span>
                  <span className={`font-bold ${config.color}`}>
                    {simulationState.consensusPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-deep-blue rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      simulationState.result === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : simulationState.result === 'failure'
                        ? 'bg-gradient-to-r from-red-500 to-rose-400'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${simulationState.consensusPercentage}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </motion.div>

              {/* Privacy notice */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-dark rounded-xl p-4 flex items-start gap-3"
              >
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300 font-medium mb-1">Privacy Protected</p>
                  <p className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" /> DID
                    </span>
                    <span>+</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" /> E2EE
                    </span>
                    <span>+</span>
                    <span className="flex items-center gap-1">
                      <Radio className="w-3 h-3" /> Decentralized Relays
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Nessy mascot */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex-shrink-0"
            >
              <Nessy 
                mood={config.nessyMood} 
                showCheckmark={simulationState.result === 'success'} 
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultPanel;
