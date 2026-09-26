export type DomainCategory = 'defense' | 'geopolitics' | 'finance';

export interface StrategicHotspot {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
  category: DomainCategory;
  severity: 'critical' | 'elevated' | 'monitored';
  headline: string;
  summary: string;
  globalRelevance: string;
  keySystemsInvolved: string[];
  activeAgents: string[];
  lastUpdate: string;
  imgUrl: string;
}

export interface AgentProfile {
  id: string;
  code: string;
  name: string;
  domain: 'defense' | 'geopolitics' | 'finance' | 'verification' | 'supervisor';
  role: string;
  coreQuestion: string;
  status: 'active' | 'analyzing' | 'monitoring' | 'correlating';
  currentFocus: string;
  recentOutputSnippet: string;
  confidenceScore: number;
}

export interface IntelligenceReport {
  id: string;
  slug: string;
  title: string;
  timestamp: string;
  leadDomain: DomainCategory;
  hotspotId?: string;
  whatHappened: {
    event: string;
    who: string[];
    where: string;
    when: string;
    confirmed: string;
    unclear: string;
  };
  whyItMatters: {
    defensePerspective: string;
    geopoliticalPerspective: string;
    economicPerspective: string;
    globalStrategicPerspective: string;
  };
  whatChanged: {
    baseline: string;
    current: string;
    deltaItems: string[];
  };
  whatIsConnected: {
    connectedHotspots: string[];
    relatedAgreementsOrTech: string[];
    geopoliticalEchoes: string;
  };
  whatCouldHappenNext: {
    likelyScenario: string;
    indicatorsToWatch: string[];
    triggerConditions: string;
  };
  verificationData: {
    primarySourcesCount: number;
    secondaryRepeatingCount: number;
    contradictionFound: boolean;
    verificationNotes: string;
    confidenceLevel: 'High' | 'Moderate' | 'Guarded / Unverified';
  };
  preservedUncertainties: string[];
}

export interface DefenseSOE {
  id: string;
  name: string;
  acronym: string;
  country: string;
  type: 'DPSU (Defense Public Sector Undertaking)' | 'National Research Lab' | 'State Defense Corporation' | 'Global Defense Prime' | 'Joint Venture';
  annualRevenue: string;
  orderBook: string;
  flagshipPrograms: string[];
  roleInGlobalDefense: string;
  headquarters: string;
  workforce: string;
  keyCollaborators: string[];
  stockTicker?: string;
}

export interface WeaponSystem {
  id: string;
  name: string;
  category: 'Air Systems' | 'Naval / Submarine' | 'Strategic Missiles' | 'Air Defense' | 'Drones & ISR' | 'Electronic Warfare';
  generation: string; // e.g. '5th Generation', '4.5th Generation', 'Advanced Trainer'
  origin: string; // e.g. 'United States', 'Russia', 'China', 'France', 'Global Command'
  manufacturer: string;
  soeEntity?: string; // e.g. 'Global Aerospace', 'DARPA/Global R&D', 'Global Electronics', 'Global Dynamics', 'Global Dockyards', 'Rostec', 'AVIC', 'Dassault'
  soeType?: 'National Defense SOE' | 'Global Defense SOE' | 'Private Defense Prime' | 'Intergovernmental JV';
  indigenousContentPercent?: number; // e.g. 70
  status: 'In service' | 'In limited service' | 'Development/Testing' | 'Operational' | 'Testing / Induction' | 'Indigenous Development';
  unitCost: string; // e.g. '$150 million'
  maxSpeedFormatted: string; // e.g. 'Mach 2.25 (1,500 mph, 2,410 km/h)'
  stealthRating: number; // e.g. 95
  speedScore: number; // 0 - 100 for gauge
  maneuverScore: number; // 0 - 100 for gauge
  imgUrl: string;
  overview: string;
  specifications: Record<string, string>;
  operators: string[];
  deploymentStatus: string;
  recentDevelopments: string;
  hardpoints?: string[];
  radarSystem?: string;
  combatRange?: string;
}

export interface CountryProfile {
  id: string;
  country: string;
  capital: string;
  strategicPosture: string;
  defenseDoctrine: string;
  bilateralRelations: string;
  keyStrategicAssets: string[];
  criticalChokepointsWatched: string[];
  osintAlertLevel: 'High' | 'Elevated' | 'Stable';
}
