import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/CommandCenter';
import { RoadInspector } from './components/RoadInspector';
import { InfrastructureAudit } from './components/InfrastructureAudit';
import { BhutanHazardMap } from './components/BhutanHazardMap';
import { AIAnalytics } from './components/AIAnalytics';
import { AIReports } from './components/AIReports';
import { AIAssistant } from './components/AIAssistant';
import { ModelLab } from './components/ModelLab';
import { CodespacesHub } from './components/CodespacesHub';
import { SettingsModal } from './components/SettingsModal';

import { Inspection, AuditFinding, AuditDocument, ChatMessage } from './types';
import { BHUTAN_TEST_SCENARIOS, DEFAULT_AUDIT_CRITERIA } from './data/bhutanData';
import { calculateRiskScore } from './utils/riskEngine';
import { generate5cFinding } from './utils/auditEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Initial Seed from Bhutan Scenario 1 (Chukha PNH-1 Lifeline Highway)
  const initialInspection: Inspection = {
    id: 'INSP-001',
    filename: BHUTAN_TEST_SCENARIOS[0].filename,
    imageUrl: '',
    dzongkhag: BHUTAN_TEST_SCENARIOS[0].dzongkhag,
    road_class: BHUTAN_TEST_SCENARIOS[0].road_class,
    locality: BHUTAN_TEST_SCENARIOS[0].locality,
    coordinates: {
      lat: BHUTAN_TEST_SCENARIOS[0].lat,
      lon: BHUTAN_TEST_SCENARIOS[0].lon
    },
    detections: BHUTAN_TEST_SCENARIOS[0].ground_truth_detections.map((d, i) => ({
      id: `DET-${i + 1}`,
      class_code: d.class_code,
      class_name: d.class_name,
      confidence: d.confidence,
      bbox: d.bbox,
      area_percentage: d.area_pct,
      area_pixels: Math.round((d.bbox[2] - d.bbox[0]) * (d.bbox[3] - d.bbox[1]))
    })),
    cv_metrics: {
      blur_metric: 248.5,
      is_blurry: false,
      brightness: 112.4,
      contrast: 52.8,
      quality_status: 'Good — Suitable for AI damage audit',
      dimensions: { width: 640, height: 480 }
    },
    risk_assessment: calculateRiskScore(
      BHUTAN_TEST_SCENARIOS[0].ground_truth_detections.map((d, i) => ({
        id: `DET-${i + 1}`,
        class_code: d.class_code,
        class_name: d.class_name,
        confidence: d.confidence,
        bbox: d.bbox,
        area_percentage: d.area_pct,
        area_pixels: 50000
      })),
      BHUTAN_TEST_SCENARIOS[0].road_class,
      BHUTAN_TEST_SCENARIOS[0].dzongkhag,
      BHUTAN_TEST_SCENARIOS[0].is_monsoon,
      BHUTAN_TEST_SCENARIOS[0].drainage_blocked
    ),
    groq_analysis: null,
    is_monsoon: true,
    drainage_blocked: true,
    created_at: new Date().toISOString()
  };

  const initialFinding = generate5cFinding(initialInspection, DEFAULT_AUDIT_CRITERIA[0]);

  // Session State (Zero Persistent Database)
  const [inspections, setInspections] = useState<Inspection[]>([initialInspection]);
  const [findings, setFindings] = useState<AuditFinding[]>([initialFinding]);
  const [documents, setDocuments] = useState<AuditDocument[]>([
    {
      id: 'DOC-01',
      filename: 'DoST-Road-Maintenance-Manual-2023.pdf',
      page_count: 64,
      uploaded_at: new Date().toISOString(),
      size_kb: 1420,
      extracted_criteria: DEFAULT_AUDIT_CRITERIA.slice(0, 2),
      text_preview: 'Department of Surface Transport, Ministry of Infrastructure and Transport, Royal Government of Bhutan standard road maintenance specifications.'
    }
  ]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'MSG-INIT',
      role: 'assistant',
      content: 'Welcome to **RoadSentry AI**. I am your senior infrastructure audit assistant for the Kingdom of Bhutan. Active session contains verified inspection data for Chukha PNH-1 (Gedu-Chuzom highway). You can query road damage severities, evaluate 5C audit criteria, or inspect any image.',
      citations: ['INSP-001', 'DoST-Clause-402.3'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Handlers
  const handleSaveInspection = (newInsp: Inspection) => {
    setInspections((prev) => [newInsp, ...prev.filter((i) => i.id !== newInsp.id)]);
  };

  const handleAddFinding = (newFinding: AuditFinding) => {
    setFindings((prev) => [newFinding, ...prev.filter((f) => f.id !== newFinding.id)]);
  };

  const handleUpdateFinding = (id: string, updated: Partial<AuditFinding>) => {
    setFindings((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };

  const handleDeleteFinding = (id: string) => {
    setFindings((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUploadDocument = (doc: AuditDocument) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleSendMessage = (msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState<boolean>(false);

  const handleClearSession = () => {
    setIsClearConfirmOpen(true);
  };

  const executeClearSession = () => {
    setInspections([]);
    setFindings([]);
    setDocuments([]);
    setChatHistory([]);
    setIsClearConfirmOpen(false);
  };

  const handleLoadScenarioFromDashboard = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setActiveTab('road_inspector');
  };

  const criticalCount = inspections.filter((i) => i.risk_assessment.level === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inspectionCount={inspections.length}
        findingCount={findings.length}
        criticalCount={criticalCount}
        onClearSession={handleClearSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'command_center' && (
          <CommandCenter
            inspections={inspections}
            findings={findings}
            onSelectTab={setActiveTab}
            onLoadScenario={handleLoadScenarioFromDashboard}
          />
        )}

        {activeTab === 'road_inspector' && (
          <RoadInspector
            onSaveInspection={handleSaveInspection}
            activeScenarioId={activeScenarioId}
          />
        )}

        {activeTab === 'infrastructure_audit' && (
          <InfrastructureAudit
            inspections={inspections}
            findings={findings}
            documents={documents}
            onAddFinding={handleAddFinding}
            onUpdateFinding={handleUpdateFinding}
            onDeleteFinding={handleDeleteFinding}
            onUploadDocument={handleUploadDocument}
          />
        )}

        {activeTab === 'hazard_map' && (
          <BhutanHazardMap inspections={inspections} />
        )}

        {activeTab === 'analytics' && (
          <AIAnalytics inspections={inspections} />
        )}

        {activeTab === 'reports' && (
          <AIReports
            inspections={inspections}
            findings={findings}
            documents={documents}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <AIAssistant
            inspections={inspections}
            findings={findings}
            documents={documents}
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'model_lab' && <ModelLab />}

        {activeTab === 'codespaces_hub' && <CodespacesHub />}
      </main>

      <footer className="bg-[#080e1e] border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-400">RoadSentry AI</span> • Kingdom of Bhutan Road Safety & Audit Intelligence
          </div>
          <div>
            Capstone Project • C-DAC Mohali, India • Generative AI Systems: From Research to Real-World Deployment
          </div>
        </div>
      </footer>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* In-App Confirmation Modal (Zero Database Session Reset) */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 text-rose-400">
              Clear Active Session?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              This will clear all in-memory inspections, 5C audit findings, and chat messages for this session.
              No persistent database is modified.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={executeClearSession}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
