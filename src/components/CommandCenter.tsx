import React from 'react';
import {
  Activity,
  AlertTriangle,
  FileCheck2,
  Search,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { Inspection, AuditFinding } from '../types';
import { BHUTAN_TEST_SCENARIOS } from '../data/bhutanData';

interface CommandCenterProps {
  inspections: Inspection[];
  findings: AuditFinding[];
  onSelectTab: (tab: string) => void;
  onLoadScenario: (scenarioId: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  inspections,
  findings,
  onSelectTab,
  onLoadScenario
}) => {
  const totalDetections = inspections.reduce((sum, i) => sum + i.detections.length, 0);
  const criticalCount = inspections.filter((i) => i.risk_assessment.level === 'CRITICAL').length;
  const highCount = inspections.filter((i) => i.risk_assessment.level === 'HIGH').length;

  // Damage distribution
  const damageCounts: Record<string, number> = { D00: 0, D10: 0, D20: 0, D40: 0 };
  inspections.forEach((insp) => {
    insp.detections.forEach((d) => {
      if (damageCounts[d.class_code] !== undefined) {
        damageCounts[d.class_code]++;
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Disclaimer Box */}
      <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold tracking-wide uppercase text-rose-300">
            AI-Assisted Draft Audit Working Paper Notice:
          </span>{' '}
          RoadSentry AI produces preliminary engineering triage indicators and draft 5C observations.
          All findings must undergo on-site physical core verification by certified public auditors and structural engineers.
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Inspections
            </span>
            <Search className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-300">{inspections.length}</span>
            <span className="text-xs text-slate-500">Active session</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              YOLO Detections
            </span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-300">{totalDetections}</span>
            <span className="text-xs text-slate-500">RDD2022 classes</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Critical Hazards
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">{criticalCount}</span>
            <span className="text-xs text-slate-500">Immediate priority</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              5C Audit Findings
            </span>
            <FileCheck2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-300">{findings.length}</span>
            <span className="text-xs text-slate-500">Draft observations</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Damage Distribution & Quick Scenario Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Damage Breakdown */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Road Distress Distribution (RDD2022)
            </h3>
            <span className="text-xs text-slate-400">Total: {totalDetections}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  D00 Longitudinal Crack
                </span>
                <span className="font-bold text-slate-200">{damageCounts.D00}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all"
                  style={{ width: `${totalDetections ? (damageCounts.D00 / totalDetections) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  D10 Transverse Crack
                </span>
                <span className="font-bold text-slate-200">{damageCounts.D10}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all"
                  style={{ width: `${totalDetections ? (damageCounts.D10 / totalDetections) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-orange-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                  D20 Alligator Crack
                </span>
                <span className="font-bold text-slate-200">{damageCounts.D20}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all"
                  style={{ width: `${totalDetections ? (damageCounts.D20 / totalDetections) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  D40 Pothole
                </span>
                <span className="font-bold text-slate-200">{damageCounts.D40}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all"
                  style={{ width: `${totalDetections ? (damageCounts.D40 / totalDetections) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Risk Index: {criticalCount + highCount > 0 ? 'Elevated' : 'Stable'}</span>
            <button
              onClick={() => onSelectTab('analytics')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Bhutan Test Scenario Launcher */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Quick-Start Inspection Scenarios (Kingdom of Bhutan)
              </h3>
              <p className="text-xs text-slate-400">
                Load authentic Bhutan highway inspection scenarios for live international demonstration:
              </p>
            </div>
            <button
              onClick={() => onSelectTab('road_inspector')}
              className="text-xs px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold"
            >
              Upload Custom Image
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BHUTAN_TEST_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-cyan-300">{scenario.dzongkhag} ({scenario.road_class})</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {scenario.ground_truth_detections.map((d) => d.class_code).join(', ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{scenario.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{scenario.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {scenario.lat.toFixed(2)}°N, {scenario.lon.toFixed(2)}°E
                  </span>
                  <button
                    onClick={() => onLoadScenario(scenario.id)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-colors flex items-center gap-1"
                  >
                    Inspect <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engine Readiness & Verification Policy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Computer Vision Triage
          </div>
          <p className="text-slate-400">
            OpenCV Laplacian blur detection, Canny structural edge analysis, and CLAHE surface enhancement active on CPU.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            YOLOv8 RDD2022 Inference
          </div>
          <p className="text-slate-400">
            Fine-tuned neural detector trained on Road Damage Dataset 2022: D00, D10, D20, D40 classes with area metrics.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            5C Audit Framework
          </div>
          <p className="text-slate-400">
            Strict human-in-the-loop review. Unverified causes are labeled to maintain public auditor integrity.
          </p>
        </div>
      </div>
    </div>
  );
};
