import React, { useState } from 'react';
import { INTELLIGENCE_REPORTS } from '../data/mockIntelligence';
import { IntelligenceReport, DomainCategory } from '../types/osint';
import { playCyberClick } from '../lib/soundFx';
import { EncryptedText } from './ui/encrypted-text';
import { FileText, Shield, Globe, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Copy, Check, Filter } from 'lucide-react';

interface IntelligenceReportsSectionProps {
  initialReportId?: string;
}

export function IntelligenceReportsSection({ initialReportId }: IntelligenceReportsSectionProps) {
  const [selectedReport, setSelectedReport] = useState<IntelligenceReport>(() => {
    if (initialReportId) {
      const found = INTELLIGENCE_REPORTS.find(r => r.hotspotId === initialReportId || r.id === initialReportId);
      if (found) return found;
    }
    return INTELLIGENCE_REPORTS[0];
  });

  const [activeDomainFilter, setActiveDomainFilter] = useState<'all' | DomainCategory>('all');
  const [copied, setCopied] = useState(false);

  const filteredReports = INTELLIGENCE_REPORTS.filter(
    r => activeDomainFilter === 'all' || r.leadDomain === activeDomainFilter
  );

  const handleCopySummary = () => {
    playCyberClick(1400);
    const summaryText = `[TRIANGLE OSINT BRIEF] ${selectedReport.title}\nWHAT HAPPENED: ${selectedReport.whatHappened.event}\nWHY IT MATTERS (INDIA): ${selectedReport.whyItMatters.globalStrategicPerspective}\nWHAT CHANGED: ${selectedReport.whatChanged.deltaItems.join('; ')}\nCONFIDENCE: ${selectedReport.verificationData.confidenceLevel}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a2a3a] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
            <FileText className="h-3.5 w-3.5 text-[#00ff88]" />
            <span>TRIANGLE OSINT INTELLIGENCE STANDARD · 6-PILLAR ASSESSMENT</span>
          </div>
          <h2 className="mt-1 font-heading text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            <EncryptedText
              key="reports-header-title"
              text="STRATEGIC INTELLIGENCE REPORTS"
              encryptedClassName="text-[#00ff88]/40"
              revealedClassName="text-white"
              revealDelayMs={30}
            />
          </h2>
          <p className="mt-1 text-xs md:text-sm font-mono text-[#9ca3af] max-w-2xl">
            Transforming disjointed open-source reporting into structured comprehension: What Happened, Why It Matters, What Changed, What Is Connected, What Could Happen Next, and Preserved Uncertainties.
          </p>
        </div>

        {/* Copy Brief Action */}
        <button
          onClick={handleCopySummary}
          className="flex items-center gap-2 px-3 py-2 bg-[#12121a] border border-[#2a2a3a] text-xs font-mono text-[#00ff88] hover:border-[#00ff88] cyber-chamfer-sm transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "COPIED TO CLIPBOARD" : "EXPORT OSINT EXECUTIVE BRIEF"}</span>
        </button>
      </div>

      {/* Report Selector Tabs / Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12121a] p-3 border border-[#2a2a3a] cyber-chamfer-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono uppercase text-[#6b7280] shrink-0">DOSSIERS:</span>
          {filteredReports.map((report) => {
            const isSelected = selectedReport.id === report.id;
            return (
              <button
                key={report.id}
                onClick={() => {
                  playCyberClick(1200);
                  setSelectedReport(report);
                }}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap cyber-chamfer-sm border transition-all ${
                  isSelected
                    ? 'border-[#00ff88] bg-[#00ff88]/20 text-[#00ff88] font-bold shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                    : 'border-[#2a2a3a] bg-[#0a0a0f] text-[#9ca3af] hover:text-white'
                }`}
              >
                {report.title.split(':')[0]}
              </button>
            );
          })}
        </div>

        {/* Lead Domain Filters */}
        <div className="flex items-center gap-1">
          {(['all', 'defense', 'geopolitics', 'finance'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playCyberClick(1100);
                setActiveDomainFilter(cat);
              }}
              className={`text-[10px] font-mono uppercase px-2 py-1 cyber-chamfer-sm border ${
                activeDomainFilter === cat
                  ? 'border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10'
                  : 'border-[#2a2a3a] text-[#6b7280] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Report Document View (The 6-Pillar TRIANGLE Standard) */}
      <div className="bg-[#12121a] border border-[#2a2a3a] p-6 cyber-chamfer relative space-y-8">
        <div className="tech-corner-tl" />
        <div className="tech-corner-tr" />
        <div className="tech-corner-bl" />
        <div className="tech-corner-br" />

        {/* Document Header Banner */}
        <div className="border-b border-[#2a2a3a] pb-6 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#00d4ff]">
            <span>REPORT REF: TRIANGLE-INTEL-{selectedReport.id.toUpperCase()}</span>
            <span>PUBLISHED: {selectedReport.timestamp}</span>
            <span className="px-2 py-0.5 border border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10 cyber-chamfer-sm uppercase">
              CONFIDENCE: {selectedReport.verificationData.confidenceLevel}
            </span>
          </div>
          <h3 className="font-heading text-xl md:text-2xl font-black uppercase text-white tracking-wide">
            {selectedReport.title}
          </h3>
        </div>

        {/* Pillar 1: WHAT HAPPENED? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88] font-bold uppercase tracking-widest border-b border-[#1c1c2e] pb-1">
            <span className="text-white bg-[#00ff88]/20 px-2 py-0.5 border border-[#00ff88]/40">PILLAR 01</span>
            <span>WHAT HAPPENED? (FACTUAL GROUNDING)</span>
          </div>
          <p className="font-mono text-sm text-[#e0e0e0] leading-relaxed bg-[#0a0a0f] p-4 border border-[#2a2a3a] cyber-chamfer-sm">
            {selectedReport.whatHappened.event}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs pt-1">
            <div className="bg-[#1c1c2e] p-3 border border-[#2a2a3a] cyber-chamfer-sm">
              <span className="text-[10px] text-[#6b7280] uppercase block">ENTITIES INVOLVED</span>
              <span className="text-[#00d4ff] font-semibold">{selectedReport.whatHappened.who.join(' · ')}</span>
            </div>
            <div className="bg-[#1c1c2e] p-3 border border-[#2a2a3a] cyber-chamfer-sm">
              <span className="text-[10px] text-[#6b7280] uppercase block">THEATER / LOCATION</span>
              <span className="text-[#00ff88] font-semibold">{selectedReport.whatHappened.where}</span>
            </div>
            <div className="bg-[#1c1c2e] p-3 border border-[#2a2a3a] cyber-chamfer-sm">
              <span className="text-[10px] text-[#6b7280] uppercase block">OBSERVED TIMEFRAME</span>
              <span className="text-white font-semibold">{selectedReport.whatHappened.when}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div className="p-3 bg-[#00ff88]/5 border border-[#00ff88]/30 cyber-chamfer-sm">
              <span className="text-[10px] uppercase text-[#00ff88] block font-bold mb-1">CONFIRMED EVIDENCE</span>
              <p className="text-[#d1d5db]">{selectedReport.whatHappened.confirmed}</p>
            </div>
            <div className="p-3 bg-[#ff3366]/5 border border-[#ff3366]/30 cyber-chamfer-sm">
              <span className="text-[10px] uppercase text-[#ff3366] block font-bold mb-1">UNCLEAR / UNVERIFIED</span>
              <p className="text-[#d1d5db]">{selectedReport.whatHappened.unclear}</p>
            </div>
          </div>
        </div>

        {/* Pillar 2: WHY IT MATTERS? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] font-bold uppercase tracking-widest border-b border-[#1c1c2e] pb-1">
            <span className="text-white bg-[#00d4ff]/20 px-2 py-0.5 border border-[#00d4ff]/40">PILLAR 02</span>
            <span>WHY IT MATTERS? (MULTI-DOMAIN STRATEGIC RELEVANCE)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0a0a0f] border-l-2 border-[#00ff88] border-t border-r border-b border-[#2a2a3a] cyber-chamfer-sm space-y-1">
              <span className="text-xs font-mono text-[#00ff88] font-bold uppercase flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>Defense Perspective</span>
              </span>
              <p className="font-mono text-xs text-[#9ca3af] leading-relaxed">
                {selectedReport.whyItMatters.defensePerspective}
              </p>
            </div>

            <div className="p-4 bg-[#0a0a0f] border-l-2 border-[#ff00ff] border-t border-r border-b border-[#2a2a3a] cyber-chamfer-sm space-y-1">
              <span className="text-xs font-mono text-[#ff00ff] font-bold uppercase flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span>Geopolitical Perspective</span>
              </span>
              <p className="font-mono text-xs text-[#9ca3af] leading-relaxed">
                {selectedReport.whyItMatters.geopoliticalPerspective}
              </p>
            </div>

            <div className="p-4 bg-[#0a0a0f] border-l-2 border-[#00d4ff] border-t border-r border-b border-[#2a2a3a] cyber-chamfer-sm space-y-1">
              <span className="text-xs font-mono text-[#00d4ff] font-bold uppercase flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Economic & Financial Perspective</span>
              </span>
              <p className="font-mono text-xs text-[#9ca3af] leading-relaxed">
                {selectedReport.whyItMatters.economicPerspective}
              </p>
            </div>

            <div className="p-4 bg-[#0a0a0f] border-2 border-[#00ff88] cyber-chamfer-sm space-y-1 shadow-[0_0_12px_rgba(0,255,136,0.15)]">
              <span className="text-xs font-mono text-[#00ff88] font-bold uppercase flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#00ff88]" />
                <span>INDIA STRATEGIC LENS (PRIMARY FOCUS)</span>
              </span>
              <p className="font-mono text-xs text-[#ffffff] font-medium leading-relaxed">
                {selectedReport.whyItMatters.globalStrategicPerspective}
              </p>
            </div>
          </div>
        </div>

        {/* Pillar 3: WHAT CHANGED? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff00ff] font-bold uppercase tracking-widest border-b border-[#1c1c2e] pb-1">
            <span className="text-white bg-[#ff00ff]/20 px-2 py-0.5 border border-[#ff00ff]/40">PILLAR 03</span>
            <span>WHAT CHANGED? (TEMPORAL DELTA ANALYSIS)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0a0a0f] border border-[#2a2a3a] cyber-chamfer-sm space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#6b7280]">HISTORICAL BASELINE</span>
              <p className="font-mono text-xs text-[#9ca3af]">{selectedReport.whatChanged.baseline}</p>
            </div>

            <div className="p-4 bg-[#1c1c2e] border border-[#00ff88]/40 cyber-chamfer-sm space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#00ff88] font-bold">CURRENT OPERATIONAL STATUS</span>
              <p className="font-mono text-xs text-white">{selectedReport.whatChanged.current}</p>
            </div>
          </div>

          <div className="bg-[#0a0a0f] p-3 border border-[#2a2a3a] cyber-chamfer-sm space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#6b7280]">MEASURABLE DELTAS & UPGRADES</span>
            {selectedReport.whatChanged.deltaItems.map((delta, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
                <span>&gt;</span>
                <span>{delta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 4: WHAT IS CONNECTED? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] font-bold uppercase tracking-widest border-b border-[#1c1c2e] pb-1">
            <span className="text-white bg-[#00d4ff]/20 px-2 py-0.5 border border-[#00d4ff]/40">PILLAR 04</span>
            <span>WHAT IS CONNECTED? (CROSS-DOMAIN CORRELATION)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#0a0a0f] p-3 border border-[#2a2a3a] cyber-chamfer-sm">
              <span className="text-[10px] text-[#6b7280] uppercase block mb-1">CONNECTED HOTSPOTS</span>
              <div className="space-y-1">
                {selectedReport.whatIsConnected.connectedHotspots.map((hs, i) => (
                  <span key={i} className="inline-block mr-1 text-[11px] text-[#00d4ff] bg-[#12121a] px-2 py-0.5 border border-[#2a2a3a]">
                    {hs}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#0a0a0f] p-3 border border-[#2a2a3a] cyber-chamfer-sm">
              <span className="text-[10px] text-[#6b7280] uppercase block mb-1">RELATED TECH & ACCORDS</span>
              <div className="space-y-1">
                {selectedReport.whatIsConnected.relatedAgreementsOrTech.map((tech, i) => (
                  <span key={i} className="inline-block mr-1 text-[11px] text-[#00ff88] bg-[#12121a] px-2 py-0.5 border border-[#2a2a3a]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#0a0a0f] p-3 border border-[#2a2a3a] cyber-chamfer-sm">
              <span className="text-[10px] text-[#6b7280] uppercase block mb-1">GEOPOLITICAL ECHOES</span>
              <p className="text-[#d1d5db] leading-relaxed text-[11px]">
                {selectedReport.whatIsConnected.geopoliticalEchoes}
              </p>
            </div>
          </div>
        </div>

        {/* Pillar 5: WHAT COULD DEVELOP NEXT? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88] font-bold uppercase tracking-widest border-b border-[#1c1c2e] pb-1">
            <span className="text-white bg-[#00ff88]/20 px-2 py-0.5 border border-[#00ff88]/40">PILLAR 05</span>
            <span>WHAT COULD DEVELOP NEXT? (SCENARIOS & SIGNALS)</span>
          </div>

          <div className="p-4 bg-[#0a0a0f] border border-[#2a2a3a] cyber-chamfer-sm space-y-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#00ff88] font-bold block mb-1">
                HIGH-PLAUSIBILITY SCENARIO
              </span>
              <p className="font-mono text-xs text-[#e0e0e0] leading-relaxed">
                {selectedReport.whatCouldHappenNext.likelyScenario}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1c1c2e] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#6b7280] block">
                INDICATORS TO WATCH (EARLY WARNING SIGNALS)
              </span>
              {selectedReport.whatCouldHappenNext.indicatorsToWatch.map((ind, i) => (
                <div key={i} className="text-xs font-mono text-[#00d4ff] flex items-center gap-2">
                  <span>●</span>
                  <span>{ind}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1c1c2e]">
              <span className="text-[10px] font-mono uppercase text-[#ff3366] block">
                CATALYTIC TRIGGER CONDITIONS
              </span>
              <p className="font-mono text-xs text-[#d1d5db]">
                {selectedReport.whatCouldHappenNext.triggerConditions}
              </p>
            </div>
          </div>
        </div>

        {/* Pillar 6: EVIDENCE, VERIFICATION & PRESERVED UNCERTAINTIES */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff3366] font-bold uppercase tracking-widest border-b border-[#1c1c2e] pb-1">
            <span className="text-white bg-[#ff3366]/20 px-2 py-0.5 border border-[#ff3366]/40">PILLAR 06</span>
            <span>EVIDENCE RIGOR & PRESERVED UNCERTAINTY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Verification Stats */}
            <div className="p-4 bg-[#0a0a0f] border border-[#2a2a3a] cyber-chamfer-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#6b7280] uppercase">PRIMARY OSINT SOURCES:</span>
                <span className="text-[#00ff88] font-bold">{selectedReport.verificationData.primarySourcesCount} VERIFIED</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#6b7280] uppercase">CIRCULAR / REPEATING WIRES:</span>
                <span className="text-[#00d4ff] font-bold">{selectedReport.verificationData.secondaryRepeatingCount} FILTERED</span>
              </div>
              <p className="text-[11px] font-mono text-[#9ca3af] pt-1 leading-relaxed border-t border-[#1c1c2e]">
                {selectedReport.verificationData.verificationNotes}
              </p>
            </div>

            {/* Preserved Uncertainties */}
            <div className="p-4 bg-[#ff3366]/5 border border-[#ff3366]/30 cyber-chamfer-sm space-y-2">
              <span className="text-xs font-mono text-[#ff3366] font-bold uppercase block">
                PRESERVED UNCERTAINTIES (HONEST INTELLIGENCE LIMITS)
              </span>
              <ul className="space-y-1.5">
                {selectedReport.preservedUncertainties.map((unc, i) => (
                  <li key={i} className="text-xs font-mono text-[#d1d5db] flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-[#ff3366] shrink-0 mt-0.5" />
                    <span>{unc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
