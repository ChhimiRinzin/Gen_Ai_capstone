import React from 'react';
import {
  Shield,
  Activity,
  Search,
  FileCheck2,
  MapPin,
  BarChart3,
  FileText,
  Bot,
  Cpu,
  Terminal,
  Trash2,
  Settings,
  Download
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  inspectionCount: number;
  findingCount: number;
  criticalCount: number;
  onClearSession: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  inspectionCount,
  findingCount,
  criticalCount,
  onClearSession,
  onOpenSettings
}) => {
  const navItems = [
    { id: 'command_center', label: 'Command Center', icon: Activity },
    { id: 'road_inspector', label: 'AI Road Inspector', icon: Search },
    { id: 'infrastructure_audit', label: 'Infrastructure Audit', icon: FileCheck2 },
    { id: 'hazard_map', label: 'Bhutan Hazard Map', icon: MapPin },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
    { id: 'reports', label: 'AI Reports', icon: FileText },
    { id: 'ai_assistant', label: 'AI Assistant', icon: Bot },
    { id: 'model_lab', label: 'Model Lab', icon: Cpu },
    { id: 'codespaces_hub', label: 'Codespaces Hub', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d162f]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Flag */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <Shield className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-teal-100 to-cyan-400">
                  RoadSentry AI
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold tracking-wider">
                  BHUTAN 🇧🇹
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Intelligent Road Safety & Infrastructure Audit Intelligence
              </p>
            </div>
          </div>

          {/* Session Badges & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-slate-400">Session:</span>
                <span className="font-bold text-teal-300">{inspectionCount} Insp</span>
              </div>
              <span className="text-slate-700">|</span>
              <div>
                <span className="text-slate-400">5C Findings:</span>{' '}
                <span className="font-bold text-purple-300">{findingCount}</span>
              </div>
              {criticalCount > 0 && (
                <>
                  <span className="text-slate-700">|</span>
                  <div className="text-rose-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    {criticalCount} Critical
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onClearSession}
              title="Clear Active Session Data (Strict Zero-Database Security)"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-900/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              title="System Settings, Groq Credentials & Responsible AI"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-lg border border-transparent hover:border-cyan-900/40 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
