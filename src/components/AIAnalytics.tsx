import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Layers, Award, ShieldCheck } from 'lucide-react';
import { Inspection } from '../types';

interface AIAnalyticsProps {
  inspections: Inspection[];
}

export const AIAnalytics: React.FC<AIAnalyticsProps> = ({ inspections }) => {
  const totalDetections = inspections.reduce((sum, i) => sum + i.detections.length, 0);

  // Damage class counts
  const damageCounts: Record<string, number> = { D00: 0, D10: 0, D20: 0, D40: 0 };
  let totalConfidence = 0;
  let confCount = 0;

  inspections.forEach((insp) => {
    insp.detections.forEach((d) => {
      damageCounts[d.class_code] = (damageCounts[d.class_code] || 0) + 1;
      totalConfidence += d.confidence;
      confCount++;
    });
  });

  const avgConfidence = confCount > 0 ? (totalConfidence / confCount) * 100 : 0;

  // Dzongkhag defect map
  const dzongkhagCounts: Record<string, number> = {};
  inspections.forEach((i) => {
    dzongkhagCounts[i.dzongkhag] = (dzongkhagCounts[i.dzongkhag] || 0) + i.detections.length;
  });

  // Risk counts
  const riskCounts = {
    CRITICAL: inspections.filter((i) => i.risk_assessment.level === 'CRITICAL').length,
    HIGH: inspections.filter((i) => i.risk_assessment.level === 'HIGH').length,
    MEDIUM: inspections.filter((i) => i.risk_assessment.level === 'MEDIUM').length,
    LOW: inspections.filter((i) => i.risk_assessment.level === 'LOW').length,
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          AI Analytics & Road Maintenance Intelligence
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Empirical session aggregations, confidence metrics, and defect distributions across Bhutan's road network.
        </p>
      </div>

      {/* Top 3 Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Mean YOLO Confidence</span>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
            {avgConfidence.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across all verified bounding boxes</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Defect Density Ratio</span>
          <div className="text-2xl font-extrabold text-teal-300 font-mono mt-1">
            {inspections.length > 0 ? (totalDetections / inspections.length).toFixed(1) : '0.0'}{' '}
            <span className="text-xs font-normal text-slate-400">per inspection</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Mean defect clustering frequency</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Critical Corridor Triage</span>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
            {riskCounts.CRITICAL + riskCounts.HIGH}{' '}
            <span className="text-xs font-normal text-slate-400">high-priority sections</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requiring immediate audit intervention</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Road Damage Classes Breakdown */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Road Distress Categories (RDD2022 Benchmark)
          </h3>

          <div className="space-y-3">
            {[
              { code: 'D00', name: 'Longitudinal Crack', count: damageCounts.D00, color: 'bg-sky-400', weight: '1.2x' },
              { code: 'D10', name: 'Transverse Crack', count: damageCounts.D10, color: 'bg-purple-400', weight: '1.4x' },
              { code: 'D20', name: 'Alligator Crack', count: damageCounts.D20, color: 'bg-orange-400', weight: '2.2x' },
              { code: 'D40', name: 'Pothole', count: damageCounts.D40, color: 'bg-rose-500', weight: '2.8x' },
            ].map((item) => (
              <div key={item.code} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    {item.code} — {item.name}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">({item.weight} severity)</span>
                  </span>
                  <span className="font-bold font-mono text-slate-100">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${totalDetections ? (item.count / totalDetections) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Risk Distribution */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Prioritization Tier Distribution
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/60">
              <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider block">Critical</span>
              <span className="text-2xl font-bold font-mono text-rose-400">{riskCounts.CRITICAL}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Score: 75–100</span>
            </div>
            <div className="p-3 rounded-lg bg-orange-950/30 border border-orange-900/60">
              <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">High</span>
              <span className="text-2xl font-bold font-mono text-orange-400">{riskCounts.HIGH}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Score: 50–74</span>
            </div>
            <div className="p-3 rounded-lg bg-yellow-950/30 border border-yellow-900/60">
              <span className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider block">Medium</span>
              <span className="text-2xl font-bold font-mono text-yellow-400">{riskCounts.MEDIUM}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Score: 25–49</span>
            </div>
            <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-900/60">
              <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider block">Low</span>
              <span className="text-2xl font-bold font-mono text-teal-400">{riskCounts.LOW}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Score: 0–24</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Prioritization scores combine physical defect severity, pavement frame area percentage, road classification hierarchy (PNH/SNH/UR), and environmental monsoon saturation factors.
          </p>
        </div>
      </div>

      {/* Dzongkhag Defect Ranking */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Defect Counts by Dzongkhag
        </h3>
        {Object.keys(dzongkhagCounts).length === 0 ? (
          <div className="text-xs text-slate-400 py-3 text-center">No inspections recorded yet in this session.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(dzongkhagCounts).map(([dz, count]) => (
              <div key={dz} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-300 font-bold block">{dz}</span>
                <span className="text-lg font-mono text-cyan-300 font-bold">{count} defects</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
