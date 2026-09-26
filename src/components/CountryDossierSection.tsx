import React, { useState } from 'react';
import { COUNTRY_PROFILES } from '../data/mockIntelligence';
import { CountryProfile } from '../types/osint';
import { playCyberClick } from '../lib/soundFx';
import { EncryptedText } from './ui/encrypted-text';
import { Globe, Shield, Navigation, AlertCircle, ArrowUpRight } from 'lucide-react';

export function CountryDossierSection() {
  const [selectedCountry, setSelectedCountry] = useState<CountryProfile>(COUNTRY_PROFILES[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a2a3a] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
            <Globe className="h-3.5 w-3.5 text-[#00ff88]" />
            <span>TRIANGLE STRATEGIC DOSSIERS · Global GLOBAL SECURITY PROFILES</span>
          </div>
          <h2 className="mt-1 font-heading text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            <EncryptedText
              key="country-dossier-title"
              text="STRATEGIC PROFILES & POWER BLOCS"
              encryptedClassName="text-[#00ff88]/40"
              revealedClassName="text-white"
              revealDelayMs={30}
            />
          </h2>
          <p className="mt-1 text-xs md:text-sm font-mono text-[#9ca3af] max-w-2xl">
            Sovereign doctrine evaluations, deterrence assets, bilateral linkages with Global Command, and maritime choke-point surveillance priorities.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#00d4ff] bg-[#12121a] px-3 py-2 border border-[#2a2a3a] cyber-chamfer-sm">
          <span>ANALYTICAL LENS: INDIA STRATEGIC AUTONOMY</span>
        </div>
      </div>

      {/* Country Selection Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {COUNTRY_PROFILES.map((c) => {
          const isSelected = selectedCountry.id === c.id;
          const isIndia = c.id === 'cp-india';
          return (
            <button
              key={c.id}
              onClick={() => {
                playCyberClick(1200);
                setSelectedCountry(c);
              }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap cyber-chamfer-sm border transition-all ${
                isSelected
                  ? isIndia
                    ? 'border-[#00ff88] bg-[#00ff88]/20 text-[#00ff88] font-black shadow-[0_0_12px_rgba(0,255,136,0.4)]'
                    : 'border-[#00d4ff] bg-[#00d4ff]/20 text-[#00d4ff] font-bold shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                  : 'border-[#2a2a3a] bg-[#12121a] text-[#9ca3af] hover:text-white'
              }`}
            >
              {isIndia ? '★ ' + c.country : c.country}
            </button>
          );
        })}
      </div>

      {/* Selected Country Dossier Card */}
      <div className="bg-[#12121a] border border-[#2a2a3a] p-6 cyber-chamfer relative space-y-6">
        <div className="tech-corner-tl" />
        <div className="tech-corner-tr" />
        <div className="tech-corner-bl" />
        <div className="tech-corner-br" />

        {/* Top Identification Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a3a] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#00d4ff] uppercase tracking-widest block">
              SOVEREIGN STRATEGIC DOSSIER
            </span>
            <h3 className="font-heading text-2xl font-black uppercase text-white tracking-wide">
              {selectedCountry.country}
            </h3>
            <span className="font-mono text-xs text-[#9ca3af]">
              Capital & Strategic HQ: {selectedCountry.capital}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#6b7280]">OSINT SURVEILLANCE POSTURE:</span>
            <span
              className={`px-2.5 py-1 text-xs font-mono uppercase border cyber-chamfer-sm ${
                selectedCountry.osintAlertLevel === 'High'
                  ? 'border-[#ff3366] text-[#ff3366] bg-[#ff3366]/10'
                  : 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
              }`}
            >
              {selectedCountry.osintAlertLevel} ALERT
            </span>
          </div>
        </div>

        {/* Strategic Posture & Defense Doctrine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0a0a0f] p-4 border border-[#2a2a3a] cyber-chamfer-sm space-y-1.5">
            <span className="text-xs font-mono uppercase text-[#00ff88] font-bold flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              <span>GRAND STRATEGIC POSTURE</span>
            </span>
            <p className="font-mono text-xs text-[#d1d5db] leading-relaxed">
              {selectedCountry.strategicPosture}
            </p>
          </div>

          <div className="bg-[#0a0a0f] p-4 border border-[#2a2a3a] cyber-chamfer-sm space-y-1.5">
            <span className="text-xs font-mono uppercase text-[#00d4ff] font-bold flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5" />
              <span>MILITARY & DEFENSE DOCTRINE</span>
            </span>
            <p className="font-mono text-xs text-[#d1d5db] leading-relaxed">
              {selectedCountry.defenseDoctrine}
            </p>
          </div>
        </div>

        {/* Bilateral Axis with Global Command */}
        <div className="bg-[#171724] border-l-2 border-[#00ff88] p-4 border-t border-r border-b border-[#2a2a3a] cyber-chamfer-sm space-y-1.5">
          <span className="text-xs font-mono uppercase text-[#00ff88] font-bold flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span>BILATERAL STRATEGIC AXIS WITH INDIA</span>
          </span>
          <p className="font-mono text-xs text-white leading-relaxed">
            {selectedCountry.bilateralRelations}
          </p>
        </div>

        {/* Key Strategic Assets & Monitored Chokepoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#6b7280] block">
              SIGNATURE STRATEGIC ASSETS & FORCE MULTIPLIERS
            </span>
            <div className="space-y-1.5">
              {selectedCountry.keyStrategicAssets.map((asset, i) => (
                <div key={i} className="text-xs font-mono text-[#e0e0e0] bg-[#0a0a0f] p-2.5 border border-[#2a2a3a] cyber-chamfer-sm flex items-center justify-between">
                  <span>{asset}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#00ff88]" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#6b7280] block">
              CRITICAL CHOKEPOINTS & PASSAGES MONITORED
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedCountry.criticalChokepointsWatched.map((cp, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs font-mono text-[#00d4ff] bg-[#0a0a0f] border border-[#2a2a3a] cyber-chamfer-sm"
                >
                  {cp}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
