import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import BackgroundWaves from './components/BackgroundWaves';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import NetworkGraph from './components/NetworkGraph';
import ProgressIndicator from './components/ProgressIndicator';
import ResultPanel from './components/ResultPanel';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import { useSimulation } from './hooks/useSimulation';

function App() {
  const [agentCount, setAgentCount] = useState(20);
  const [faultyPercentage, setFaultyPercentage] = useState(10);
  const [proposalText, setProposalText] = useState('Upgrade Endless consensus to ZK proofs?');

  const {
    agents,
    connections,
    simulationState,
    runSimulation,
    resetSimulation,
    isRunning,
  } = useSimulation();

  const handleRunSimulation = () => {
    if (!isRunning) {
      resetSimulation();
      setTimeout(() => {
        runSimulation(agentCount, faultyPercentage);
      }, 100);
    }
  };

  // Initialize with default agents on mount
  useEffect(() => {
    if (agents.length === 0 && simulationState.phase === 'idle') {
      // Generate initial visualization
      const centerX = 250;
      const centerY = 250;
      const radius = 180;
      const initialAgents = Array.from({ length: agentCount }, (_, i) => {
        const angle = (2 * Math.PI * i) / agentCount;
        const jitter = (Math.random() - 0.5) * 40;
        const r = radius + jitter;
        return {
          id: i,
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle),
          isFaulty: i < Math.floor(agentCount * (faultyPercentage / 100)),
          vote: null,
          hasVoted: false,
          isVoting: false,
        };
      });
      // This is just for initial display, actual simulation will regenerate
    }
  }, []);

  return (
    <div className="min-h-screen bg-deep-black text-white font-inter relative overflow-x-hidden">
      <BackgroundWaves />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="pb-8">
          {/* Proposal display */}
          {proposalText && (
            <div className="glass rounded-xl p-4 mb-6 text-center">
              <span className="text-gray-400 text-sm">Current Proposal:</span>
              <p className="text-lg md:text-xl font-medium text-white mt-1">
                "{proposalText}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Input Panel */}
            <InputPanel
              agentCount={agentCount}
              setAgentCount={setAgentCount}
              faultyPercentage={faultyPercentage}
              setFaultyPercentage={setFaultyPercentage}
              proposalText={proposalText}
              setProposalText={setProposalText}
              onRunSimulation={handleRunSimulation}
              isRunning={isRunning}
            />

            {/* Network Graph */}
            <NetworkGraph
              agents={agents}
              connections={connections}
              simulationState={simulationState}
            />
          </div>

          {/* Progress Indicator */}
          <AnimatePresence>
            {isRunning && (
              <div className="mb-6">
                <ProgressIndicator simulationState={simulationState} />
              </div>
            )}
          </AnimatePresence>

          {/* Result Panel */}
          <AnimatePresence>
            {simulationState.phase === 'complete' && (
              <div className="mb-6">
                <ResultPanel
                  simulationState={simulationState}
                  totalAgents={agentCount}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Info Section */}
          <InfoSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
