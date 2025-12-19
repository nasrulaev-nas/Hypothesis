export enum ExperimentStatus {
  DRAFT = 'DRAFT',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum ElementType {
  HEADLINE = 'HEADLINE',
  SUBHEAD = 'SUBHEAD',
  PARAGRAPH = 'PARAGRAPH',
  BUTTON = 'BUTTON',
  LINK = 'LINK',
  FAQ = 'FAQ'
}

export interface Project {
  id: string;
  domain: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  monthlyTraffic: number;
  planLimit: number; // 1000, 10000, 50000, 200000
}

export interface BusinessFacts {
  geography: string;
  hours: string;
  services: string[];
  advantages: string[];
  forbiddenPhrases: string[];
  forbidNumbers: boolean;
}

export interface Variant {
  id: string;
  name: string;
  content: string;
  isControl: boolean;
  trafficSplit: number; // 50 means 50%
}

export interface Experiment {
  id: string;
  projectId: string;
  name: string;
  urlPattern: string;
  selector: string;
  elementType: ElementType;
  originalText: string;
  status: ExperimentStatus;
  variants: Variant[];
  startDate?: string;
  stats: {
    visitors: number;
    conversions: number;
    compositeScore: number;
    confidence: number; // 0 to 1
  };
}

export interface AnalyticsDataPoint {
  date: string;
  control: number;
  variantB: number;
}