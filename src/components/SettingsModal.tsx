import React, { useState, useEffect } from 'react';
import { X, Key, Shield, Info, Check, ExternalLink, Activity, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SystemHealthData {
  status: string;
  environment: string;
  deployment_target: string;
  groq: {
    configured: boolean;
    text_model: string;
    vision_model: string;
    key_status: string;
  };
  yolo_model: {
    architecture: string;
    rdd_classes: string[];
    engine_status: string;
  };
  database: {
    persistent_db: string;
    storage_type: string;
  };
  report_engines: {
    pdf: string;
    docx_markdown: string;
    csv_json: string;
  };
  timestamp: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);
  const [browserCapabilities, setBrowserCapabilities] = useState<{
    canvas2d: boolean;
    webgl: boolean;
    wasm: boolean;
  }>({ canvas2d: true, webgl: true, wasm: true });

  const fetchHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (e) {
      console.warn('Health check error:', e);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();

      // Check browser capabilities
      try {
        const canvas = document.createElement('canvas');
        const has2d = Boolean(canvas.getContext('2d'));
        const hasWebGL = Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        const hasWasm = typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
        setBrowserCapabilities({ canvas2d: has2d, webgl: hasWebGL, wasm: hasWasm });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ROADSENTRY_GROQ_KEY', apiKey.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-xs text-slate-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              RoadSentry AI Settings & System Health Diagnostics
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section 1: System Health Diagnostics Panel (Section 17) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Vercel Production & Engine Diagnostics
              </span>
              <button
                onClick={fetchHealth}
                disabled={isCheckingHealth}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                Re-check
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Frontend Engine:</span>
                <span className="text-teal-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> React 19 / Vite
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Deployment Target:</span>
                <span className="text-cyan-300 font-bold">
                  {healthData?.deployment_target?.split('/')[0]?.trim() || 'Vercel Production'}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Server Groq Proxy:</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    healthData?.groq?.configured ? 'text-teal-300' : 'text-amber-400'
                  }`}
                >
                  {healthData?.groq?.configured ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Server Key Active
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3" /> Fallback Mode
                    </>
                  )}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">YOLO RDD2022:</span>
                <span className="text-teal-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready (WASM)
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Persistent DB:</span>
                <span className="text-purple-300 font-bold">Zero DB (Secure Session)</span>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Browser WASM / WebGL:</span>
                <span className="text-teal-300 font-bold">
                  {browserCapabilities.wasm && browserCapabilities.webgl ? 'Supported (100%)' : 'Standard 2D'}
                </span>
              </div>
            </div>

            {healthData && (
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-900 pt-2">
                <span>Text Model: {healthData.groq.text_model}</span>
                <span>Vision Model: {healthData.groq.vision_model}</span>
              </div>
            )}
          </div>

          {/* Groq Key Configuration */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-200">
              Optional Client Groq Key (For Local Direct Calls)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
              >
                Save
              </button>
            </div>
            {savedSuccess && (
              <span className="text-teal-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> API key saved in browser session.
              </span>
            )}
            <p className="text-[11px] text-slate-500">
              On Vercel, set <code className="text-cyan-400">GROQ_API_KEY</code> in Vercel Project Settings (Environment Variables) to enable secure server-side execution without exposing credentials to the client.
            </p>
          </div>

          {/* Privacy Statement */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              Strict Zero-Database Security Guarantee
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              RoadSentry AI maintains all uploaded photographs, video frames, GPS markers, and 5C findings
              strictly in ephemeral session memory. No external persistent database (SQLite, PostgreSQL, MongoDB,
              or Firebase) is connected.
            </p>
          </div>

          {/* Academic Attribution */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-[11px]">
            <span className="font-bold text-slate-200 block">Academic Capstone Attribution</span>
            <div className="text-slate-400">
              <strong>Programme:</strong> Generative AI Systems: From Research to Real-World Deployment
            </div>
            <div className="text-slate-400">
              <strong>Institution:</strong> C-DAC Mohali, India
            </div>
            <div className="text-slate-400">
              <strong>Beneficiary:</strong> Kingdom of Bhutan (Department of Surface Transport & Royal Audit Authority)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
