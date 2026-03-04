import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent, Connection, SimulationState } from '../types';

interface NetworkGraphProps {
  agents: Agent[];
  connections: Connection[];
  simulationState: SimulationState;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  agents,
  connections,
  simulationState,
}) => {
  const svgSize = useMemo(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.innerWidth - 40, 600);
    }
    return 500;
  }, []);

  const getNodeColor = (agent: Agent) => {
    if (agent.isFaulty) return '#EF4444';
    if (agent.vote === 'yes') return '#10B981';
    if (agent.vote === 'no') return '#EF4444';
    if (agent.vote === 'abstain') return '#F59E0B';
    return '#8B5CF6';
  };

  const getNodeGlow = (agent: Agent) => {
    if (agent.isVoting) return '0 0 20px rgba(139, 92, 246, 0.8)';
    if (agent.vote === 'yes') return '0 0 15px rgba(16, 185, 129, 0.6)';
    if (agent.vote === 'no') return '0 0 15px rgba(239, 68, 68, 0.6)';
    return 'none';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-4 md:p-6 neon-glow relative overflow-hidden"
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
        Network Visualization
      </h2>

      {/* Phase indicator */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <motion.div
          key={simulationState.phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            simulationState.phase === 'idle'
              ? 'bg-gray-600/50 text-gray-300'
              : simulationState.phase === 'broadcasting'
              ? 'bg-blue-600/50 text-blue-300'
              : simulationState.phase === 'voting'
              ? 'bg-purple-600/50 text-purple-300'
              : simulationState.phase === 'counting'
              ? 'bg-yellow-600/50 text-yellow-300'
              : 'bg-green-600/50 text-green-300'
          }`}
        >
          {simulationState.phase.charAt(0).toUpperCase() + simulationState.phase.slice(1)}
        </motion.div>
      </div>

      <div className="flex justify-center items-center min-h-[300px] md:min-h-[400px]">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="overflow-visible"
        >
          {/* Connections */}
          <g>
            {connections.map((conn, idx) => {
              const fromAgent = agents.find((a) => a.id === conn.from);
              const toAgent = agents.find((a) => a.id === conn.to);
              if (!fromAgent || !toAgent) return null;

              return (
                <motion.line
                  key={`conn-${idx}`}
                  x1={fromAgent.x}
                  y1={fromAgent.y}
                  x2={toAgent.x}
                  y2={toAgent.y}
                  stroke={conn.isActive ? '#8B5CF6' : '#1E1B4B'}
                  strokeWidth={conn.isActive ? 2 : 1}
                  strokeOpacity={conn.isActive ? 0.8 : 0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    strokeOpacity: conn.isActive ? [0.3, 0.8, 0.3] : 0.3,
                  }}
                  transition={{
                    pathLength: { duration: 0.5 },
                    strokeOpacity: conn.isActive ? { duration: 1, repeat: Infinity } : {},
                  }}
                />
              );
            })}
          </g>

          {/* Data transmission particles */}
          <AnimatePresence>
            {simulationState.phase === 'broadcasting' &&
              connections.slice(0, 10).map((conn, idx) => {
                const fromAgent = agents.find((a) => a.id === conn.from);
                const toAgent = agents.find((a) => a.id === conn.to);
                if (!fromAgent || !toAgent) return null;

                return (
                  <motion.circle
                    key={`particle-${idx}`}
                    r={3}
                    fill="#8B5CF6"
                    initial={{ cx: fromAgent.x, cy: fromAgent.y, opacity: 0 }}
                    animate={{
                      cx: [fromAgent.x, toAgent.x],
                      cy: [fromAgent.y, toAgent.y],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: idx * 0.1,
                    }}
                  />
                );
              })}
          </AnimatePresence>

          {/* Agent nodes */}
          <g>
            {agents.map((agent) => (
              <motion.g key={agent.id}>
                {/* Outer glow ring */}
                <motion.circle
                  cx={agent.x}
                  cy={agent.y}
                  r={agent.isVoting ? 18 : 14}
                  fill="none"
                  stroke={getNodeColor(agent)}
                  strokeWidth={2}
                  strokeOpacity={0.3}
                  animate={{
                    r: agent.isVoting ? [14, 20, 14] : 14,
                    strokeOpacity: agent.isVoting ? [0.3, 0.6, 0.3] : 0.3,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: agent.isVoting ? Infinity : 0,
                  }}
                />
                
                {/* Main node */}
                <motion.circle
                  cx={agent.x}
                  cy={agent.y}
                  r={10}
                  fill={getNodeColor(agent)}
                  style={{ filter: `drop-shadow(${getNodeGlow(agent)})` }}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    opacity: agent.hasVoted ? 1 : 0.7,
                  }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: agent.id * 0.02,
                  }}
                  whileHover={{ scale: 1.2 }}
                />

                {/* Vote indicator */}
                {agent.hasVoted && (
                  <motion.text
                    x={agent.x}
                    y={agent.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={10}
                    fontWeight="bold"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {agent.vote === 'yes' ? '✓' : agent.vote === 'no' ? '✗' : '−'}
                  </motion.text>
                )}

                {/* Agent ID label */}
                <motion.text
                  x={agent.x}
                  y={agent.y + 25}
                  textAnchor="middle"
                  fill="#9CA3AF"
                  fontSize={8}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                >
                  {agent.isFaulty ? '⚠' : ''} A{agent.id}
                </motion.text>
              </motion.g>
            ))}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-gray-400">Honest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-400">Faulty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400">Yes Vote</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-400">Abstain</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NetworkGraph;
