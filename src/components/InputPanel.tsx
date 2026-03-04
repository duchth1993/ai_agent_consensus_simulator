import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, AlertTriangle, FileText, Loader2 } from 'lucide-react';

interface InputPanelProps {
  agentCount: number;
  setAgentCount: (value: number) => void;
  faultyPercentage: number;
  setFaultyPercentage: (value: number) => void;
  proposalText: string;
  setProposalText: (value: string) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  agentCount,
  setAgentCount,
  faultyPercentage,
  setFaultyPercentage,
  proposalText,
  setProposalText,
  onRunSimulation,
  isRunning,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-6 md:p-8 neon-glow"
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        Simulation Parameters
      </h2>

      {/* Agent Count Slider */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
          <Users className="w-4 h-4 text-primary" />
          Agent Count: <span className="text-primary font-bold">{agentCount}</span>
        </label>
        <input
          type="range"
          min="5"
          max="50"
          value={agentCount}
          onChange={(e) => setAgentCount(Number(e.target.value))}
          disabled={isRunning}
          className="w-full h-2 bg-deep-blue rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Number of agents"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5</span>
          <span>50</span>
        </div>
      </div>

      {/* Faulty Percentage Slider */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Faulty Agents: <span className="text-red-400 font-bold">{faultyPercentage}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="40"
          value={faultyPercentage}
          onChange={(e) => setFaultyPercentage(Number(e.target.value))}
          disabled={isRunning}
          className="w-full h-2 bg-deep-blue rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Percentage of faulty agents"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>40%</span>
        </div>
      </div>

      {/* Proposal Text Input */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
          <FileText className="w-4 h-4 text-neon-blue" />
          Proposal
        </label>
        <textarea
          value={proposalText}
          onChange={(e) => setProposalText(e.target.value)}
          disabled={isRunning}
          placeholder="Enter your proposal..."
          className="w-full px-4 py-3 bg-deep-black/50 border border-primary/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={3}
          aria-label="Proposal text"
        />
      </div>

      {/* Run Simulation Button */}
      <motion.button
        onClick={onRunSimulation}
        disabled={isRunning}
        whileHover={{ scale: isRunning ? 1 : 1.02 }}
        whileTap={{ scale: isRunning ? 1 : 0.98 }}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
          isRunning
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-neon-blue hover:shadow-lg hover:shadow-primary/30'
        }`}
        aria-label="Run simulation"
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Simulation Running...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Run Simulation
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default InputPanel;
