export type DamageClassCode = 'D00' | 'D10' | 'D20' | 'D40';

export interface Detection {
  id: string;
  class_code: DamageClassCode;
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  area_percentage: number;
  area_pixels: number;
}

export interface CVMetrics {
  blur_metric: number;
  is_blurry: boolean;
  brightness: number;
  contrast: number;
  quality_status: string;
  dimensions: { width: number; height: number };
}

export interface RiskFactorBreakdown {
  damage_severity_points: number;
  surface_extent_points: number;
  road_class_points: number;
  environmental_points: number;
  total_area_pct: number;
  defects_count: number;
  road_class_name: string;
  dzongkhag: string;
}

export interface RiskAssessment {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  badge: string;
  color: string;
  explanation: string;
  factor_breakdown: RiskFactorBreakdown;
}

export interface Inspection {
  id: string;
  filename: string;
  imageUrl: string;
  dzongkhag: string;
  road_class: string;
  locality?: string;
  coordinates: { lat: number; lon: number };
  detections: Detection[];
  cv_metrics: CVMetrics;
  risk_assessment: RiskAssessment;
  groq_analysis?: string | null;
  is_monsoon: boolean;
  drainage_blocked: boolean;
  created_at: string;
}

export interface AuditCriterion {
  id: string;
  ref: string;
  title: string;
  criterion: string;
  tolerance: string;
  sourceDoc: string;
}

export interface AuditFinding {
  id: string;
  title: string;
  evidence_id: string;
  evidence_filename: string;
  dzongkhag: string;
  road_class: string;
  criteria: string;
  condition: string;
  cause: string;
  consequence: string;
  recommendation: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  verification_status: string;
  auditor_comments: string;
  is_human_confirmed: boolean;
  created_at: string;
}

export interface AuditDocument {
  id: string;
  filename: string;
  page_count: number;
  uploaded_at: string;
  size_kb: number;
  extracted_criteria: AuditCriterion[];
  text_preview: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: string;
}
