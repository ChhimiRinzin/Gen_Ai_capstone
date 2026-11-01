import { Inspection, AuditCriterion, AuditFinding } from '../types';

export function generate5cFinding(
  inspection: Inspection,
  criterion?: AuditCriterion,
  auditorNotes?: string
): AuditFinding {
  const findingId = `FND-${Math.floor(1000 + Math.random() * 9000)}`;
  const detections = inspection.detections || [];
  const risk = inspection.risk_assessment;

  // 1. Criteria (What should be)
  const c_criteria = criterion
    ? `According to ${criterion.ref} (${criterion.title}): "${criterion.criterion}" (Tolerance: ${criterion.tolerance})`
    : 'Department of Surface Transport (DoST) Standard Road Maintenance Specification: Pavement wearing surfaces shall remain free of unsealed cracks and potholes exceeding 25mm to prevent subbase damage and maintain motorist safety.';

  // 2. Condition (What is observed)
  let c_condition = '';
  let title = '';
  if (detections.length === 0) {
    c_condition = `Visual inspection evidence (${inspection.filename}, ID ${inspection.id}) in ${inspection.dzongkhag} demonstrates sound pavement surface with no visible distress.`;
    title = `Compliance: Satisfactory Surface Condition in ${inspection.dzongkhag}`;
  } else {
    const defectCounts: Record<string, number> = {};
    for (const d of detections) {
      defectCounts[d.class_name] = (defectCounts[d.class_name] || 0) + 1;
    }
    const defectSummary = Object.entries(defectCounts)
      .map(([name, count]) => `${count} ${name}(s)`)
      .join(', ');

    const totalArea = detections.reduce((sum, d) => sum + (d.area_percentage || 0), 0);
    c_condition = `Visual photographic evidence (${inspection.filename}, Evidence ID ${inspection.id}) establishes ${detections.length} active surface defect(s) [${defectSummary}], occupying approximately ${totalArea.toFixed(1)}% of the roadway frame on ${inspection.road_class} in ${inspection.dzongkhag}.`;
    
    title = `Pavement Distress: Unrepaired ${detections[0].class_name} on ${inspection.road_class} (${inspection.dzongkhag})`;
  }

  // 3. Cause (Why it occurred - Mandatory Unverified Rule)
  let c_cause = 'Not established — requires auditor verification. Potential contributing engineering factors include: unsealed surface fissures admitting rainfall into subbase, delayed periodic routine maintenance by regional highway division, defective bitumen mix compaction, or unmanaged surface runoff.';
  if (auditorNotes && auditorNotes.trim()) {
    c_cause += ` Auditor field note: "${auditorNotes.trim()}".`;
  }

  // 4. Consequence / Effect
  const hasPothole = detections.some(d => d.class_code === 'D40');
  const c_consequence = hasPothole
    ? 'Immediate road safety risk including tire blowout, vehicle steering loss on mountain bends, accelerated water infiltration washing out road subgrade, and escalating emergency reconstruction expenditure.'
    : 'Progressive water ingress along crack fractures will induce subbase pumping, accelerating alligator fatigue cracking and rapid pothole crater formation during the monsoon season.';

  // 5. Corrective Action / Recommendation
  const c_recommendation = [
    '1. Department of Surface Transport (DoST) regional executive engineer should conduct immediate physical core depth verification.',
    '2. Issue work order for localized bitumen emulsion crack sealing or hot-mix pothole patch compaction within 48 hours.',
    '3. Audit contractor routine maintenance logbook to ascertain compliance with contracted defect liability response periods.'
  ].join('\n');

  let sev: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
  if (risk.level === 'CRITICAL') sev = 'Critical';
  else if (risk.level === 'HIGH') sev = 'High';
  else if (risk.level === 'LOW') sev = 'Low';

  return {
    id: findingId,
    title,
    evidence_id: inspection.id,
    evidence_filename: inspection.filename,
    dzongkhag: inspection.dzongkhag,
    road_class: inspection.road_class,
    criteria: c_criteria,
    condition: c_condition,
    cause: c_cause,
    consequence: c_consequence,
    recommendation: c_recommendation,
    severity: sev,
    verification_status: 'Unverified — Pending Field Audit',
    auditor_comments: '',
    is_human_confirmed: false,
    created_at: new Date().toISOString()
  };
}
