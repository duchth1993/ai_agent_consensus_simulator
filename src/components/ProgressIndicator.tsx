import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { SimulationState } from '../types';

interface ProgressIndicatorProps {
  simulationState: SimulationState;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ simulationState }) => {
  if (simulationState.phase === 'idle' || simulationState.phase === 'complete') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass rounded-xl p-4 md:p-6"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-gray-300 font-medium">
          {simulationState.phase === 'broadcasting' && 'Broadcasting proposal to network...'}
          {simulationState.phase === 'voting' && 'Agents are voting...'}
          {simulationState.phase === 'counting' && 'Counting votes...'}
        </span>
      </div>

      {/* Step progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Step {simulationState.currentStep} of {simulationState.totalSteps}</span>
          <span>{Math.round((simulationState.currentStep / simulationState.totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-deep-blue rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-neon-blue"
            initial={{ width: 0 }}
            animate={{ width: `${(simulationState.currentStep / simulationState.totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Consensus progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Consensus Progress</span>
          <span className={simulationState.consensusPercentage >= 66 ? 'text-green-400' : 'text-yellow-400'}>
            {simulationState.consensusPercentage.toFixed(1)}% / 66%
          </span>
        </div>
        <div className="h-3 bg-deep-blue rounded-full overflow-hidden relative">
          {/* Threshold marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10"
            style={{ left: '66%' }}
          />
          <motion.div
            className={`h-full ${
              simulationState.consensusPercentage >= 66
                ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                : 'bg-gradient-to-r from-yellow-500 to-orange-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(simulationState.consensusPercentage, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressIndicator;
