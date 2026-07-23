export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  idea: string;
  industry: string;
  audience?: string;
  country?: string;
  budget?: string;
  team?: string;
  stage: string;
  goal: string;
  created_at: string;
  updated_at: string;
}

export interface Problem {
  statement: string;
  who: string;
  why: string;
}

export interface Solution {
  description: string;
  advantage: string;
}

export interface TargetCustomers {
  ageGroup: string;
  occupation: string;
  location: string;
  incomeLevel: string;
  persona: string;
}

export interface MarketSize {
  tam: string;
  sam: string;
  som: string;
}

export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
}

export interface BusinessModelCanvas {
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valueProposition: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

export interface MVPFeatures {
  mustHave: string[];
  niceToHave: string[];
  future: string[];
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  aiModel: string;
  hosting: string;
  authentication: string;
  storage: string;
}

export interface Risks {
  technical: string;
  financial: string;
  legal: string;
  market: string;
  competition: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RoadmapWeek {
  week: string;
  actions: string;
}

export interface StartupScore {
  overall: number;
  innovation: number;
  feasibility: number;
  marketPotential: number;
  scalability: number;
  executionComplexity: number;
}

export interface StartupBlueprint {
  startupNames: string[];
  elevatorPitch: string;
  problem: Problem;
  solution: Solution;
  targetCustomers: TargetCustomers;
  marketSize: MarketSize;
  competitors: Competitor[];
  usp: string;
  revenueModel: string[];
  bmc: BusinessModelCanvas;
  mvpFeatures: MVPFeatures;
  techStack: TechStack;
  marketingPlan: string[];
  launchStrategy: string[];
  risks: Risks;
  swot: SWOT;
  roadmap30day: RoadmapWeek[];
  investorPitch: string;
  startupScore: StartupScore;
}

export interface Analysis {
  id: string;
  project_id: string;
  blueprint_json: StartupBlueprint;
  created_at: string;
}

