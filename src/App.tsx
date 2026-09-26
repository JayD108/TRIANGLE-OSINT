/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CyberHeader } from './components/CyberHeader';
import { CyberGlobeSection } from './components/CyberGlobeSection';
import { CouncilMonitorSection } from './components/CouncilMonitorSection';
import { IntelligenceReportsSection } from './components/IntelligenceReportsSection';
import { KnowledgeBaseSection } from './components/KnowledgeBaseSection';
import { CountryDossierSection } from './components/CountryDossierSection';
import { PageLoadingAnimation } from './components/PageLoadingAnimation';
import { VerificationDrawer } from './components/VerificationDrawer';
import { EncryptedText } from './components/ui/encrypted-text';
import { playCyberClick, playAlertChime } from './lib/soundFx';
import { Shield, Activity, Compass, Cpu, FileText, ChevronRight, Terminal } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [dashboardDecryptionStarted, setDashboardDecryptionStarted] = useState(false);
  const [decryptionKey, setDecryptionKey] = useState(0);
  const [activeTab, setActiveTab] = useState('globe');
  const [selectedHotspotForReport, setSelectedHotspotForReport] = useState<string | undefined>(undefined);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [alertActive, setAlertActive] = useState(false);

  const handleSelectHotspotForReport = (hotspotId: string) => {
    setSelectedHotspotForReport(hotspotId);
    setActiveTab('reports');
  };

  const handleEmergencyAlertToggle = () => {
    playAlertChime();
    setAlertActive((prev) => !prev);
  };

  const handleStartDashboardEncryption = () => {
    setDashboardDecryptionStarted(true);
    setDashboardVisible(true);
    setDecryptionKey((prev) => prev + 1);
  };

  const handleDashboardPopUp = () => {
    setDashboardVisible(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setDashboardVisible(true);
    setDashboardDecryptionStarted(true);
  };

  const handleReplayBootLoader = () => {
    setIsLoading(true);
    setDashboardVisible(false);
    setDashboardDecryptionStarted(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] font-mono selection:bg-[#00ff88]/30 selection:text-[#00ff88] relative scanlines cyber-grid overflow-x-hidden">
      
      {/* Full Page Boot Loading Animation (Plays on every page open or refresh) */}
      {isLoading && (
        <PageLoadingAnimation
          onStartDashboardEncryption={handleStartDashboardEncryption}
          onDashboardPopUp={handleDashboardPopUp}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* Main Dashboard Deck with High-Tech Pop-Up Transition */}
      <div
        className={`w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          dashboardVisible
            ? 'opacity-100 scale-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 scale-[0.97] translate-y-3 blur-[1px] pointer-events-none'
        }`}
      >
        {/* Top 3-Zone Cyber Navigation Header */}
        <CyberHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onEmergencyAlert={handleEmergencyAlertToggle}
          alertActive={alertActive}
          onReplayBootLoader={handleReplayBootLoader}
        />

        {/* Live Tactical Ticker Banner (Full Width) */}
        <div className="border-b border-[#1c1c2e] bg-[#0c0c14]/90 px-3 sm:px-6 lg:px-8 xl:px-10 py-2 text-[11px] font-mono">
          <div className="flex w-full items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-[#00ff88] font-bold uppercase">
                <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-ping" />
                TRIANGLE OSINT ACTIVE
              </span>
              <span className="text-[#2a2a3a]">/</span>
              <span className="text-[#9ca3af]">THEATER: GLOBAL THEATERS</span>
              <span className="text-[#2a2a3a]">/</span>
              <span className="text-[#00d4ff]">COUNCIL STATUS: 11/11 AGENTS ONLINE</span>
              <span className="text-[#2a2a3a]">/</span>
              <span className="text-[#a78bfa]">DEFENSE SOEs: Global Aerospace · DARPA/Global R&D · Global Electronics · Global Dynamics · Global Dockyards MONITORED</span>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-[#6b7280]">
              <button
                onClick={() => {
                  playCyberClick(1200);
                  handleReplayBootLoader();
                }}
                className="text-[#00ffff] hover:text-[#00ff7f] transition-colors flex items-center gap-1 font-bold"
                title="Replay Loading Page Animation"
              >
                <span>⚡ REPLAY BOOT</span>
                <ChevronRight className="h-3 w-3" />
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  playCyberClick(1200);
                  setIsVerificationModalOpen(true);
                }}
                className="text-[#ff3366] hover:text-white transition-colors flex items-center gap-1"
              >
                <span>VERIFICATION AGENT AUDIT</span>
                <ChevronRight className="h-3 w-3" />
              </button>
              <span>·</span>
              <span className="text-[#9ca3af]">DATUM: WGS84</span>
            </div>
          </div>
        </div>

        {/* Main Content Area (Full Viewport Width - Zero Dead Margins) */}
        <main className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-8">
          
          {/* Hero Concept Briefing when in Globe view with EncryptedText */}
          {activeTab === 'globe' && (
            <div className="border-b border-[#2a2a3a] pb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
                <span className="px-2 py-0.5 border border-[#00ff88]/30 bg-[#00ff88]/10 cyber-chamfer-sm">
                  PROJECT MANDATE
                </span>
                <span>Global GLOBAL OSINT INTELLIGENCE PLATFORM</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white">
                <EncryptedText
                  key={`globe-hero-title-${decryptionKey}`}
                  enabled={dashboardDecryptionStarted}
                  text="TRIANGLE INTELLIGENCE // GLOBAL OSINT MATRIX"
                  encryptedClassName="text-[#00ff88]/40"
                  revealedClassName="text-white"
                  revealDelayMs={28}
                />
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#9ca3af] max-w-5xl leading-relaxed">
                Don't just observe what happened. Understand why it matters, what changed, what is connected, and what developments could occur next. Powered by a synchronized 11-agent Intelligence Council with Global Command at the center of global strategic awareness.
              </p>
            </div>
          )}

          {/* Tab Routing */}
          {activeTab === 'globe' && (
            <CyberGlobeSection
              key={`globe-${decryptionKey}`}
              onSelectHotspotForReport={handleSelectHotspotForReport}
            />
          )}

          {activeTab === 'council' && (
            <CouncilMonitorSection key={`council-${decryptionKey}`} />
          )}

          {activeTab === 'reports' && (
            <IntelligenceReportsSection
              key={`reports-${decryptionKey}`}
              initialReportId={selectedHotspotForReport}
            />
          )}

          {activeTab === 'weapons' && (
            <KnowledgeBaseSection key={`weapons-${decryptionKey}`} />
          )}

          {activeTab === 'countries' && (
            <CountryDossierSection key={`countries-${decryptionKey}`} />
          )}
        </main>

        {/* Verification Adversarial Audit Drawer */}
        <VerificationDrawer
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
        />

        {/* Footer conforming to Universal Design Constitution (Full Width) */}
        <footer className="mt-20 border-t border-[#2a2a3a] bg-[#0c0c14] py-8 text-xs font-mono text-[#6b7280]">
          <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-sm uppercase text-[#00ff88]">
                TRIANGLE
              </span>
              <span className="text-[#2a2a3a]">/</span>
              <span>Global GLOBAL OSINT PLATFORM</span>
              <span className="text-[#2a2a3a]">/</span>
              <span>11-AGENT INTELLIGENCE COUNCIL</span>
            </div>

            <div className="flex items-center gap-6 text-[11px]">
              <button
                onClick={() => {
                  playCyberClick(1100);
                  setActiveTab('council');
                }}
                className="hover:text-[#00ff88] transition-colors"
              >
                Council Architecture
              </button>
              <button
                onClick={() => {
                  playCyberClick(1100);
                  setActiveTab('reports');
                }}
                className="hover:text-[#00ff88] transition-colors"
              >
                6-Pillar Intelligence
              </button>
              <button
                onClick={() => {
                  playCyberClick(1100);
                  setIsVerificationModalOpen(true);
                }}
                className="hover:text-[#ff3366] transition-colors"
              >
                Anti-Circular Audit
              </button>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}

