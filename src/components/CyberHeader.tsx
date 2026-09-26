import React from 'react';
import { Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { playCyberClick, toggleAudio, isAudioEnabled } from '../lib/soundFx';

interface CyberHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onEmergencyAlert: () => void;
  alertActive: boolean;
  onReplayBootLoader?: () => void;
}

export function CyberHeader({ activeTab, setActiveTab, onEmergencyAlert, alertActive, onReplayBootLoader }: CyberHeaderProps) {
  const [audioOn, setAudioOn] = React.useState(true);

  const handleAudioToggle = () => {
    const next = toggleAudio();
    setAudioOn(next);
    if (next) playCyberClick(1400);
  };

  const navItems = [
    { id: 'globe', label: 'Global Vectors' },
    { id: 'council', label: '11-Agent Council' },
    { id: 'reports', label: 'Intelligence Reports' },
    { id: 'weapons', label: 'Weapons & Tech' },
    { id: 'countries', label: 'Strategic Profiles' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a2a3a] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-3 sm:px-6 lg:px-8 xl:px-10">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            playCyberClick(900);
            setActiveTab('globe');
          }}
          className="group flex items-baseline gap-2 text-left focus-visible:outline-none"
        >
          <span className="font-heading text-xl font-black uppercase tracking-widest text-[#00ff88] group-hover:text-white transition-colors duration-150 drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]">
            TRIANGLE
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#00d4ff] uppercase opacity-75">
            [OSINT]
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playCyberClick(isActive ? 1100 : 1300);
                  setActiveTab(item.id);
                }}
                className={`relative py-1 font-mono text-xs uppercase tracking-wider transition-colors duration-150 whitespace-nowrap focus-visible:outline-none ${
                  isActive
                    ? 'text-[#00ff88] font-bold drop-shadow-[0_0_6px_rgba(0,255,136,0.6)]'
                    : 'text-[#9ca3af] hover:text-[#e0e0e0]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {onReplayBootLoader && (
            <button
              onClick={() => {
                playCyberClick(1100);
                onReplayBootLoader();
              }}
              className="hidden lg:flex items-center gap-1.5 border border-[#00ffff]/40 bg-[#00ffff]/10 px-2.5 py-1.5 font-mono text-xs text-[#00ffff] hover:border-[#00ffff] hover:bg-[#00ffff]/20 transition-all cyber-chamfer-sm"
              title="Replay HUD Cinematic Boot Loader"
            >
              <span className="text-[10px] uppercase tracking-wider font-bold">⚡ REPLAY BOOT</span>
            </button>
          )}

          <button
            onClick={handleAudioToggle}
            className="flex items-center gap-1.5 border border-[#2a2a3a] bg-[#12121a] px-2.5 py-1.5 font-mono text-xs text-[#9ca3af] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors cyber-chamfer-sm"
            title={audioOn ? "Mute Cyber FX" : "Enable Cyber FX"}
            aria-label="Toggle Sound Effects"
          >
            {audioOn ? <Volume2 className="h-3.5 w-3.5 text-[#00d4ff]" /> : <VolumeX className="h-3.5 w-3.5 text-[#6b7280]" />}
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">{audioOn ? "Audio ON" : "Audio Mute"}</span>
          </button>

          <button
            onClick={() => {
              playCyberClick(800);
              onEmergencyAlert();
            }}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-150 cyber-chamfer-sm whitespace-nowrap ${
              alertActive
                ? 'border-[#ff3366] bg-[#ff3366]/20 text-[#ff3366] shadow-[0_0_12px_rgba(255,51,102,0.5)] animate-pulse'
                : 'border-[#00ff88]/50 bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0f] hover:shadow-[0_0_12px_#00ff88]'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{alertActive ? "DEFCON-2 ELEVATED" : "OSINT STATUS: LIVE"}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#1c1c2e] px-4 py-2 gap-3 no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              playCyberClick(1200);
              setActiveTab(item.id);
            }}
            className={`text-[11px] font-mono uppercase whitespace-nowrap px-2 py-1 rounded transition-colors ${
              activeTab === item.id ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40' : 'text-[#6b7280]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
