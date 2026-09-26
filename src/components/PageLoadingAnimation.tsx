import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { isAudioEnabled } from '../lib/soundFx';

interface PageLoadingAnimationProps {
  onComplete: () => void;
  onStartDashboardEncryption?: () => void;
  onDashboardPopUp?: () => void;
}

export function PageLoadingAnimation({
  onComplete,
  onStartDashboardEncryption,
  onDashboardPopUp,
}: PageLoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasTriggeredEncryptionRef = useRef<boolean>(false);

  // SVG Elements
  const mainTriangleGroupRef = useRef<SVGGElement>(null);
  const outerSegmentLeftRef = useRef<SVGPathElement>(null);
  const outerSegmentRightRef = useRef<SVGPathElement>(null);
  const outerSegmentBaseRef = useRef<SVGPathElement>(null);
  const innerTriangleRef = useRef<SVGPolygonElement>(null);
  const horizontalAccentLineRef = useRef<SVGLineElement>(null);
  const satelliteTopRef = useRef<SVGPolygonElement>(null);
  const satelliteLeftRef = useRef<SVGPolygonElement>(null);
  const satelliteRightRef = useRef<SVGPolygonElement>(null);
  const targetingBracketsGroupRef = useRef<SVGGElement>(null);
  const leftBracketRef = useRef<SVGPathElement>(null);
  const rightBracketRef = useRef<SVGPathElement>(null);
  const textElementRef = useRef<SVGTextElement>(null);
  const textGlowRef = useRef<SVGTextElement>(null);
  const centralCoreRef = useRef<SVGCircleElement>(null);
  const techNotchesGroupRef = useRef<SVGGElement>(null);

  const [bootStatus, setBootStatus] = useState<string>('INITIALIZING QUANTUM MATRIX...');
  const [bootProgress, setBootProgress] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize ONLY the first 2 sound effects:
  // 1. Intro sweep / assemble sound at 0:00
  // 2. Futuristic lock double beep when 'TRIANGLE' appears at 1.8s
  // The last sound (collapse / outro glitch) is NOT played as instructed.
  const playSynthesizedSound = useCallback((type: 'sweep' | 'lock') => {
    if (!isAudioEnabled()) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'sweep') {
        // Sound 1: High-tech cyber sweep (140Hz -> 520Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.6);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'lock') {
        // Sound 2: Target lock double chime (880Hz & 1320Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0.09, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.2);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1320, now + 0.08);
        gain2.gain.setValueAtTime(0.09, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.28);
      }
    } catch {
      // AudioContext unavailable or autoplay prevented
    }
  }, []);

  // Text Scrambler with Intro Scramble, Locked Hold, and Outro Digital Glitch
  const updateScrambledText = useCallback((time: number) => {
    if (!textElementRef.current) return;
    const targetText = 'TRIANGLE';
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#<>/[]!$%&';

    // 0:00 - 1.0s: Blank / assembling
    if (time < 1.0) {
      textElementRef.current.textContent = '';
      if (textGlowRef.current) textGlowRef.current.textContent = '';
      return;
    }

    // 1.0s - 1.75s: Scrambling reveal
    if (time >= 1.0 && time < 1.75) {
      if (time < 1.35) {
        const scrambled = 'R  ANGL';
        textElementRef.current.textContent = scrambled;
        if (textGlowRef.current) textGlowRef.current.textContent = scrambled;
      } else {
        let res = '';
        for (let i = 0; i < targetText.length; i++) {
          if (Math.random() > 0.45) {
            res += targetText[i];
          } else {
            res += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        textElementRef.current.textContent = res;
        if (textGlowRef.current) textGlowRef.current.textContent = res;
      }
      return;
    }

    // 1.75s - 2.75s: Solid Locked "TRIANGLE"
    if (time >= 1.75 && time < 2.75) {
      textElementRef.current.textContent = targetText;
      if (textGlowRef.current) textGlowRef.current.textContent = targetText;
      return;
    }

    // 2.75s - 3.20s: Outro digital glitch scramble
    if (time >= 2.75 && time < 3.20) {
      let res = '';
      for (let i = 0; i < targetText.length; i++) {
        res += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      textElementRef.current.textContent = res;
      if (textGlowRef.current) textGlowRef.current.textContent = res;
      return;
    }

    // Beyond 3.20s: Outro text dissolved
    textElementRef.current.textContent = '';
    if (textGlowRef.current) textGlowRef.current.textContent = '';
  }, []);

  // -------------------------------------------------------------
  // 3D FLOATING PARTICLES CANVAS SYSTEM
  // Tiny faint triangles, crosshairs (+), and sparkles drifting upward
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      rx: number;
      ry: number;
      rz: number;
      drx: number;
      dry: number;
      drz: number;
      size: number;
      type: 'triangle' | 'crosshair' | 'sparkle' | 'microdot';
      opacity: number;
      color: string;
      isHollow: boolean;
    }

    const PARTICLE_COUNT = 45;
    const particles: Particle3D[] = [];
    const colors = ['#00ffff', '#00ff7f', '#38bdf8', '#a7f3d0', '#67e8f9'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: Math.random() * height,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.7 + 0.3),
        vz: (Math.random() - 0.5) * 0.3,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        drx: (Math.random() - 0.5) * 0.02,
        dry: (Math.random() - 0.5) * 0.02,
        drz: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 10 + 6,
        type: i % 4 === 0 ? 'triangle' : i % 4 === 1 ? 'crosshair' : i % 4 === 2 ? 'sparkle' : 'microdot',
        opacity: Math.random() * 0.45 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHollow: Math.random() > 0.4,
      });
    }

    const FOV = 450;
    const cx = width / 2;
    const cy = height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.rx += p.drx;
        p.ry += p.dry;
        p.rz += p.drz;

        if (p.y < -50) {
          p.y = height + 50;
          p.x = (Math.random() - 0.5) * width * 1.2;
        }

        const scale = FOV / (FOV + p.z);
        const projX = cx + p.x * scale;
        const projY = cy + p.y * scale;

        if (projX < -50 || projX > width + 50 || projY < -50 || projY > height + 50) {
          continue;
        }

        const renderSize = p.size * scale;
        const alpha = Math.min(1, Math.max(0, p.opacity * scale * 1.3));

        ctx.save();
        ctx.translate(projX, projY);
        ctx.rotate(p.rz);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.lineWidth = 1;

        if (p.type === 'triangle') {
          const h = renderSize * 1.5;
          const w = renderSize * 1.2;
          ctx.beginPath();
          ctx.moveTo(0, -h / 2);
          ctx.lineTo(w / 2, h / 2);
          ctx.lineTo(-w / 2, h / 2);
          ctx.closePath();
          if (p.isHollow) {
            ctx.stroke();
          } else {
            ctx.fill();
          }
        } else if (p.type === 'crosshair') {
          const arm = renderSize * 0.8;
          ctx.beginPath();
          ctx.moveTo(-arm, 0);
          ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm);
          ctx.lineTo(0, arm);
          ctx.stroke();
        } else if (p.type === 'sparkle') {
          const r = renderSize * 1.2;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1, renderSize * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // -------------------------------------------------------------
  // GSAP CINEMATIC BOOT TIMELINE
  // 0:00 - 0:01 (Intro): Glowing triangle with smaller pieces assemble from center
  // 0:01 - 0:02 (Text Reveal): Digital glitch scramble to 'TRIANGLE' + target brackets
  // 0:02 - 0:03.5 (Living Pulse & Target Lock): Telemetry confirms 100% lock
  // 0:03.5+: Elegant transition unveiling the app (No collapse sound!)
  // -------------------------------------------------------------
  useEffect(() => {
    const mainGroup = mainTriangleGroupRef.current;
    const outerSegLeft = outerSegmentLeftRef.current;
    const outerSegRight = outerSegmentRightRef.current;
    const outerSegBase = outerSegmentBaseRef.current;
    const innerTri = innerTriangleRef.current;
    const horizAccent = horizontalAccentLineRef.current;
    const satTop = satelliteTopRef.current;
    const satLeft = satelliteLeftRef.current;
    const satRight = satelliteRightRef.current;
    const leftBrack = leftBracketRef.current;
    const rightBrack = rightBracketRef.current;
    const targetingGroup = targetingBracketsGroupRef.current;
    const notchesGroup = techNotchesGroupRef.current;
    const textGlow = textGlowRef.current;
    const centralCore = centralCoreRef.current;

    if (!mainGroup || !outerSegLeft || !outerSegRight || !outerSegBase) return;

    gsap.set(mainGroup, { transformOrigin: '400px 380px' });
    if (targetingGroup) gsap.set(targetingGroup, { transformOrigin: '400px 380px' });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onUpdate: () => {
        const time = tl.time();
        const progress = Math.min(100, Math.round((time / 4.4) * 100));
        setBootProgress(progress);

        if (time < 1.0) {
          setBootStatus('INITIALIZING QUANTUM MATRIX...');
        } else if (time < 1.75) {
          setBootStatus('DECRYPTING NEURAL PROTOCOLS...');
        } else if (time < 2.75) {
          setBootStatus('TARGET ACQUIRED: TRIANGLE OSINT');
        } else if (time < 3.40) {
          setBootStatus('SYSTEM LOCK // PREPARING COMMAND DECK...');
        } else {
          setBootStatus('WAR ROOM READY // DECRYPTING DATA VECTORS');
        }

        updateScrambledText(time);
      },
      onComplete: () => {
        if (!hasTriggeredEncryptionRef.current) {
          hasTriggeredEncryptionRef.current = true;
          onStartDashboardEncryption?.();
          onDashboardPopUp?.();
        }
        onComplete();
      },
    });

    // Reset initial states
    tl.set([mainGroup, targetingGroup], { opacity: 0, scale: 0.1 });
    tl.set([satTop, satLeft, satRight], { opacity: 0, scale: 0 });
    tl.set(centralCore, { opacity: 0, scale: 0, transformOrigin: '400px 380px' });
    tl.set([leftBrack, rightBrack], { opacity: 0, x: (i) => (i === 0 ? 30 : -30) });
    tl.set(horizAccent, { scaleX: 0, transformOrigin: '400px 420px', opacity: 0 });
    tl.set(innerTri, { opacity: 0, scale: 0.8, transformOrigin: '400px 380px' });
    tl.set(notchesGroup, { opacity: 0 });

    // SOUND 1: Intro cyber sweep at 0:00 (FIRST OF ONLY 2 SOUNDS)
    tl.add(() => {
      playSynthesizedSound('sweep');
    }, 0.0);

    // Singularity flash in center
    tl.to(
      centralCore,
      {
        opacity: 1,
        scale: 1.8,
        duration: 0.35,
        ease: 'power3.out',
      },
      0.05
    );
    tl.to(
      centralCore,
      {
        opacity: 0.3,
        scale: 0.8,
        duration: 0.45,
        ease: 'power2.in',
      },
      0.4
    );

    // Main triangle expands smoothly from center
    tl.to(
      mainGroup,
      {
        opacity: 1,
        scale: 1,
        duration: 0.95,
        ease: 'power3.out',
      },
      0.1
    );

    // Outer segments scale and assemble outward
    tl.fromTo(
      [outerSegLeft, outerSegRight, outerSegBase],
      {
        strokeDasharray: 500,
        strokeDashoffset: 500,
        opacity: 0.4,
      },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      },
      0.15
    );

    // Satellites scale and deploy to orbit positions
    tl.to(
      [satTop, satLeft, satRight],
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.8)',
      },
      0.3
    );

    // Horizontal technical accent line sweeps across
    tl.to(
      horizAccent,
      {
        opacity: 0.9,
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.out',
      },
      0.4
    );

    // Inner concentric triangle fades and notches appear
    tl.to(
      innerTri,
      {
        opacity: 0.8,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      0.5
    );
    tl.to(
      notchesGroup,
      {
        opacity: 1,
        duration: 0.4,
        ease: 'none',
      },
      0.65
    );

    // Targeting brackets snap into place framing center
    tl.to(
      targetingGroup,
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)',
      },
      1.0
    );
    tl.to(
      leftBrack,
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: 'power3.out',
      },
      1.05
    );
    tl.to(
      rightBrack,
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: 'power3.out',
      },
      1.05
    );

    // SOUND 2: Neon Lock Sound when 'TRIANGLE' appears (SECOND OF ONLY 2 SOUNDS)
    tl.add(() => {
      playSynthesizedSound('lock');
    }, 1.75);

    // Flash of bright glow on text reveal
    if (textGlow) {
      tl.fromTo(
        textGlow,
        { opacity: 0.2, filter: 'drop-shadow(0 0 4px #00ffff)' },
        {
          opacity: 1,
          filter: 'drop-shadow(0 0 20px #00ff7f)',
          duration: 0.35,
          yoyo: true,
          repeat: 1,
        },
        1.75
      );
    }

    // Gentle living pulse of central triangle during target confirmation
    tl.to(
      mainGroup,
      {
        scale: 1.03,
        duration: 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      1.85
    );

    // -------------------------------------------------------------
    // LOGO OUTRO COLLAPSE ("as the logo fully goes")
    // SILENT - NO LAST SOUND (strictly preserves only the first 2 sounds)
    // -------------------------------------------------------------
    // 1. Text fades out with quick digital glitch
    if (textElementRef.current && textGlow) {
      tl.to(
        [textElementRef.current, textGlow],
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.35,
          ease: 'power2.in',
        },
        2.85
      );
    }

    // 2. Targeting brackets expand and dissolve
    tl.to(
      targetingGroup,
      {
        opacity: 0,
        scale: 1.25,
        duration: 0.4,
        ease: 'power2.in',
      },
      2.90
    );

    // 3. Central HUD triangle, segments, and satellites collapse into center singularity
    tl.to(
      mainGroup,
      {
        scale: 0,
        opacity: 0,
        duration: 0.45,
        ease: 'back.in(1.6)',
      },
      2.95
    );

    // 4. Singularity core micro-implosion
    tl.to(
      centralCore,
      {
        opacity: 0.9,
        scale: 1.4,
        duration: 0.15,
        ease: 'power2.out',
      },
      3.20
    );
    tl.to(
      centralCore,
      {
        opacity: 0,
        scale: 0,
        duration: 0.15,
        ease: 'power2.in',
      },
      3.35
    );

    // -------------------------------------------------------------
    // AT 3.40s: EXACTLY 1.0 SEC LEFT BEFORE 4.40s COMPLETION
    // 1. The logo has FULLY collapsed and gone!
    // 2. Main dashboard encryption text animation starts!
    // 3. Main dashboard pops up into view!
    // -------------------------------------------------------------
    tl.add(() => {
      if (!hasTriggeredEncryptionRef.current) {
        hasTriggeredEncryptionRef.current = true;
        onStartDashboardEncryption?.();
        onDashboardPopUp?.();
      }
    }, 3.40);

    // Dark loader background smoothly clears as dashboard emerges
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          scale: 1.02,
          duration: 1.0,
          ease: 'power2.out',
        },
        3.40
      );
    }

    return () => {
      tl.kill();
    };
  }, [playSynthesizedSound, updateScrambledText, onComplete, onStartDashboardEncryption, onDashboardPopUp]);

  // Handle immediate skip on click or keyboard press
  const handleImmediateSkip = () => {
    if (!hasTriggeredEncryptionRef.current) {
      hasTriggeredEncryptionRef.current = true;
      onStartDashboardEncryption?.();
      onDashboardPopUp?.();
    }
    if (containerRef.current) {
      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => {
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleImmediateSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleImmediateSkip}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden"
      style={{
        backgroundColor: '#020306',
      }}
    >
      {/* 3D Floating Particle Canvas (drifting triangles and crosshairs) */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-80" />

      {/* Cyber Grid & Ambient Scanlines (Very subtle in pitch darkness) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.06) 1px, transparent 1px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Top Cyber Telemetry Header */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between text-xs font-mono text-[#94a3b8]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#0c1526]/80 border border-[#00ffff]/30 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#00ff7f] animate-ping" />
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#00ffff]">
              TRIANGLE OSINT
            </span>
          </div>
          <span className="text-[#64748b] hidden sm:inline">BOOT PROTOCOL v4.12</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-[#00ff7f] font-mono">SYS_AUTH: VERIFIED</span>
          <span className="px-2 py-0.5 border border-[#334155] rounded bg-[#0f172a]/60 text-[#94a3b8] hover:text-white transition-colors">
            CLICK OR [ESC] TO SKIP
          </span>
        </div>
      </div>

      {/* Central HUD Vector Stage */}
      <div className="relative z-10 flex items-center justify-center w-full max-w-[650px] h-[520px]">
        <svg
          viewBox="0 0 800 760"
          className="w-full h-full max-h-[500px] drop-shadow-[0_0_24px_rgba(0,255,255,0.4)]"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="neonGradientLoader" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="65%" stopColor="#00e5a3" />
              <stop offset="100%" stopColor="#00ff7f" />
            </linearGradient>

            <filter id="neonGlowStrongLoader" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center Singularity Core Flash */}
          <circle
            ref={centralCoreRef}
            cx="400"
            cy="380"
            r="16"
            fill="url(#neonGradientLoader)"
            filter="url(#neonGlowStrongLoader)"
            opacity="0"
          />

          {/* MAIN HUD TRIANGLE GROUP */}
          <g ref={mainTriangleGroupRef} id="main-hud-triangle">
            {/* Outer Segment Left */}
            <path
              ref={outerSegmentLeftRef}
              d="M 388 152 L 202 506"
              stroke="url(#neonGradientLoader)"
              strokeWidth="5.5"
              strokeLinecap="round"
              filter="url(#neonGlowStrongLoader)"
            />

            {/* Outer Segment Right */}
            <path
              ref={outerSegmentRightRef}
              d="M 412 152 L 598 506"
              stroke="url(#neonGradientLoader)"
              strokeWidth="5.5"
              strokeLinecap="round"
              filter="url(#neonGlowStrongLoader)"
            />

            {/* Outer Segment Base */}
            <path
              ref={outerSegmentBaseRef}
              d="M 218 528 L 582 528"
              stroke="url(#neonGradientLoader)"
              strokeWidth="5.5"
              strokeLinecap="round"
              filter="url(#neonGlowStrongLoader)"
            />

            {/* Inner Concentric Fine Triangle */}
            <polygon
              ref={innerTriangleRef}
              points="400,210 248,495 552,495"
              fill="none"
              stroke="#00ffff"
              strokeWidth="1.8"
              strokeDasharray="10 4"
              opacity="0.8"
            />

            {/* Horizontal Technical Accent Line */}
            <line
              ref={horizontalAccentLineRef}
              x1="220"
              y1="420"
              x2="580"
              y2="420"
              stroke="#00ff7f"
              strokeWidth="1.5"
              opacity="0.9"
            />

            {/* Technical Notches */}
            <g ref={techNotchesGroupRef} opacity="0.9">
              <line x1="280" y1="416" x2="280" y2="424" stroke="#00ffff" strokeWidth="2" />
              <line x1="400" y1="414" x2="400" y2="426" stroke="#00ff7f" strokeWidth="2" />
              <line x1="520" y1="416" x2="520" y2="424" stroke="#00ffff" strokeWidth="2" />
            </g>

            {/* Outer Orbit Satellite Triangles */}
            <polygon
              ref={satelliteTopRef}
              points="400,90 388,110 412,110"
              fill="#00ffff"
              opacity="0.9"
              filter="url(#neonGlowStrongLoader)"
            />
            <polygon
              ref={satelliteLeftRef}
              points="145,525 160,545 135,550"
              fill="#00ff7f"
              opacity="0.9"
            />
            <polygon
              ref={satelliteRightRef}
              points="655,525 640,545 665,550"
              fill="#00ffff"
              opacity="0.9"
            />
          </g>

          {/* TARGETING BRACKETS GROUP */}
          <g ref={targetingBracketsGroupRef} id="targeting-brackets">
            {/* Left Bracket [ */}
            <path
              ref={leftBracketRef}
              d="M 230 350 L 210 350 L 210 410 L 230 410"
              fill="none"
              stroke="#00ffff"
              strokeWidth="3"
              filter="url(#neonGlowStrongLoader)"
            />
            {/* Right Bracket ] */}
            <path
              ref={rightBracketRef}
              d="M 570 350 L 590 350 L 590 410 L 570 410"
              fill="none"
              stroke="#00ffff"
              strokeWidth="3"
              filter="url(#neonGlowStrongLoader)"
            />
          </g>

          {/* CENTRAL WORD: 'TRIANGLE' */}
          <g id="center-text-group">
            {/* Background Glow Text */}
            <text
              ref={textGlowRef}
              x="400"
              y="392"
              textAnchor="middle"
              className="font-heading font-black tracking-[0.28em] uppercase"
              fontSize="34"
              fill="#00ff7f"
              opacity="0.6"
              filter="url(#neonGlowStrongLoader)"
            />
            {/* Foreground Sharp Text */}
            <text
              ref={textElementRef}
              x="400"
              y="392"
              textAnchor="middle"
              className="font-heading font-black tracking-[0.28em] uppercase"
              fontSize="34"
              fill="#ffffff"
            />
          </g>
        </svg>
      </div>

      {/* Bottom Loading Progress Status */}
      <div className="relative z-20 flex flex-col items-center gap-3 w-full max-w-md px-6">
        <div className="flex items-center justify-between w-full text-xs font-mono">
          <span className="text-[#00ffff] font-semibold tracking-wider flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ff7f] animate-ping" />
            {bootStatus}
          </span>
          <span className="text-[#00ff7f] font-bold">{bootProgress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden border border-[#00ffff]/30">
          <div
            className="h-full bg-gradient-to-r from-[#00ffff] to-[#00ff7f] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,255,255,0.8)]"
            style={{ width: `${bootProgress}%` }}
          />
        </div>

        <div className="text-[10px] font-mono text-[#64748b] tracking-wider uppercase text-center mt-1">
          PRESS <span className="text-[#94a3b8]">[ESC]</span> OR CLICK TO ENTER DIRECTLY
        </div>
      </div>
    </div>
  );
}
