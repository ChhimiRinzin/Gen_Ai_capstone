import React from 'react';
import { FileText, Download, Printer, ShieldAlert, FileSpreadsheet, Package, CheckCircle } from 'lucide-react';
import { Inspection, AuditFinding, AuditDocument } from '../types';

interface AIReportsProps {
  inspections: Inspection[];
  findings: AuditFinding[];
  documents: AuditDocument[];
}

export const AIReports: React.FC<AIReportsProps> = ({
  inspections,
  findings,
  documents
}) => {
  const totalDetections = inspections.reduce((sum, i) => sum + i.detections.length, 0);
  const criticalHazards = inspections.filter((i) => i.risk_assessment.level === 'CRITICAL').length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const data = {
      app: 'RoadSentry AI',
      country: 'Kingdom of Bhutan',
      exported_at: new Date().toISOString(),
      disclaimer: 'AI-Assisted Draft Audit Report — Subject to Professional Auditor Review.',
      metrics: {
        total_inspections: inspections.length,
        total_detections: totalDetections,
        critical_hazards: criticalHazards,
        audit_findings: findings.length,
      },
      inspections,
      findings,
      documents
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RoadSentry_Audit_Session_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Inspection_ID',
      'Filename',
      'Dzongkhag',
      'Road_Class',
      'Risk_Level',
      'Risk_Score',
      'Defect_Count',
      'Defect_Codes',
      'Latitude',
      'Longitude',
      'Created_At'
    ];

    const rows = inspections.map((i) => [
      i.id,
      i.filename,
      i.dzongkhag,
      i.road_class,
      i.risk_assessment.level,
      i.risk_assessment.score,
      i.detections.length,
      i.detections.map((d) => d.class_code).join(';'),
      i.coordinates.lat,
      i.coordinates.lon,
      i.created_at
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RoadSentry_Inspections_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdownDOCX = () => {
    const md = `
# RoadSentry AI — Infrastructure Audit Working Paper
**Jurisdiction:** Kingdom of Bhutan  
**Beneficiary:** Department of Surface Transport (DoST) / Royal Audit Authority (RAA)  
**Date Generated:** ${new Date().toUTCString()}  

---

> **MANDATORY STATUTORY AUDIT DISCLAIMER**  
> **AI-Assisted Draft Audit Report — Subject to Professional Auditor Review.**  
> This working paper provides preliminary engineering and visual triage observations.  
> It does not constitute an official statutory audit opinion or engineering structural certification.  
> Physical core testing and maintenance log verification must be completed prior to finalizing audit notices.  

---

## 1. Executive Summary & Session Metrics
- **Total Verified Road Inspections:** ${inspections.length}
- **Total YOLO RDD2022 Detections:** ${totalDetections}
- **Critical Risk Road Hazards:** ${criticalHazards}
- **Draft 5C Audit Findings:** ${findings.length}
- **Technical Standards Referenced:** ${documents.length + 1}

---

## 2. Visual Inspection Evidence Registry
${inspections.map((i, idx) => `
### Inspection ${idx + 1}: ${i.id} (${i.filename})
- **Location:** ${i.dzongkhag} (${i.road_class}) | GPS: ${i.coordinates.lat}°N, ${i.coordinates.lon}°E
- **Assessed Risk Priority:** **${i.risk_assessment.level}** (Score: ${i.risk_assessment.score} / 100)
- **Defects Detected:** ${i.detections.map((d) => `${d.class_code} ${d.class_name} (${(d.confidence * 100).toFixed(0)}%)`).join(', ') || 'None'}
- **Engineering Justification:** ${i.risk_assessment.explanation}
`).join('\n')}

---

## 3. Structured 5C Infrastructure Audit Findings
${findings.map((f, idx) => `
### Finding ${idx + 1}: ${f.title}
- **Evidence Link:** ${f.evidence_id} | **Severity:** ${f.severity} Priority
- **Verification Status:** ${f.verification_status}
- **1. Criteria:** ${f.criteria}
- **2. Condition:** ${f.condition}
- **3. Cause:** ${f.cause}
- **4. Consequence / Effect:** ${f.consequence}
- **5. Corrective Action / Recommendation:**
${f.recommendation}
`).join('\n')}
    `;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RoadSentry_Audit_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and Download Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            AI Reports & Formal Audit Working Papers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Export audit evidence packages in PDF-printable dossier, Markdown/DOCX, CSV, and complete JSON formats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            Print / Save PDF
          </button>

          <button
            onClick={handleDownloadMarkdownDOCX}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            Export DOCX/MD
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            Export CSV
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Package className="w-3.5 h-3.5" />
            Full Session JSON
          </button>
        </div>
      </div>

      {/* Printable Report Document Surface */}
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-200 space-y-6 max-w-4xl mx-auto">
        {/* Official Header */}
        <div className="border-b border-slate-800 pb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-100 tracking-tight">
                RoadSentry AI
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                BHUTAN 🇧🇹
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Public Infrastructure & Road Safety Performance Audit Intelligence Working Paper
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-400 font-mono">
            <div>Session ID: SESS-{new Date().toISOString().slice(0, 10)}</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 text-[11px] text-rose-300 leading-relaxed">
          <span className="font-bold text-rose-300 uppercase block mb-0.5">
            AI-Assisted Draft Audit Report — Subject to Professional Auditor Review
          </span>
          This document is generated by RoadSentry AI for decision-support and audit triage. It does not replace
          formal statutory audit opinions of the Royal Audit Authority (RAA) or official engineering certification.
          Physical core sampling, depth measurements, and contractor log verification remain required.
        </div>

        {/* Section 1: Executive Metrics */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-1">
            1. Executive Metrics & Summary
          </h3>
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Inspections</span>
              <span className="text-lg font-bold font-mono text-cyan-300">{inspections.length}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">YOLO Detections</span>
              <span className="text-lg font-bold font-mono text-teal-300">{totalDetections}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Critical Hazards</span>
              <span className="text-lg font-bold font-mono text-rose-400">{criticalHazards}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">5C Findings</span>
              <span className="text-lg font-bold font-mono text-purple-300">{findings.length}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Visual Inspection Evidence */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-1">
            2. Visual Inspection Evidence Registry
          </h3>

          {inspections.length === 0 ? (
            <div className="text-xs text-slate-400 italic py-2">No visual evidence records in active session.</div>
          ) : (
            <div className="space-y-3">
              {inspections.map((i) => (
                <div key={i.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-cyan-400">{i.id} — {i.filename}</span>
                    <span className="text-slate-300">{i.dzongkhag} ({i.road_class})</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Risk Level: <strong className="text-slate-200">{i.risk_assessment.level}</strong> ({i.risk_assessment.score} pts) | Defects: {i.detections.length}
                  </div>
                  <div className="text-slate-300 text-[11px] italic">
                    "{i.risk_assessment.explanation}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: 5C Findings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-1">
            3. Structured 5C Infrastructure Audit Findings
          </h3>

          {findings.length === 0 ? (
            <div className="text-xs text-slate-400 italic py-2">No 5C audit findings created in active session.</div>
          ) : (
            <div className="space-y-4">
              {findings.map((f, idx) => (
                <div key={f.id} className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold pb-2 border-b border-slate-800">
                    <span className="text-purple-300">Finding #{idx + 1}: {f.title}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{f.verification_status}</span>
                  </div>
                  <div><strong>1. Criteria:</strong> {f.criteria}</div>
                  <div><strong>2. Condition:</strong> {f.condition}</div>
                  <div><strong className="text-rose-400">3. Cause:</strong> {f.cause}</div>
                  <div><strong className="text-orange-400">4. Consequence:</strong> {f.consequence}</div>
                  <div className="whitespace-pre-line"><strong className="text-teal-400">5. Corrective Action:</strong> {f.recommendation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
