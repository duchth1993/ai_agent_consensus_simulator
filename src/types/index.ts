export interface Agent {
  id: number;
  x: number;
  y: number;
  isFaulty: boolean;
  vote: 'yes' | 'no' | 'abstain' | null;
  hasVoted: boolean;
  isVoting: boolean;
}

export interface SimulationState {
  phase: 'idle' | 'broadcasting' | 'voting' | 'counting' | 'complete';
  currentStep: number;
  totalSteps: number;
  consensusPercentage: number;
  result: 'success' | 'failure' | 'partial' | null;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}

export interface Connection {
  from: number;
  to: number;
  isActive: boolean;
}
