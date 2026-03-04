import { useState, useCallback, useRef } from 'react';
import { Agent, Connection, SimulationState } from '../types';

const BYZANTINE_THRESHOLD = 0.66;

export const useSimulation = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    phase: 'idle',
    currentStep: 0,
    totalSteps: 10,
    consensusPercentage: 0,
    result: null,
    yesVotes: 0,
    noVotes: 0,
    abstainVotes: 0,
  });
  
  const simulationRef = useRef<boolean>(false);

  const generateAgents = useCallback((count: number, faultyPercentage: number): Agent[] => {
    const faultyCount = Math.floor(count * (faultyPercentage / 100));
    const centerX = 250;
    const centerY = 250;
    const radius = 180;

    const newAgents: Agent[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count;
      const jitter = (Math.random() - 0.5) * 40;
      const r = radius + jitter;
      
      newAgents.push({
        id: i,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
        isFaulty: i < faultyCount,
        vote: null,
        hasVoted: false,
        isVoting: false,
      });
    }

    // Shuffle to randomize faulty agent positions
    for (let i = newAgents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempFaulty = newAgents[i].isFaulty;
      newAgents[i].isFaulty = newAgents[j].isFaulty;
      newAgents[j].isFaulty = tempFaulty;
    }

    return newAgents;
  }, []);

  const generateConnections = useCallback((agentList: Agent[]): Connection[] => {
    const conns: Connection[] = [];
    const count = agentList.length;

    // Create a mesh network with each agent connected to nearby agents
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const distance = Math.sqrt(
          Math.pow(agentList[i].x - agentList[j].x, 2) +
          Math.pow(agentList[i].y - agentList[j].y, 2)
        );
        
        // Connect if within reasonable distance or randomly for network connectivity
        if (distance < 150 || Math.random() < 0.1) {
          conns.push({
            from: agentList[i].id,
            to: agentList[j].id,
            isActive: false,
          });
        }
      }
    }

    return conns;
  }, []);

  const simulateVote = useCallback((agent: Agent): 'yes' | 'no' | 'abstain' => {
    if (agent.isFaulty) {
      // Faulty agents: 50% chance to vote opposite or abstain
      const rand = Math.random();
      if (rand < 0.33) return 'yes';
      if (rand < 0.66) return 'no';
      return 'abstain';
    } else {
      // Honest agents: 70-90% probability to vote yes
      const yesProb = 0.7 + Math.random() * 0.2;
      return Math.random() < yesProb ? 'yes' : 'no';
    }
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runSimulation = useCallback(async (agentCount: number, faultyPercentage: number) => {
    simulationRef.current = true;
    
    // Initialize agents and connections
    const newAgents = generateAgents(agentCount, faultyPercentage);
    const newConnections = generateConnections(newAgents);
    
    setAgents(newAgents);
    setConnections(newConnections);
    
    const totalSteps = Math.floor(Math.random() * 11) + 5; // 5-15 steps
    
    setSimulationState({
      phase: 'broadcasting',
      currentStep: 0,
      totalSteps,
      consensusPercentage: 0,
      result: null,
      yesVotes: 0,
      noVotes: 0,
      abstainVotes: 0,
    });

    // Broadcasting phase
    await sleep(800);
    
    // Activate connections for broadcasting
    setConnections(prev => prev.map(c => ({ ...c, isActive: true })));
    await sleep(1200);
    setConnections(prev => prev.map(c => ({ ...c, isActive: false })));

    // Voting phase
    setSimulationState(prev => ({ ...prev, phase: 'voting' }));
    
    let yesVotes = 0;
    let noVotes = 0;
    let abstainVotes = 0;
    
    for (let step = 1; step <= totalSteps && simulationRef.current; step++) {
      const agentsToVote = Math.ceil(agentCount / totalSteps);
      const startIdx = (step - 1) * agentsToVote;
      const endIdx = Math.min(step * agentsToVote, agentCount);
      
      // Mark agents as voting
      setAgents(prev => prev.map((agent, idx) => ({
        ...agent,
        isVoting: idx >= startIdx && idx < endIdx && !agent.hasVoted,
      })));
      
      await sleep(300 + Math.random() * 200);
      
      // Process votes
      setAgents(prev => {
        const updated = prev.map((agent, idx) => {
          if (idx >= startIdx && idx < endIdx && !agent.hasVoted) {
            const vote = simulateVote(agent);
            if (vote === 'yes') yesVotes++;
            else if (vote === 'no') noVotes++;
            else abstainVotes++;
            
            return {
              ...agent,
              vote,
              hasVoted: true,
              isVoting: false,
            };
          }
          return { ...agent, isVoting: false };
        });
        return updated;
      });
      
      const votedCount = yesVotes + noVotes + abstainVotes;
      const consensusPercentage = votedCount > 0 ? (yesVotes / votedCount) * 100 : 0;
      
      setSimulationState(prev => ({
        ...prev,
        currentStep: step,
        consensusPercentage,
        yesVotes,
        noVotes,
        abstainVotes,
      }));
      
      await sleep(300 + Math.random() * 200);
    }

    // Counting phase
    setSimulationState(prev => ({ ...prev, phase: 'counting' }));
    await sleep(1000);

    // Determine result
    const totalVoted = yesVotes + noVotes;
    const finalConsensus = totalVoted > 0 ? (yesVotes / totalVoted) * 100 : 0;
    
    let result: 'success' | 'failure' | 'partial';
    if (finalConsensus >= BYZANTINE_THRESHOLD * 100) {
      result = 'success';
    } else if (finalConsensus >= 50) {
      result = 'partial';
    } else {
      result = 'failure';
    }

    setSimulationState(prev => ({
      ...prev,
      phase: 'complete',
      consensusPercentage: finalConsensus,
      result,
      yesVotes,
      noVotes,
      abstainVotes,
    }));
    
    simulationRef.current = false;
  }, [generateAgents, generateConnections, simulateVote]);

  const resetSimulation = useCallback(() => {
    simulationRef.current = false;
    setAgents([]);
    setConnections([]);
    setSimulationState({
      phase: 'idle',
      currentStep: 0,
      totalSteps: 10,
      consensusPercentage: 0,
      result: null,
      yesVotes: 0,
      noVotes: 0,
      abstainVotes: 0,
    });
  }, []);

  return {
    agents,
    connections,
    simulationState,
    runSimulation,
    resetSimulation,
    isRunning: simulationState.phase !== 'idle' && simulationState.phase !== 'complete',
  };
};
