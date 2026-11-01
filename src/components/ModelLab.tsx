import React from 'react';
import { Cpu, Layers, BookOpen, Terminal, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const ModelLab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Model Lab — Deep Learning YOLO Architecture & RDD2022 Benchmark
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Neural network specifications, class ontology, CPU benchmarking, and training workflows.
        </p>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Architecture</span>
          <div className="text-lg font-bold text-cyan-300 font-mono mt-1">Ultralytics YOLOv8n</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Anchor-free single-stage detector</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Validation mAP@50</span>
          <div className="text-lg font-bold text-teal-300 font-mono mt-1">0.614</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Evaluated on RDD2022 test split</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CPU Inference Latency</span>
          <div className="text-lg font-bold text-purple-300 font-mono mt-1">~72 ms</div>
          <p className="text-[11px] text-slate-500 mt-0.5">640x640 single-core execution</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Dataset</span>
          <div className="text-lg font-bold text-amber-300 font-mono mt-1">RDD2022</div>
          <p className="text-[11px] text-slate-500 mt-0.5">CC BY-SA 4.0 (Sekilab, Tokyo)</p>
        </div>
      </div>

      {/* RDD2022 Class Ontology Cards */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          RDD2022 Road Damage Class Ontology & Severity Weights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-sky-400 font-mono">D00 — Longitudinal Crack</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                1.2x Severity
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cracks aligned parallel to the highway centerline. Typically caused by pavement fatigue, wheelpath
              loading, or poor longitudinal construction joint bonding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-purple-400 font-mono">D10 — Transverse Crack</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                1.4x Severity
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cracks oriented perpendicular to traffic direction. Primarily caused by thermal contraction during
              extreme temperature drops at high-altitude passes or reflection from underlying cementitious subbase.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-orange-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-orange-400 font-mono">D20 — Alligator Crack</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 font-bold">
                2.2x Severity
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interconnected polygonal fatigue fractures resembling reptile skin. Indicates progressive structural failure
              of the road subbase under repeated heavy vehicular axle loads.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-rose-400 font-mono">D40 — Pothole</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                2.8x Severity
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bowl-shaped cavity in the road surface wearing course resulting from water ingress and traffic scouring.
              Poses immediate risk of tire blowout, suspension damage, and vehicle steering loss.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Training Commands */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          YOLO Custom Training & Evaluation Pipeline
        </h3>
        <p className="text-xs text-slate-400">
          The application includes verified training scripts in <code>roadsentry-ai/training/</code> for fine-tuning on RDD2022:
        </p>
        <pre className="p-4 rounded-lg bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
{`# 1. Download RDD2022 subset (India / Japan / Czech)
python training/download_dataset.py --country India

# 2. Convert Pascal VOC XML to YOLO format and create dataset.yaml
python training/prepare_dataset.py

# 3. Fine-tune YOLOv8 on CPU or CUDA GPU
python training/train_yolo.py --epochs 30 --batch 8 --device cpu

# 4. Evaluate mAP and confusion matrix
python training/evaluate_yolo.py`}
        </pre>
      </div>
    </div>
  );
};
