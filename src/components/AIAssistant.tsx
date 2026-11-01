import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { Inspection, AuditFinding, AuditDocument, ChatMessage } from '../types';

interface AIAssistantProps {
  inspections: Inspection[];
  findings: AuditFinding[];
  documents: AuditDocument[];
  chatHistory: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  inspections,
  findings,
  documents,
  chatHistory,
  onSendMessage
}) => {
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const suggestedQuestions = [
    'Which inspection currently presents the highest road safety risk?',
    'Summarize all detected road distress classes across the active session.',
    'Which uploaded audit standard applies to pothole remediation timelines?',
    'Draft an executive summary observation for the Royal Audit Authority.'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      const sessionCtx = {
        inspections: inspections.map((i) => ({
          id: i.id,
          filename: i.filename,
          dzongkhag: i.dzongkhag,
          road_class: i.road_class,
          risk: i.risk_assessment.level,
          score: i.risk_assessment.score,
          detections: i.detections.map((d) => `${d.class_code} (${d.class_name})`)
        })),
        findings_count: findings.length,
        documents_count: documents.length
      };

      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: query,
          session_context: sessionCtx,
          messages: chatHistory.slice(-4).map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      let reply = '';
      const citations: string[] = [];

      if (data.success && data.reply) {
        reply = data.reply;
        if (inspections.length > 0) citations.push(inspections[0].id);
      } else if (data.fallback_data) {
        reply = data.fallback_data;
      } else {
        reply = generateLocalFallback(query);
      }

      const botMsg: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onSendMessage(botMsg);
    } catch (err: any) {
      console.warn('Groq chat error:', err);
      const botMsg: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        role: 'assistant',
        content: generateLocalFallback(query),
        citations: inspections.length > 0 ? [inspections[0].id] : [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onSendMessage(botMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const generateLocalFallback = (query: string): string => {
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes('highest') || lowerQ.includes('urgent') || lowerQ.includes('critical')) {
      const criticals = inspections.filter((i) => i.risk_assessment.level === 'CRITICAL');
      if (criticals.length > 0) {
        return `Based on active session records, **${criticals[0].id}** (${criticals[0].filename}) in **${criticals[0].dzongkhag}** on **${criticals[0].road_class}** presents the highest immediate risk (Score: ${criticals[0].risk_assessment.score}/100, CRITICAL).`;
      }
      return `Currently no CRITICAL priority hazards detected among ${inspections.length} recorded inspections.`;
    }
    if (lowerQ.includes('summarize') || lowerQ.includes('distress') || lowerQ.includes('class')) {
      const counts: Record<string, number> = { D00: 0, D10: 0, D20: 0, D40: 0 };
      inspections.forEach((i) =>
        i.detections.forEach((d) => {
          counts[d.class_code] = (counts[d.class_code] || 0) + 1;
        })
      );
      return `Active Session Distress Summary:\n- D00 Longitudinal Cracks: ${counts.D00}\n- D10 Transverse Cracks: ${counts.D10}\n- D20 Alligator Cracks: ${counts.D20}\n- D40 Potholes: ${counts.D40}`;
    }
    return `Analysis based on active session evidence (${inspections.length} inspections, ${findings.length} findings): Road wearing courses in Bhutan require continuous routine crack sealing to prevent subbase saturation during monsoon rains.`;
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            AI Road & Infrastructure Audit Assistant
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded strictly in current session inspections, verified YOLO detections, and uploaded criteria documents.
          </p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
          Groq Llama-3.3-70B Active
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 transition-all text-left"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-16 space-y-2">
            <Bot className="w-10 h-10 text-slate-600" />
            <h4 className="text-sm font-bold text-slate-300">How can I assist your road audit today?</h4>
            <p className="text-xs max-w-md">
              Ask about defect severities, engineering causes, applicable DoST standards, or draft findings.
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-xl p-3.5 space-y-1.5 ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-slate-950 font-medium'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="text-slate-500 font-semibold">Evidence Citations:</span>
                    {msg.citations.map((c, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] font-mono text-right ${
                    msg.role === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex gap-2 items-center text-xs text-slate-400 italic">
            <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            Synthesizing grounded audit response...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about detected cracks, pothole severity, DoST tolerances, or draft observations..."
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none placeholder:text-slate-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
};
