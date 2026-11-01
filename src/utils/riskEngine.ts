import { Detection, RiskAssessment } from '../types';
import { BHUTAN_ROAD_CLASSES } from '../data/bhutanData';

export function calculateRiskScore(
  detections: Detection[],
  roadClassCode = 'PNH',
  dzongkhag = 'Thimphu',
  isMonsoon = false,
  drainageBlocked = false,
  isHighAltitude = false
): RiskAssessment {
  if (!detections || detections.length === 0) {
    return {
      score: 0,
      level: 'LOW',
      badge: 'No Damage Detected',
      color: '#10b981',
      explanation: 'No confirmed road damage defects were detected in this inspection image.',
      factor_breakdown: {
        damage_severity_points: 0,
        surface_extent_points: 0,
        road_class_points: 10,
        environmental_points: 0,
        total_area_pct: 0,
        defects_count: 0,
        road_class_name: BHUTAN_ROAD_CLASSES[roadClassCode as keyof typeof BHUTAN_ROAD_CLASSES]?.name || 'Highway',
        dzongkhag
      }
    };
  }

  // 1. Damage Severity Component (Max 40 points)
  const classWeights: Record<string, number> = {
    D00: 1.2,
    D10: 1.4,
    D20: 2.2,
    D40: 2.8
  };

  let severityPoints = 0;
  let maxWeight = 0;
  const defectCodes: string[] = [];

  for (const det of detections) {
    const weight = classWeights[det.class_code] || 1.0;
    maxWeight = Math.max(maxWeight, weight);
    severityPoints += weight * 7.5 * det.confidence;
    defectCodes.push(det.class_code);
  }

  const damage_severity_points = Math.min(40.0, severityPoints);

  // 2. Surface Extent Component (Max 25 points)
  const total_area_pct = detections.reduce((sum, d) => sum + (d.area_percentage || 0), 0);
  const surface_extent_points = Math.min(25.0, (total_area_pct / 10.0) * 25.0);

  // 3. Road Classification Multiplier (Max 20 points)
  const roadMeta = BHUTAN_ROAD_CLASSES[roadClassCode as keyof typeof BHUTAN_ROAD_CLASSES] || BHUTAN_ROAD_CLASSES.PNH;
  const roadFactor = roadMeta.weight_factor;
  const road_class_points = Math.min(20.0, 12.0 * roadFactor);

  // 4. Environmental & Bhutan Terrain Factors (Max 15 points)
  let envPoints = 0;
  const envReasons: string[] = [];

  if (isMonsoon) {
    envPoints += 6.0;
    envReasons.push('Monsoon saturation amplifies subbase washouts');
  }
  if (drainageBlocked) {
    envPoints += 5.0;
    envReasons.push('Clogged roadside drains cause cross-highway sheet flow');
  }
  if (isHighAltitude) {
    envPoints += 4.0;
    envReasons.push('High-altitude pass subject to freeze-thaw cycles');
  }

  const environmental_points = Math.min(15.0, envPoints);

  // Total Score (0-100)
  const rawScore = damage_severity_points + surface_extent_points + road_class_points + environmental_points;
  const score = Math.round(Math.min(100.0, Math.max(0, rawScore)) * 10) / 10;

  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let badge = 'Low Priority';
  let color = '#10b981';

  if (score >= 75) {
    level = 'CRITICAL';
    badge = 'Critical Priority';
    color = '#ef4444';
  } else if (score >= 50) {
    level = 'HIGH';
    badge = 'High Priority';
    color = '#f97316';
  } else if (score >= 25) {
    level = 'MEDIUM';
    badge = 'Medium Priority';
    color = '#eab308';
  }

  const uniqueCodes = Array.from(new Set(defectCodes)).sort().join(', ');
  const reasons = [
    `Detected ${detections.length} defect(s) [${uniqueCodes}] with max severity factor of ${maxWeight}x`,
    `Surface distress covers ~${total_area_pct.toFixed(1)}% of frame area`,
    `Located on ${roadMeta.name} (classification multiplier: ${roadFactor}x)`
  ];
  if (envReasons.length > 0) {
    reasons.push(...envReasons);
  }

  const explanation = `${reasons.join('; ')} — overall road risk categorized as ${level}.`;

  return {
    score,
    level,
    badge,
    color,
    explanation,
    factor_breakdown: {
      damage_severity_points: Math.round(damage_severity_points * 10) / 10,
      surface_extent_points: Math.round(surface_extent_points * 10) / 10,
      road_class_points: Math.round(road_class_points * 10) / 10,
      environmental_points: Math.round(environmental_points * 10) / 10,
      total_area_pct: Math.round(total_area_pct * 10) / 10,
      defects_count: detections.length,
      road_class_name: roadMeta.name,
      dzongkhag
    }
  };
}
