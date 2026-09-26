import React, { useState, useEffect } from "react";
import { HolographicCard } from "./ui/holographic-card";
import { StrategicHotspot } from "../types/osint";
import { playCyberClick } from "../lib/soundFx";
import {
  Radio,
  Activity,
  Crosshair,
  Maximize2,
  Minimize2,
  Wifi,
  Database,
  Cpu,
  ShieldCheck,
  Disc,
} from "lucide-react";

interface HolographicHudOverlayProps {
  selectedHotspot: StrategicHotspot;
  atmosphereColor?: string;
}

export function HolographicHudOverlay({
  selectedHotspot,
  atmosphereColor = "#00ff88",
}: HolographicHudOverlayProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [streamSpeed, setStreamSpeed] = useState(45.2);
  const [packetCount, setPacketCount] = useState(84920);
  const [satelliteId, setSatelliteId] = useState("GSAT-7R / EMISAT-4");
  const [azimuthAngle, setAzimuthAngle] = useState(142.8);

  // Real-time simulated telemetry jitter for genuine live HUD feeling
  useEffect(() => {
    const interval = setInterval(() => {
      // Jitter stream around 45 MB/s
      const jitter = (Math.random() * 2.4 - 1.2).toFixed(1);
      setStreamSpeed(+(45.0 + parseFloat(jitter)).toFixed(1));
      setPacketCount((prev) => prev + Math.floor(Math.random() * 18 + 5));
      setAzimuthAngle((prev) => +((prev + 0.1) % 360).toFixed(1));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const accentVariant =
    atmosphereColor === "#ff00ff"
      ? "magenta"
      : atmosphereColor === "#00d4ff"
      ? "cyan"
      : "green";

  return (
    <div className="absolute top-16 right-3 sm:right-4 z-20 pointer-events-auto max-w-[280px] sm:max-w-xs transition-all duration-200">
      <HolographicCard
        accentColor={accentVariant}
        className="p-3.5 space-y-2.5 shadow-[0_0_20px_rgba(0,255,136,0.18)]"
      >
        {/* HUD Top Bar */}
        <div className="flex items-center justify-between border-b border-[#00ff88]/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
            </span>
            <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white">
              ORBITAL HUD // OSINT
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-[#00d4ff] bg-[#0a0a0f]/60 px-1.5 py-0.5 border border-[#00d4ff]/30">
              LEO-400KM
            </span>
            <button
              onClick={() => {
                playCyberClick(1100);
                setIsMinimized(!isMinimized);
              }}
              className="text-[#9ca3af] hover:text-[#00ff88] transition-colors p-0.5"
              title={isMinimized ? "Expand HUD" : "Minimize HUD"}
              aria-label={isMinimized ? "Expand HUD Telemetry" : "Minimize HUD Telemetry"}
            >
              {isMinimized ? (
                <Maximize2 className="h-3.5 w-3.5" />
              ) : (
                <Minimize2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Telemetry Item 1: SATELLITE LINK */}
        <div className="flex items-start justify-between gap-2 bg-[#0a0a0f]/50 p-2 border border-[#2a2a3a]/80 cyber-chamfer-sm">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30">
              <Radio className="h-3.5 w-3.5 text-[#00ff88] animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9ca3af] uppercase leading-tight">
                DOWNLINK STATUS
              </div>
              <div className="text-[11px] font-mono font-bold text-[#00ff88] tracking-wider flex items-center gap-1.5">
                <span>SATELLITE LINK: ACTIVE</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#00ff88] border border-[#00ff88]/40 px-1 py-0.5 bg-[#00ff88]/10 shrink-0">
            99.8%
          </span>
        </div>

        {/* Telemetry Item 2: GEODATA STREAM */}
        <div className="flex items-start justify-between gap-2 bg-[#0a0a0f]/50 p-2 border border-[#2a2a3a]/80 cyber-chamfer-sm">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/30">
              <Activity className="h-3.5 w-3.5 text-[#00d4ff]" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9ca3af] uppercase leading-tight">
                BANDWIDTH THROUGHPUT
              </div>
              <div className="text-[11px] font-mono font-bold text-[#00d4ff] tracking-wider">
                GEODATA STREAM: {streamSpeed}MB/s
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#00d4ff] border border-[#00d4ff]/40 px-1 py-0.5 bg-[#00d4ff]/10 shrink-0">
            LIVE
          </span>
        </div>

        {/* Telemetry Item 3: TARGETING SYSTEM */}
        <div className="flex items-start justify-between gap-2 bg-[#0a0a0f]/50 p-2 border border-[#2a2a3a]/80 cyber-chamfer-sm">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#ff00ff]/10 border border-[#ff00ff]/30">
              <Crosshair className="h-3.5 w-3.5 text-[#ff00ff]" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9ca3af] uppercase leading-tight">
                VECTOR LOCK // RETICLE
              </div>
              <div className="text-[11px] font-mono font-bold text-[#ff00ff] tracking-wider">
                TARGETING SYSTEM: READY
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#ff00ff] border border-[#ff00ff]/40 px-1 py-0.5 bg-[#ff00ff]/10 shrink-0">
            LOCK
          </span>
        </div>

        {/* Expanded Deep Telemetry Section */}
        {!isMinimized && (
          <div className="pt-1.5 border-t border-[#2a2a3a]/80 space-y-1.5 text-[10px] font-mono animate-fade-in">
            <div className="flex items-center justify-between text-[#9ca3af]">
              <span>ACTIVE TARGET:</span>
              <span className="text-[#e0e0e0] font-semibold truncate max-w-[150px]">
                {selectedHotspot.name.split("&")[0].trim()}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#9ca3af]">
              <span>COORDINATES:</span>
              <span className="text-[#00ff88]">
                {selectedHotspot.coordinates.lat.toFixed(2)}°N,{" "}
                {selectedHotspot.coordinates.lng.toFixed(2)}°E
              </span>
            </div>

            <div className="flex items-center justify-between text-[#9ca3af]">
              <span>RELAY SATELLITE:</span>
              <span className="text-[#00d4ff]">{satelliteId}</span>
            </div>

            <div className="flex items-center justify-between text-[#9ca3af]">
              <span>AZIMUTH / PACKETS:</span>
              <span className="text-white">
                {azimuthAngle}° / {packetCount.toLocaleString()}
              </span>
            </div>

            {/* Tactical Live Stream Progress Bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[9px] text-[#6b7280] mb-0.5">
                <span>BUFFER CAPACITY</span>
                <span>SYNC: 12ms</span>
              </div>
              <div className="h-1.5 w-full bg-[#0a0a0f] rounded-none overflow-hidden border border-[#2a2a3a]">
                <div
                  className="h-full bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#ff00ff] transition-all duration-300"
                  style={{ width: `${Math.min(100, (streamSpeed / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </HolographicCard>
    </div>
  );
}

export default HolographicHudOverlay;
