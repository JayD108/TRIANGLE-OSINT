import React, { useState } from 'react';
import { playCyberClick } from '../lib/soundFx';
import { ShieldAlert, X, CheckCircle, AlertTriangle, Search, Filter, Layers } from 'lucide-react';

interface VerificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerificationDrawer({ isOpen, onClose }: VerificationDrawerProps) {
  const [activeTab, setActiveTab] = useState<'audit' | 'pipeline'>('audit');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#12121a] border-2 border-[#00ff88] p-6 cyber-chamfer space-y-6 shadow-[0_0_24px_rgba(0,255,136,0.3)]">
        <div className="tech-corner-tl" />
        <div className="tech-corner-tr" />
        <div className="tech-corner-bl" />
        <div className="tech-corner-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a3a] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
            <ShieldAlert className="h-4 w-4" />
            <span className="font-bold uppercase tracking-wider">
              VERIFICATION AGENT (VER-00) // ADVERSARIAL EVIDENCE AUDIT
            </span>
          </div>
          <button
            onClick={() => {
              playCyberClick(900);
              onClose();
            }}
            className="p-1 text-[#9ca3af] hover:text-[#ff3366] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sub-headline */}
        <div>
          <h3 className="font-heading text-lg font-bold text-white uppercase">
            CIRCULAR WIRE DISSECTION & SOURCE ATTRIBUTION MATRIX
          </h3>
          <p className="mt-1 font-mono text-xs text-[#9ca3af] leading-relaxed">
            TRIANGLE does not count duplicate wires as corroborating evidence. This console reveals how the Verification Agent audits raw incoming feeds.
          </p>
        </div>

        {/* Visual Case Study: Circular Reporting Dissection */}
        <div className="space-y-3 bg-[#0a0a0f] p-4 border border-[#2a2a3a] cyber-chamfer-sm">
          <span className="text-[10px] font-mono uppercase text-[#00d4ff] font-bold block">
            LIVE CASE EXAMPLE: MALACCA STRAIT UNIDENTIFIED SUBMERSIBLE REPORT
          </span>

          <div className="space-y-2 text-xs font-mono">
            {/* Source A */}
            <div className="p-2.5 bg-[#171724] border-l-2 border-[#00ff88] flex items-start justify-between gap-3">
              <div>
                <span className="text-[#00ff88] font-bold">[PRIMARY SOURCE A]</span>
                <span className="text-white ml-2">Commercial satellite radar (SAR) pass at 06:14 UTC</span>
                <p className="text-[11px] text-[#9ca3af] mt-0.5">Physical telemetry detected 110m hull wake displacement traveling at 14 knots.</p>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/40 shrink-0">
                VERIFIED FACT
              </span>
            </div>

            {/* Source B & C Duplicate Wire */}
            <div className="p-2.5 bg-[#171724] border-l-2 border-[#ff3366] flex items-start justify-between gap-3">
              <div>
                <span className="text-[#ff3366] font-bold">[CIRCULAR REPEAT B & C]</span>
                <span className="text-white ml-2">24 regional news outlets & aggregators</span>
                <p className="text-[11px] text-[#9ca3af] mt-0.5">Claimed "Submarine belonged to adversary naval division and was forced to surface".</p>
                <p className="text-[10px] text-[#ff3366] mt-0.5 font-semibold">Verification Agent Audit: All 24 outlets cited a single anonymous Telegram channel with zero geolocated imagery.</p>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/40 shrink-0">
                FILTERED CIRCULAR
              </span>
            </div>
          </div>
        </div>

        {/* Verification Methodology Checklist */}
        <div className="space-y-2 font-mono text-xs">
          <span className="text-[10px] uppercase text-[#6b7280] block font-bold">
            VERIFICATION AGENT HEURISTICS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-3 bg-[#12121a] border border-[#2a2a3a] cyber-chamfer-sm flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-[#00ff88] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block">Temporal Lineage Tracing</span>
                <span className="text-[11px] text-[#9ca3af]">Traces the first timestamp of publication across the open web.</span>
              </div>
            </div>

            <div className="p-3 bg-[#12121a] border border-[#2a2a3a] cyber-chamfer-sm flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-[#00ff88] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block">AIS / SAR Cross-Grounding</span>
                <span className="text-[11px] text-[#9ca3af]">Validates naval ship sightings against commercial transponder logs.</span>
              </div>
            </div>

            <div className="p-3 bg-[#12121a] border border-[#2a2a3a] cyber-chamfer-sm flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-[#00ff88] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block">Duplicate Phrasing Fingerprinting</span>
                <span className="text-[11px] text-[#9ca3af]">Detects syndicated wire articles that disguise single sources as multiple reports.</span>
              </div>
            </div>

            <div className="p-3 bg-[#12121a] border border-[#2a2a3a] cyber-chamfer-sm flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-[#00ff88] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block">Preserved Uncertainty Flagging</span>
                <span className="text-[11px] text-[#9ca3af]">Forces Council Supervisor to maintain uncertainty when proof is incomplete.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="pt-2 border-t border-[#2a2a3a] flex justify-end">
          <button
            onClick={() => {
              playCyberClick(1000);
              onClose();
            }}
            className="px-5 py-2 bg-[#00ff88] text-[#0a0a0f] font-mono text-xs font-bold uppercase tracking-wider cyber-chamfer-sm hover:bg-white transition-colors"
          >
            ACKNOWLEDGE AUDIT RIGOR
          </button>
        </div>
      </div>
    </div>
  );
}
