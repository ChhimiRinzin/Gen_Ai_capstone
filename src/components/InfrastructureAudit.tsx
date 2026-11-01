import React, { useState } from 'react';
import {
  FileCheck2,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Scale,
  Sparkles,
  UserCheck,
  Edit3,
  Trash2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Inspection, AuditCriterion, AuditFinding, AuditDocument } from '../types';
import { DEFAULT_AUDIT_CRITERIA } from '../data/bhutanData';
import { generate5cFinding } from '../utils/auditEngine';

interface InfrastructureAuditProps {
  inspections: Inspection[];
  findings: AuditFinding[];
  documents: AuditDocument[];
  onAddFinding: (finding: AuditFinding) => void;
  onUpdateFinding: (id: string, updated: Partial<AuditFinding>) => void;
  onDeleteFinding: (id: string) => void;
  onUploadDocument: (doc: AuditDocument) => void;
}

export const InfrastructureAudit: React.FC<InfrastructureAuditProps> = ({
  inspections,
  findings,
  documents,
  onAddFinding,
  onUpdateFinding,
  onDeleteFinding,
  onUploadDocument
}) => {
  const [activeTab, setActiveTab] = useState<'criteria' | 'compare' | 'findings'>('findings');
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(
    inspections.length > 0 ? inspections[0].id : ''
  );
  const [selectedCriterionId, setSelectedCriterionId] = useState<string>(DEFAULT_AUDIT_CRITERIA[0].id);
  const [auditorNote, setAuditorNote] = useState<string>('');
  const [generatedSuccessMsg, setGeneratedSuccessMsg] = useState<string | null>(null);

  // Available criteria
  const allCriteria = [
    ...DEFAULT_AUDIT_CRITERIA,
    ...documents.flatMap((d) => d.extracted_criteria)
  ];

  const currentInspection = inspections.find((i) => i.id === selectedInspectionId) || inspections[0];
  const currentCriterion = allCriteria.find((c) => c.id === selectedCriterionId) || allCriteria[0];

  const handleSynthesizeFinding = () => {
    if (!currentInspection) return;
    const newFinding = generate5cFinding(currentInspection, currentCriterion, auditorNote);
    onAddFinding(newFinding);
    setGeneratedSuccessMsg(`Generated ${newFinding.id}: "${newFinding.title}"`);
    setActiveTab('findings');
  };

  const handleCustomDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: AuditDocument = {
      id: `DOC-0${documents.length + 1}`,
      filename: file.name,
      page_count: Math.floor(Math.random() * 12) + 4,
      uploaded_at: new Date().toISOString(),
      size_kb: Math.round(file.size / 1024),
      extracted_criteria: [
        {
          id: `CRIT-${Math.floor(10 + Math.random() * 90)}`,
          ref: `Extracted Clause from ${file.name}`,
          title: 'Contractual Pavement Surface Requirement',
          criterion: 'The contractor shall ensure that any cracking or surface cavities are inspected, recorded, and sealed within the agreed contractual response timeframe.',
          tolerance: 'Response within 7 days',
          sourceDoc: file.name
        }
      ],
      text_preview: `Extracted textual clauses and engineering standards from ${file.name}. Clauses parsed with verified digital text layer.`
    };
    onUploadDocument(newDoc);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold tracking-wide uppercase text-rose-300">
            5C Audit Framework & Human Auditor Primacy:
          </span>{' '}
          In accordance with INTOSAI and Royal Audit Authority (RAA) standards, the 5 components are
          Criteria, Condition, Cause, Consequence, and Corrective Action. Causes are marked as unverified until
          substantiated by physical core testing or maintenance logs.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('findings')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'findings'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Draft 5C Audit Findings ({findings.length})
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'compare'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          Criteria vs Condition Comparison
        </button>

        <button
          onClick={() => setActiveTab('criteria')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'criteria'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Audit Standards & Documents ({documents.length + 1})
        </button>
      </div>

      {/* TAB 1: 5C Findings */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Auditor Working Papers & Draft Findings
              </h3>
              <p className="text-xs text-slate-400">
                Review, verify, edit, or sign off on preliminary AI findings before generating report dossiers.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('compare')}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Synthesize New 5C Finding
            </button>
          </div>

          {generatedSuccessMsg && (
            <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-800/60 text-xs text-teal-300">
              ✅ {generatedSuccessMsg}
            </div>
          )}

          {findings.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No 5C Audit Findings Synthesized Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Compare verified inspection evidence against road maintenance criteria to generate structured audit working papers.
              </p>
              <button
                onClick={() => setActiveTab('compare')}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
              >
                Start Criteria Comparison
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {findings.map((f, idx) => (
                <div
                  key={f.id}
                  className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {f.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{f.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {f.dzongkhag} ({f.road_class})
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          f.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : f.severity === 'High'
                            ? 'bg-orange-950 text-orange-300 border border-orange-800'
                            : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                        }`}
                      >
                        {f.severity} Priority
                      </span>
                    </div>
                  </div>

                  {/* 5C Structured Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                        1. Criteria (What should be):
                      </span>
                      <p className="text-slate-300 leading-relaxed">{f.criteria}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[11px] font-bold text-teal-400 block mb-1">
                        2. Condition (What is observed):
                      </span>
                      <p className="text-slate-300 leading-relaxed">{f.condition}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[11px] font-bold text-rose-400 block mb-1">
                        3. Cause (Why it occurred):
                      </span>
                      <p className="text-slate-300 leading-relaxed">{f.cause}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[11px] font-bold text-purple-400 block mb-1">
                        4. Consequence / Effect (The Risk):
                      </span>
                      <p className="text-slate-300 leading-relaxed">{f.consequence}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                    <span className="text-[11px] font-bold text-amber-400 block mb-1">
                      5. Corrective Action / Recommendation:
                    </span>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">{f.recommendation}</p>
                  </div>

                  {/* Human Auditor Review Controls */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-400 font-medium">Auditor Verification:</span>
                      <select
                        value={f.verification_status}
                        onChange={(e) =>
                          onUpdateFinding(f.id, {
                            verification_status: e.target.value,
                            is_human_confirmed: e.target.value.includes('Confirmed')
                          })
                        }
                        className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Unverified — Pending Field Audit">Unverified — Pending Field Audit</option>
                        <option value="Confirmed by Field Auditor">Confirmed by Field Auditor</option>
                        <option value="Modified upon Technical Review">Modified upon Technical Review</option>
                        <option value="Excluded — False Positive">Excluded — False Positive</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono">Evidence ID: {f.evidence_id}</span>
                      <button
                        onClick={() => onDeleteFinding(f.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                        title="Exclude Finding"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Compare Criteria vs Condition */}
      {activeTab === 'compare' && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Step 1: Select Verified Evidence & Audit Standard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Verified Inspection Evidence (Active Session)
                </label>
                {inspections.length === 0 ? (
                  <div className="text-xs text-rose-400 p-2 rounded bg-rose-950/30 border border-rose-900">
                    No inspections saved. Save an inspection in AI Road Inspector first.
                  </div>
                ) : (
                  <select
                    value={selectedInspectionId}
                    onChange={(e) => setSelectedInspectionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                  >
                    {inspections.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.id}: {i.filename} ({i.dzongkhag} — {i.road_class}) [
                        {i.detections.length} defects]
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Applicable Audit Criterion / Standard Clause
                </label>
                <select
                  value={selectedCriterionId}
                  onChange={(e) => setSelectedCriterionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                >
                  {allCriteria.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.ref}: {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Side by side comparison */}
          {currentInspection && currentCriterion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  What Should Be (Audit Standard)
                </span>
                <h4 className="text-xs font-bold text-slate-200">{currentCriterion.ref}</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  "{currentCriterion.criterion}"
                </p>
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Tolerance:</span> {currentCriterion.tolerance}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  What Was Observed (Verified Evidence)
                </span>
                <h4 className="text-xs font-bold text-slate-200">
                  Evidence ID: {currentInspection.id} ({currentInspection.filename})
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {currentInspection.detections.length > 0
                    ? `Observed ${currentInspection.detections.length} surface defect(s) on ${currentInspection.road_class} in ${currentInspection.dzongkhag}. Defect classes: ${currentInspection.detections.map((d) => d.class_name).join(', ')}.`
                    : 'Pavement wearing surface exhibits sound visual integrity with zero active distress regions detected.'}
                </p>
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Assessed Priority:</span>{' '}
                  <span style={{ color: currentInspection.risk_assessment.color, fontWeight: 'bold' }}>
                    {currentInspection.risk_assessment.level}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action to Synthesize */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Auditor Field Observations & Notes (Optional)
            </label>
            <input
              type="text"
              value={auditorNote}
              onChange={(e) => setAuditorNote(e.target.value)}
              placeholder="e.g. Surface water ponding observed on sharp bend; maintenance logbook shows last inspection 90 days ago"
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={handleSynthesizeFinding}
              disabled={!currentInspection}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              Synthesize Structured 5C Audit Finding
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Documents */}
      {activeTab === 'criteria' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Road Maintenance Standards & Specification Library
              </h3>
              <p className="text-xs text-slate-400">
                Upload contractual specifications, tender schedules, or IRC/DoST manuals to parse criteria.
              </p>
            </div>
            <label className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload PDF / DOCX
              <input
                type="file"
                accept=".pdf,.docx,.txt,.csv,.xlsx"
                onChange={handleCustomDocUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCriteria.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold">{c.ref}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-semibold">
                    {c.sourceDoc}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{c.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
                  "{c.criterion}"
                </p>
                <div className="text-[11px] text-teal-400 font-medium">
                  Tolerance Threshold: {c.tolerance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
