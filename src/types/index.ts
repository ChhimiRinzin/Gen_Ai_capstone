/**
 * RoadSentry AI - Global TypeScript Types
 * Standard RDD2022 Schema & Bhutan Road Infrastructure Definitions
 */

export type DamageClassCode = 'D00' | 'D10' | 'D20' | 'D40';

export interface Detection {
  id: string;
  class_code: DamageClassCode;
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] in pixel coords
  area_percentage: number;
  area_pixels: number;
}

export interface CVMetrics {
  blur_metric: number;
  is_blurry: boolean;
  brightness: number;
  contrast: number;
  quality_status: string;
}

export interface RiskFactorBreakdown {
  damage_severity_points: number;
  surface_extent_points: number;
  road_class_points: number;
  environmental_points: number;
}

export interface RiskAssessment {
  score: number;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  badge: string;
  color: string;
  factor_breakdown: RiskFactorBreakdown;
  explanation: string;
}

export interface Inspection {
  id: string;
  filename: string;
  imageUrl?: string;
  dzongkhag: string;
  road_class: string;
  locality: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  detections: Detection[];
  cv_metrics: CVMetrics;
  risk_assessment: RiskAssessment;
  groq_analysis?: string | null;
  is_monsoon: boolean;
  drainage_blocked: boolean;
  created_at: string;
}

export interface AuditFinding {
  id: string;
  inspection_id: string;
  clause: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  // 5C Auditor Framework
  condition: string;
  criteria: string;
  cause: string;
  consequence: string;
  corrective_action: string;
  verified_by_human: boolean;
  created_at: string;
}

export interface DzongkhagMetadata {
  region: 'Western' | 'Central' | 'Eastern' | 'Southern';
  center_lat: number;
  center_lon: number;
  monsoon_risk_multiplier: number;
  terrain: 'Alpine' | 'High-Himalayan' | 'Sub-Tropical' | 'Foothills';
}
