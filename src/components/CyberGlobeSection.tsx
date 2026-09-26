import React, { useState } from 'react';
import { Globe3D, GlobeMarker } from './ui/3d-globe';
import { STRATEGIC_HOTSPOTS } from '../data/mockIntelligence';
import { StrategicHotspot, DomainCategory } from '../types/osint';
import { playCyberClick, playRadarPing } from '../lib/soundFx';
import { Crosshair, Shield, Compass, ChevronRight, Activity, Eye, Zap, Layers } from 'lucide-react';
import { HolographicHudOverlay } from './HolographicHudOverlay';
import { EncryptedText } from './ui/encrypted-text';

interface CyberGlobeSectionProps {
  onSelectHotspotForReport: (hotspotId: string) => void;
}

export function CyberGlobeSection({ onSelectHotspotForReport }: CyberGlobeSectionProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<StrategicHotspot>(STRATEGIC_HOTSPOTS[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | DomainCategory>('all');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showWireframe, setShowWireframe] = useState(true);
  const [atmosphereColor, setAtmosphereColor] = useState<'#00d4ff' | '#00ff88' | '#ff00ff'>('#00d4ff');

  // Filter markers based on category
  const filteredHotspots = STRATEGIC_HOTSPOTS.filter(
    (h) => activeCategory === 'all' || h.category === activeCategory
  );

  // Convert to GlobeMarker format
  const globeMarkers: GlobeMarker[] = filteredHotspots.map((h) => ({
    lat: h.coordinates.lat,
    lng: h.coordinates.lng,
    src: h.imgUrl,
    label: h.name.split('&')[0].trim(),
    category: h.category,
    region: h.region,
    severity: h.severity,
  }));

  const handleMarkerClick = (marker: GlobeMarker) => {
    playRadarPing();
    const matched = STRATEGIC_HOTSPOTS.find(
      (h) => Math.abs(h.coordinates.lat - marker.lat) < 0.1 && Math.abs(h.coordinates.lng - marker.lng) < 0.1
    );
    if (matched) {
      setSelectedHotspot(matched);
    }
  };

  const handleSelectPreset = (hotspot: StrategicHotspot) => {
    playCyberClick(1150);
    setSelectedHotspot(hotspot);
  };

  return (
    <div className="relative w-full space-y-6">
      {/* Top Section Header & Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a2a3a] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00ff88] animate-ping" />
            <span>ORBITAL SITUATION AWARENESS · REAL-TIME SATELLITE TELEMETRY</span>
          </div>
          <h2 className="mt-1 font-heading text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            <EncryptedText
              key="globe-vectors-title"
              text="GLOBAL OSINT GEO-VECTORS"
              encryptedClassName="text-[#00ff88]/40"
              revealedClassName="text-white"
              revealDelayMs={30}
            />
          </h2>
          <p className="mt-1 text-xs md:text-sm font-mono text-[#9ca3af] max-w-2xl">
            Multi-spectral visualization of strategic chokepoints, naval choke corridors, and high-altitude Himalayan deterrence lines with Global Command as primary operational lens.
          </p>
        </div>

        {/* Tactical Coordinate Pill */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#00d4ff] bg-[#12121a] px-3 py-2 border border-[#2a2a3a] cyber-chamfer-sm">
          <div className="flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-[#00ff88]" />
            <span>GRID: WGS84</span>
          </div>
          <span className="text-[#2a2a3a]">|</span>
          <span>LAT: {selectedHotspot.coordinates.lat.toFixed(4)}°N</span>
          <span className="text-[#2a2a3a]">|</span>
          <span>LNG: {selectedHotspot.coordinates.lng.toFixed(4)}°E</span>
        </div>
      </div>

      {/* Main Interactive Stage: 3D Globe + HUD Overlay + Telemetry Sidebar (Widescreen Full Width) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 2xl:grid-cols-12 gap-6 items-stretch w-full">
        
        {/* Globe 3D Canvas Container */}
        <div className="xl:col-span-8 2xl:col-span-8 relative min-h-[660px] 2xl:min-h-[760px] bg-[#0c0c14] border border-[#2a2a3a] cyber-chamfer overflow-hidden flex flex-col justify-between">
          
          {/* Tech Corner Brackets */}
          <div className="tech-corner-tl" />
          <div className="tech-corner-tr" />
          <div className="tech-corner-bl" />
          <div className="tech-corner-br" />

          {/* Top HUD Controls overlay on globe */}
          <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-[#0a0a0f]/90 via-[#0a0a0f]/40 to-transparent">
            {/* Domain Filter Buttons */}
            <div className="flex items-center gap-1 bg-[#12121a]/80 p-1 border border-[#2a2a3a] cyber-chamfer-sm">
              {(['all', 'defense', 'geopolitics', 'finance'] as const).map((cat) => {
                const isCurrent = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      playCyberClick(1200);
                      setActiveCategory(cat);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-all cyber-chamfer-sm ${
                      isCurrent
                        ? cat === 'defense'
                          ? 'bg-[#00ff88] text-[#0a0a0f] font-bold shadow-[0_0_8px_#00ff88]'
                          : cat === 'geopolitics'
                          ? 'bg-[#ff00ff] text-[#0a0a0f] font-bold shadow-[0_0_8px_#ff00ff]'
                          : cat === 'finance'
                          ? 'bg-[#00d4ff] text-[#0a0a0f] font-bold shadow-[0_0_8px_#00d4ff]'
                          : 'bg-[#e0e0e0] text-[#0a0a0f] font-bold'
                        : 'text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Visual Style Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playCyberClick(1000);
                  setAutoRotate(!autoRotate);
                }}
                className={`px-2 py-1 text-[11px] font-mono border cyber-chamfer-sm transition-colors ${
                  autoRotate ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10' : 'border-[#2a2a3a] text-[#6b7280]'
                }`}
                title="Toggle Auto Rotation"
              >
                ROTATION: {autoRotate ? 'AUTO' : 'MANUAL'}
              </button>

              <button
                onClick={() => {
                  playCyberClick(1050);
                  setShowWireframe(!showWireframe);
                }}
                className={`px-2 py-1 text-[11px] font-mono border cyber-chamfer-sm transition-colors ${
                  showWireframe ? 'border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10' : 'border-[#2a2a3a] text-[#6b7280]'
                }`}
                title="Toggle Wireframe Coordinate Grid"
              >
                GRID
              </button>

              <button
                onClick={() => {
                  playCyberClick(1100);
                  setAtmosphereColor(
                    atmosphereColor === '#00d4ff' ? '#00ff88' : atmosphereColor === '#00ff88' ? '#ff00ff' : '#00d4ff'
                  );
                }}
                className="px-2 py-1 text-[11px] font-mono border border-[#2a2a3a] text-white hover:border-[#ff00ff] cyber-chamfer-sm transition-colors"
                title="Cycle Atmosphere Neon Tint"
              >
                TINT
              </button>
            </div>
          </div>

          {/* The Actual 3D Globe Render Component */}
          <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
            <Globe3D
              markers={globeMarkers}
              config={{
                radius: 2.1,
                atmosphereColor: atmosphereColor,
                atmosphereIntensity: 0.85,
                atmosphereBlur: 2.2,
                bumpScale: 1.8,
                autoRotateSpeed: autoRotate ? 0.35 : 0,
                enableZoom: true,
                enablePan: false,
                showWireframe: showWireframe,
                wireframeColor: atmosphereColor,
              }}
              onMarkerClick={handleMarkerClick}
              className="h-[520px] w-full"
            />

            {/* Subtle Crosshair Reticle Center Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
              <Crosshair className="h-44 w-44 text-[#00ff88] stroke-1" />
            </div>

            {/* Holographic HUD Panel Overlay (Real-time Telemetry) */}
            <HolographicHudOverlay
              selectedHotspot={selectedHotspot}
              atmosphereColor={atmosphereColor}
            />

            {/* Live Vector Feed Overlay (bottom-left) */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-[#0a0a0f]/85 border border-[#2a2a3a] p-2.5 cyber-chamfer-sm max-w-xs">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#00ff88]">
                <Activity className="h-3 w-3 animate-spin" />
                <span>OSINT SURVEILLANCE FEED</span>
              </div>
              <div className="text-[11px] font-mono text-[#e0e0e0] mt-0.5 truncate">
                Focus: {selectedHotspot.name}
              </div>
              <div className="text-[9px] font-mono text-[#9ca3af]">
                Active Council Nodes: {selectedHotspot.activeAgents.join(' · ')}
              </div>
            </div>
          </div>

          {/* Bottom Quick-Jump Strip */}
          <div className="relative z-10 p-3 bg-[#0a0a0f]/95 border-t border-[#2a2a3a] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono uppercase text-[#6b7280] shrink-0 pl-1">
              PRESET VECTORS:
            </span>
            {STRATEGIC_HOTSPOTS.map((hs) => {
              const isSelected = selectedHotspot.id === hs.id;
              return (
                <button
                  key={hs.id}
                  onClick={() => handleSelectPreset(hs)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider shrink-0 transition-all cyber-chamfer-sm border ${
                    isSelected
                      ? 'border-[#00ff88] bg-[#00ff88]/20 text-[#00ff88] font-bold shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                      : 'border-[#2a2a3a] bg-[#12121a] text-[#9ca3af] hover:text-white hover:border-[#00d4ff]'
                  }`}
                >
                  {hs.name.split('&')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Hotspot Telemetry & OSINT Dossier */}
        <div className="xl:col-span-4 2xl:col-span-4 flex flex-col justify-between bg-[#12121a] border border-[#2a2a3a] p-5 cyber-chamfer relative">
          <div className="tech-corner-tl" />
          <div className="tech-corner-tr" />
          <div className="tech-corner-bl" />
          <div className="tech-corner-br" />

          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#00d4ff] font-bold tracking-wider">
                  HOTSPOT DOSSIER
                </span>
                <span className="text-xs font-mono text-[#6b7280]">· {selectedHotspot.region}</span>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 border cyber-chamfer-sm ${
                  selectedHotspot.severity === 'critical'
                    ? 'border-[#ff3366] text-[#ff3366] bg-[#ff3366]/10'
                    : 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                }`}
              >
                {selectedHotspot.severity}
              </span>
            </div>

            {/* Title & Headline */}
            <div>
              <h3 className="font-heading text-lg font-bold uppercase text-white leading-snug">
                {selectedHotspot.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-[#00ff88] font-semibold leading-relaxed">
                {selectedHotspot.headline}
              </p>
            </div>

            {/* Situation Summary */}
            <div className="bg-[#0a0a0f] p-3 border border-[#2a2a3a] cyber-chamfer-sm text-xs font-mono text-[#d1d5db] leading-relaxed">
              <span className="text-[10px] uppercase text-[#6b7280] block mb-1">OSINT SITUATION SUMMARY</span>
              {selectedHotspot.summary}
            </div>

            {/* Global Command Strategic Relevance */}
            <div className="border-l-2 border-[#00ff88] pl-3 py-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00ff88] font-bold uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" />
                <span>Global Command Strategic Relevance</span>
              </div>
              <p className="font-mono text-xs text-[#9ca3af] leading-relaxed">
                {selectedHotspot.globalRelevance}
              </p>
            </div>

            {/* Key Military Systems Involved */}
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6b7280] block mb-1.5">
                KEY STRATEGIC HARDWARE ON VECTORS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedHotspot.keySystemsInvolved.map((sys, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-1 bg-[#1c1c2e] text-[#00d4ff] border border-[#2a2a3a] cyber-chamfer-sm"
                  >
                    {sys}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Intelligence Council Agents */}
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6b7280] block mb-1.5">
                ASSIGNED COUNCIL AGENTS
              </span>
              <div className="flex items-center gap-2">
                {selectedHotspot.activeAgents.map((ag) => (
                  <span
                    key={ag}
                    className="text-[10px] font-mono px-2 py-0.5 bg-[#0a0a0f] text-[#00ff88] border border-[#00ff88]/30 cyber-chamfer-sm"
                  >
                    {ag}
                  </span>
                ))}
                <span className="text-[10px] font-mono text-[#6b7280]">
                  · Updated {selectedHotspot.lastUpdate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger to Launch Related Full Report */}
          <div className="pt-4 border-t border-[#2a2a3a] mt-4">
            <button
              onClick={() => {
                playCyberClick(1400);
                onSelectHotspotForReport(selectedHotspot.id);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#00ff88] text-[#0a0a0f] font-mono text-xs font-bold uppercase tracking-wider cyber-chamfer-sm hover:bg-white hover:shadow-[0_0_16px_#00ff88] transition-all duration-150"
            >
              <span>ACCESS FULL INTELLIGENCE REPORT</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
