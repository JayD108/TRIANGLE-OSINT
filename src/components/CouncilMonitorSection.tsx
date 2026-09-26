import React, { useState } from 'react';
import { COUNCIL_AGENTS } from '../data/mockIntelligence';
import { AgentProfile } from '../types/osint';
import { playCyberClick, playAlertChime, playRadarPing } from '../lib/soundFx';
import { EncryptedText } from './ui/encrypted-text';
import { Cpu, Terminal, Shield, Globe2, DollarSign, CheckCircle2, ChevronRight, Zap, RefreshCw, Send, AlertTriangle } from 'lucide-react';

export function CouncilMonitorSection() {
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile>(COUNCIL_AGENTS[0]);
  const [queryInput, setQueryInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeDomainFilter, setActiveDomainFilter] = useState<'all' | 'defense' | 'geopolitics' | 'finance' | 'verification' | 'supervisor'>('all');

  const presetQueries = [
    "Assess impact of Red Sea tanker reroutes on Allied refinery crude discounts and Navy escort capacity.",
    "Evaluate Chinese underwater acoustic survey vessels operating near Andaman & Nicobar Sea lanes.",
    "Analyze Project Kusha LR-SAM integration with S-400 batteries along the Northern Himalayan frontier.",
    "Bilateral rupee-dirham clearing resilience under hypothetical Strait of Hormuz naval interdiction.",
  ];

  const handleRunQuery = (queryText: string) => {
    if (!queryText.trim()) return;
    playAlertChime();
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      playRadarPing();
      // Select supervisor to display unified response
      const supervisor = COUNCIL_AGENTS.find(a => a.domain === 'supervisor') || COUNCIL_AGENTS[10];
      setSelectedAgent(supervisor);
    }, 1600);
  };

  const filteredAgents = COUNCIL_AGENTS.filter(
    a => activeDomainFilter === 'all' || a.domain === activeDomainFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a2a3a] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
            <Cpu className="h-3.5 w-3.5 text-[#00ff88]" />
            <span>11-AGENT INTELLIGENCE COUNCIL · ARCHITECTURAL REASONING CORE</span>
          </div>
          <h2 className="mt-1 font-heading text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            <EncryptedText
              key="council-console-title"
              text="THE INTELLIGENCE COUNCIL CONSOLE"
              encryptedClassName="text-[#00ff88]/40"
              revealedClassName="text-white"
              revealDelayMs={30}
            />
          </h2>
          <p className="mt-1 text-xs md:text-sm font-mono text-[#9ca3af] max-w-2xl">
            A synchronized matrix of 9 domain specialists (Defense, Geopolitics, Finance), 1 Adversarial Verification Agent, and 1 Council Supervisor producing structured OSINT intelligence.
          </p>
        </div>

        {/* Council Status Matrix */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#00ff88] bg-[#12121a] px-3 py-2 border border-[#2a2a3a] cyber-chamfer-sm">
          <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-ping" />
          <span>ALL 11 NODES SYNCHRONIZED</span>
        </div>
      </div>

      {/* Interactive Query Terminal Bar */}
      <div className="bg-[#12121a] border border-[#2a2a3a] p-4 cyber-chamfer relative space-y-3">
        <div className="tech-corner-tl" />
        <div className="tech-corner-tr" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff]">
            <Terminal className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">COMMAND PROMPT // SUBMIT OSINT INQUIRY TO COUNCIL</span>
          </div>
          <span className="text-[10px] font-mono text-[#6b7280]">
            ROUTING TO: 3×DEFENSE + 3×GEO + 3×FINANCE + VERIFICATION + SUPERVISOR
          </span>
        </div>

        {/* Input Field with Cyberpunk > prefix */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[#00ff88] font-bold select-none">
              &gt;
            </span>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunQuery(queryInput)}
              placeholder="Enter strategic question or paste headline to initiate 11-agent synthesis..."
              className="w-full bg-[#0a0a0f] border border-[#2a2a3a] pl-8 pr-4 py-2.5 font-mono text-xs md:text-sm text-[#00ff88] placeholder-[#4b5563] focus:border-[#00ff88] focus:shadow-[0_0_10px_rgba(0,255,136,0.3)] focus:outline-none transition-all cyber-chamfer-sm"
            />
          </div>
          <button
            onClick={() => handleRunQuery(queryInput)}
            disabled={isSynthesizing}
            className="px-5 py-2.5 bg-[#00ff88] text-[#0a0a0f] font-mono text-xs font-bold uppercase tracking-wider cyber-chamfer-sm hover:bg-white hover:shadow-[0_0_12px_#00ff88] disabled:opacity-50 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>SYNTHESIZING...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>ENGAGE COUNCIL</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Queries Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-mono uppercase text-[#6b7280] shrink-0">
            PROMPT TEMPLATES:
          </span>
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQueryInput(pq);
                handleRunQuery(pq);
              }}
              className="text-[10px] font-mono px-2 py-0.5 bg-[#0a0a0f] text-[#9ca3af] hover:text-[#00ff88] hover:border-[#00ff88] border border-[#2a2a3a] whitespace-nowrap shrink-0 cyber-chamfer-sm transition-colors"
            >
              {pq.slice(0, 48)}...
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Agent Directory / Nodes + Active Deliberation Terminal (Full Width) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        
        {/* Left Column: 11 Council Agents Matrix */}
        <div className="xl:col-span-7 space-y-4">
          
          {/* Domain Filter Tabs */}
          <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-2">
            <span className="text-xs font-mono uppercase text-[#6b7280]">COUNCIL COMPOSITION (11 AGENTS)</span>
            <div className="flex items-center gap-1">
              {(['all', 'defense', 'geopolitics', 'finance', 'verification', 'supervisor'] as const).map((dom) => (
                <button
                  key={dom}
                  onClick={() => {
                    playCyberClick(1100);
                    setActiveDomainFilter(dom);
                  }}
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 cyber-chamfer-sm border transition-colors ${
                    activeDomainFilter === dom
                      ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                      : 'border-[#2a2a3a] text-[#6b7280] hover:text-white'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Agents List / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAgents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              const isDefense = agent.domain === 'defense';
              const isGeo = agent.domain === 'geopolitics';
              const isFin = agent.domain === 'finance';
              const isVer = agent.domain === 'verification';
              const isSup = agent.domain === 'supervisor';

              const accentBorder = isDefense
                ? 'hover:border-[#00ff88]'
                : isGeo
                ? 'hover:border-[#ff00ff]'
                : isFin
                ? 'hover:border-[#00d4ff]'
                : isVer
                ? 'hover:border-[#ff3366]'
                : 'hover:border-[#ffffff]';

              const badgeColor = isDefense
                ? 'text-[#00ff88] border-[#00ff88]/40 bg-[#00ff88]/10'
                : isGeo
                ? 'text-[#ff00ff] border-[#ff00ff]/40 bg-[#ff00ff]/10'
                : isFin
                ? 'text-[#00d4ff] border-[#00d4ff]/40 bg-[#00d4ff]/10'
                : isVer
                ? 'text-[#ff3366] border-[#ff3366]/40 bg-[#ff3366]/10'
                : 'text-[#e0e0e0] border-white/40 bg-white/10';

              return (
                <div
                  key={agent.id}
                  onClick={() => {
                    playCyberClick(1200);
                    setSelectedAgent(agent);
                  }}
                  className={`cursor-pointer p-3.5 bg-[#12121a] border transition-all duration-200 cyber-chamfer-sm relative ${accentBorder} ${
                    isSelected
                      ? 'border-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.25)] bg-[#171722]'
                      : 'border-[#2a2a3a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${badgeColor} cyber-chamfer-sm`}>
                      {agent.code}
                    </span>
                    <span className="text-[10px] font-mono text-[#6b7280]">
                      CONFIDENCE: {agent.confidenceScore}%
                    </span>
                  </div>

                  <h4 className="mt-2 font-heading text-sm font-bold text-white tracking-wide truncate">
                    {agent.name}
                  </h4>

                  <p className="mt-1 text-[11px] font-mono text-[#9ca3af] line-clamp-2 leading-relaxed">
                    {agent.role}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#1c1c2e] pt-2 text-[10px] font-mono">
                    <span className="text-[#6b7280] uppercase">STATUS: {agent.status}</span>
                    <span className="text-[#00ff88] group-hover:translate-x-1 transition-transform flex items-center">
                      INSPECT &gt;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Agent Deep-Dive & Reasoning Output */}
        <div className="xl:col-span-5 bg-[#12121a] border border-[#2a2a3a] p-5 cyber-chamfer relative flex flex-col justify-between">
          <div className="tech-corner-tl" />
          <div className="tech-corner-tr" />
          <div className="tech-corner-bl" />
          <div className="tech-corner-br" />

          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#00ff88] block">
                  ACTIVE ANALYTICAL NODE
                </span>
                <h3 className="font-heading text-lg font-bold text-white">
                  {selectedAgent.name}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#00d4ff] px-2 py-0.5 bg-[#0a0a0f] border border-[#00d4ff]/40 cyber-chamfer-sm">
                NODE [{selectedAgent.code}]
              </span>
            </div>

            {/* Core Domain Question */}
            <div className="bg-[#0a0a0f] p-3 border-l-2 border-[#00d4ff] cyber-chamfer-sm">
              <span className="text-[10px] font-mono uppercase text-[#00d4ff] block mb-1">
                GOVERNING INQUIRY LENS
              </span>
              <p className="font-mono text-xs text-[#e0e0e0] italic">
                "{selectedAgent.coreQuestion}"
              </p>
            </div>

            {/* Current Focus Area */}
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6b7280] block mb-1">
                CURRENT SURVEILLANCE FOCUS
              </span>
              <p className="font-mono text-xs text-[#d1d5db] bg-[#1c1c2e] p-2.5 border border-[#2a2a3a] cyber-chamfer-sm">
                {selectedAgent.currentFocus}
              </p>
            </div>

            {/* Live Output Snippet / Analytical Output */}
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6b7280] block mb-1 flex items-center justify-between">
                <span>RECENT TELEMETRY / OUTPUT STREAM</span>
                <span className="text-[#00ff88] animate-pulse">● LIVE BUFFER</span>
              </span>
              <div className="font-mono text-xs text-[#00ff88] bg-[#0a0a0f] p-3.5 border border-[#2a2a3a] cyber-chamfer-sm leading-relaxed">
                &gt; {selectedAgent.recentOutputSnippet}
              </div>
            </div>

            {/* Verification & Uncertainty Rigor Notice */}
            {selectedAgent.domain === 'verification' && (
              <div className="p-3 bg-[#ff3366]/10 border border-[#ff3366]/40 cyber-chamfer-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ff3366] font-bold uppercase">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>ADVERSARIAL CHALLENGE MANDATE</span>
                </div>
                <p className="text-[11px] font-mono text-[#d1d5db]">
                  This agent intentionally rejects claims with single-source origins, highlights contradictory casualty figures, and penalizes uncorroborated social media wires.
                </p>
              </div>
            )}

            {selectedAgent.domain === 'supervisor' && (
              <div className="p-3 bg-[#00ff88]/10 border border-[#00ff88]/40 cyber-chamfer-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#00ff88] font-bold uppercase">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>SUPREME INTEGRATION & UNCERTAINTY ARBITER</span>
                </div>
                <p className="text-[11px] font-mono text-[#d1d5db]">
                  Combines outputs from DEF-01..03, GEO-01..03, and FIN-01..03 while preserving gaps where evidence is inconclusive. Never forces artificial certainty.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#2a2a3a] mt-4 flex items-center justify-between text-xs font-mono">
            <span className="text-[#6b7280]">CONFIDENCE CALIBRATION:</span>
            <span className="text-[#00ff88] font-bold">{selectedAgent.confidenceScore}% RIGOR SCORE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
