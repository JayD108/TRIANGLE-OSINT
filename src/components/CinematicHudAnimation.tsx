import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  Layers,
  Activity,
  Crosshair,
  Compass,
} from 'lucide-react';
import { isAudioEnabled, toggleAudio } from '../lib/soundFx';

interface CinematicHudAnimationProps {
  onBackToApp?: () => void;
  isStandalone?: boolean;
}

export function CinematicHudAnimation({ onBackToApp, isStandalone = true }: CinematicHudAnimationProps) {
  // Container & Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SVG Elements Refs
  const mainTriangleGroupRef = useRef<SVGGElement>(null);
  const outerBorderPathRef = useRef<SVGPathElement>(null);
  const outerSegmentLeftRef = useRef<SVGPathElement>(null);
  const outerSegmentRightRef = useRef<SVGPathElement>(null);
  const outerSegmentBaseRef = useRef<SVGPathElement>(null);
  const innerTriangleRef = useRef<SVGPolygonElement>(null);
  const horizontalAccentLineRef = useRef<SVGLineElement>(null);
  const satelliteTopRef = useRef<SVGPolygonElement>(null);
  const satelliteLeftRef = useRef<SVGPolygonElement>(null);
  const satelliteRightRef = useRef<SVGPolygonElement>(null);
  const innerTrianglesGroupRef = useRef<SVGGElement>(null);
  const targetingBracketsGroupRef = useRef<SVGGElement>(null);
  const leftBracketRef = useRef<SVGPathElement>(null);
  const rightBracketRef = useRef<SVGPathElement>(null);
  const textElementRef = useRef<SVGTextElement>(null);
  const textGlowRef = useRef<SVGTextElement>(null);
  const centralCoreRef = useRef<SVGCircleElement>(null);
  const techNotchesGroupRef = useRef<SVGGElement>(null);

  // Playback & Timeline State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioActive, setAudioActive] = useState<boolean>(isAudioEnabled());
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [enable3DParallax, setEnable3DParallax] = useState<boolean>(true);
  const [activePhaseLabel, setActivePhaseLabel] = useState<string>('0:00 - INTRO ASSEMBLE');

  // Master GSAP Timeline Ref
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Audio Context Ref for synthesized sci-fi sound design
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesized Cyber Sounds
  const playSynthesizedSound = useCallback((type: 'sweep' | 'glitch' | 'lock' | 'collapse') => {
    if (!isAudioEnabled()) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
        // High-tech intro sweep (120Hz -> 480Hz)
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
        // Futuristic target lock double beep (880Hz & 1320Hz)
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
      } else if (type === 'glitch') {
        // Digital scrambling burst
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.06;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1800;
        noise.connect(filter);
        filter.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'collapse') {
        // Low-frequency collapse implosion (320Hz down to 45Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      }
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  }, []);

  // Text scrambling helper matching video frames ("R  ANGL", "TRIANGLE")
  const updateScrambledText = useCallback((progress: number) => {
    if (!textElementRef.current) return;
    const targetText = 'TRIANGLE';
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#<>/[]';

    // In 0.0 - 0.1: hidden
    if (progress < 0.1) {
      textElementRef.current.textContent = '';
      if (textGlowRef.current) textGlowRef.current.textContent = '';
      return;
    }

    // In 0.1 - 0.18: partial scrambled text matching video frame ("R  ANGL", random glyphs)
    if (progress >= 0.1 && progress < 0.18) {
      if (progress < 0.14) {
        // Video 00:01 frame: "R  ANGL"
        const scrambled = 'R  ANGL';
        textElementRef.current.textContent = scrambled;
        if (textGlowRef.current) textGlowRef.current.textContent = scrambled;
      } else {
        let res = '';
        for (let i = 0; i < targetText.length; i++) {
          if (Math.random() > 0.4) {
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

    // In 0.18 - 0.62: Solid locked "TRIANGLE"
    if (progress >= 0.18 && progress < 0.62) {
      textElementRef.current.textContent = targetText;
      if (textGlowRef.current) textGlowRef.current.textContent = targetText;
      return;
    }

    // In 0.62 - 0.76: Outro Glitch & Disappearance
    if (progress >= 0.62 && progress < 0.76) {
      const glitchRatio = (progress - 0.62) / 0.14;
      let res = '';
      for (let i = 0; i < targetText.length; i++) {
        if (Math.random() > glitchRatio) {
          res += targetText[i];
        } else if (Math.random() > 0.5) {
          res += glyphs[Math.floor(Math.random() * glyphs.length)];
        } else {
          res += ' ';
        }
      }
      textElementRef.current.textContent = res;
      if (textGlowRef.current) textGlowRef.current.textContent = res;
      return;
    }

    // 0.76 - 1.0: Completely gone
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

    // Particle pool definition
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

    const PARTICLE_COUNT = 55;
    const particles: Particle3D[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colors = ['#00ffff', '#00ff7f', '#38bdf8', '#a7f3d0'];
      const types: ('triangle' | 'crosshair' | 'sparkle' | 'microdot')[] = [
        'triangle',
        'triangle',
        'crosshair',
        'sparkle',
        'microdot',
      ];

      particles.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.35 - Math.random() * 0.45, // Slow upward drift
        vz: (Math.random() - 0.5) * 0.2,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        drx: (Math.random() - 0.5) * 0.015,
        dry: (Math.random() - 0.5) * 0.02,
        drz: (Math.random() - 0.5) * 0.015,
        size: Math.random() * 7 + 4,
        type: types[Math.floor(Math.random() * types.length)],
        opacity: Math.random() * 0.4 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHollow: Math.random() > 0.4,
      });
    }

    const FOV = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update positions
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.rx += p.drx;
        p.ry += p.dry;
        p.rz += p.drz;

        // Wrap around boundaries
        if (p.y < -height * 0.7) {
          p.y = height * 0.7;
          p.x = (Math.random() - 0.5) * width * 1.4;
          p.z = Math.random() * 800 + 100;
        }
        if (p.x < -width * 0.7) p.x = width * 0.7;
        if (p.x > width * 0.7) p.x = -width * 0.7;
        if (p.z < 50) p.z = 900;
        if (p.z > 900) p.z = 50;

        // 3D Perspective Projection
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
          // 3D rotating tiny triangle
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
          // Minimalist crosshair (+)
          const arm = renderSize * 0.8;
          ctx.beginPath();
          ctx.moveTo(-arm, 0);
          ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm);
          ctx.lineTo(0, arm);
          ctx.stroke();
        } else if (p.type === 'sparkle') {
          // 4-point tech star sparkle
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
          // Microdot
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
  // GSAP MASTER TIMELINE: EXACT 10-SECOND CINEMATIC LOOP
  // 0:00 - 0:01 (Intro): Assemble from center
  // 0:01 - 0:02 (Text Reveal): Digital glitch scramble text + brackets
  // 0:02 - 0:06 (Idle/Loop): Central triangle breathing pulse + living HUD
  // 0:06 - 0:09 (Outro): Text glitches out, triangles collapse into center
  // 0:09 - 0:10 (Reset): Seamless reboot
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
    const innerTriGroup = innerTrianglesGroupRef.current;
    const leftBrack = leftBracketRef.current;
    const rightBrack = rightBracketRef.current;
    const targetingGroup = targetingBracketsGroupRef.current;
    const notchesGroup = techNotchesGroupRef.current;
    const textEl = textElementRef.current;
    const textGlow = textGlowRef.current;
    const centralCore = centralCoreRef.current;

    if (!mainGroup || !outerSegLeft || !outerSegRight || !outerSegBase) return;

    // Center pivot for scaling
    gsap.set(mainGroup, { transformOrigin: '400px 380px' });
    if (innerTriGroup) gsap.set(innerTriGroup, { transformOrigin: '400px 380px' });
    if (targetingGroup) gsap.set(targetingGroup, { transformOrigin: '400px 380px' });

    // Build the 10-second master timeline
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'power2.inOut' },
      onUpdate: () => {
        const time = tl.time();
        setCurrentTime(time);

        // Update active phase label
        if (time < 1.0) {
          setActivePhaseLabel('0:00 - INTRO: ASSEMBLE FROM CENTER');
        } else if (time < 2.0) {
          setActivePhaseLabel('0:01 - TEXT REVEAL & CRYPTOGRAPHIC SCRAMBLE');
        } else if (time < 6.0) {
          setActivePhaseLabel('0:02 - LIVING HUD & 3D PARTICLE DRIFT');
        } else if (time < 7.5) {
          setActivePhaseLabel('0:06 - DIGITAL GLITCH & TEXT DISPERSION');
        } else if (time < 9.0) {
          setActivePhaseLabel('0:07 - IMPLOSION & SINGULARITY COLLAPSE');
        } else {
          setActivePhaseLabel('0:09 - REBOOTING QUANTUM HUD MATRIX');
        }

        // Live text scramble controller
        updateScrambledText(time / 10.0);
      },
    });

    timelineRef.current = tl;

    // Initial clean reset state at t=0
    tl.set([mainGroup, innerTriGroup, targetingGroup], { opacity: 0, scale: 0.1 });
    tl.set([satTop, satLeft, satRight], { opacity: 0, scale: 0 });
    tl.set(centralCore, { opacity: 0, scale: 0, transformOrigin: '400px 380px' });
    tl.set([leftBrack, rightBrack], { opacity: 0, x: (i) => (i === 0 ? 30 : -30) });
    tl.set(horizAccent, { scaleX: 0, transformOrigin: '400px 420px', opacity: 0 });
    tl.set(innerTri, { opacity: 0, scale: 0.8, transformOrigin: '400px 380px' });
    tl.set(notchesGroup, { opacity: 0 });

    // ==========================================
    // 0:00 - 0:01 (INTRO: ASSEMBLE FROM CENTER)
    // ==========================================
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

    // ==========================================
    // 0:01 - 0:02 (TEXT REVEAL & SCRAMBLE LOCK)
    // ==========================================
    tl.add(() => {
      playSynthesizedSound('glitch');
    }, 1.05);

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

    // Text locks into "TRIANGLE" at 1.8s with a neon lock sound
    tl.add(() => {
      playSynthesizedSound('lock');
    }, 1.8);

    // Flash of bright glow on text reveal
    if (textGlow) {
      tl.fromTo(
        textGlow,
        { opacity: 0.2, filter: 'drop-shadow(0 0 4px #00ffff)' },
        {
          opacity: 1,
          filter: 'drop-shadow(0 0 18px #00ff7f)',
          duration: 0.35,
          yoyo: true,
          repeat: 1,
        },
        1.75
      );
    }

    // ==========================================
    // 0:02 - 0:06 (IDLE/LIVING HUD LOOP)
    // ==========================================
    // Breathing pulse of the central triangle
    tl.to(
      mainGroup,
      {
        scale: 1.025,
        duration: 2.0,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      2.0
    );

    // Satellite micro-triangles hover and bob
    tl.to(
      satTop,
      {
        y: -6,
        duration: 1.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      2.1
    );
    tl.to(
      satLeft,
      {
        x: -5,
        y: 4,
        duration: 2.1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      2.2
    );
    tl.to(
      satRight,
      {
        x: 5,
        y: 4,
        duration: 2.0,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      2.15
    );

    // Subtle breathing pulse of brackets
    tl.to(
      [leftBrack, rightBrack],
      {
        opacity: 0.85,
        duration: 1.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      2.3
    );

    // Three inner inverted micro-triangles emerge (visible in video at 0:07)
    tl.to(
      innerTriGroup,
      {
        opacity: 0.95,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
      },
      4.2
    );

    // ==========================================
    // 0:06 - 0:09 (OUTRO: GLITCH & COLLAPSE)
    // (Last sound removed as requested; only the first 2 sound effects are active)
    // ==========================================

    // Glitch horizontal displacement jitter
    tl.to(
      [textEl, textGlow],
      {
        x: 3,
        duration: 0.08,
        repeat: 7,
        yoyo: true,
        ease: 'rough',
      },
      6.3
    );

    tl.to(
      [textEl, textGlow],
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      },
      7.3
    );

    // Brackets contract inwards and fade
    tl.to(
      leftBrack,
      {
        x: 25,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
      },
      7.1
    );
    tl.to(
      rightBrack,
      {
        x: -25,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
      },
      7.1
    );

    // Inner triangles collapse
    tl.to(
      innerTriGroup,
      {
        opacity: 0,
        scale: 0.2,
        duration: 0.6,
        ease: 'power3.in',
      },
      7.4
    );
    tl.to(
      innerTri,
      {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: 'power3.in',
      },
      7.5
    );

    // Satellites retract back towards center
    tl.to(
      [satTop, satLeft, satRight],
      {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.in',
      },
      7.8
    );

    // Horizontal line snaps shut
    tl.to(
      horizAccent,
      {
        scaleX: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
      },
      7.9
    );

    // Main triangle collapses smoothly into center singularity
    tl.to(
      mainGroup,
      {
        scale: 0.05,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.in',
      },
      8.0
    );

    // Flash of collapse point
    tl.fromTo(
      centralCore,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 0.9,
        scale: 1.5,
        duration: 0.25,
        ease: 'power2.out',
      },
      8.6
    );
    tl.to(
      centralCore,
      {
        opacity: 0,
        scale: 0,
        duration: 0.35,
        ease: 'power3.in',
      },
      8.85
    );

    // 0:09 - 0:10 (Quiet reset window before 0:00 reboot)
    tl.set(
      [mainGroup, innerTriGroup, targetingGroup, satTop, satLeft, satRight, textEl, textGlow],
      { opacity: 0 },
      9.1
    );

    return () => {
      tl.kill();
    };
  }, [playSynthesizedSound, updateScrambledText]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (!timelineRef.current) return;
    if (isPlaying) {
      timelineRef.current.pause();
      setIsPlaying(false);
    } else {
      timelineRef.current.play();
      setIsPlaying(true);
    }
  };

  // Jump to specific time in 10-second timeline
  const seekTimeline = (seconds: number) => {
    if (!timelineRef.current) return;
    timelineRef.current.seek(seconds);
    setCurrentTime(seconds);
  };

  // Change playback speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (timelineRef.current) {
      timelineRef.current.timeScale(speed);
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // 3D Mouse Parallax Effect on HUD Frame
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enable3DParallax || !mainTriangleGroupRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xRel = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const yRel = (clientY / innerHeight - 0.5) * 2; // -1 to 1

    gsap.to(mainTriangleGroupRef.current, {
      rotationY: xRel * 12,
      rotationX: -yRel * 12,
      x: xRel * 15,
      y: yRel * 15,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    if (!mainTriangleGroupRef.current) return;
    gsap.to(mainTriangleGroupRef.current, {
      rotationY: 0,
      rotationX: 0,
      x: 0,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden select-none bg-[#05080e] flex flex-col items-center justify-center transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'min-h-[820px] rounded-2xl border border-[#1e293b]/60'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.08) 0%, rgba(0, 255, 127, 0.03) 45%, #05080e 75%)',
      }}
    >
      {/* Background 3D Floating Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Subtle Ambient HUD Scanlines (CSS Overlay) */}
      <div
        className="absolute inset-0 pointer-events-none z-1 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Top HUD Telemetry Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c1526]/80 border border-[#00ffff]/30 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#00ff7f] animate-ping" />
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#00ffff]">
              CYBER HUD // TRIANGLE
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#94a3b8] hidden sm:inline">
            10-SEC GSAP TIMELINE ENGINE
          </span>
        </div>

        {/* Action Controls (Audio, Parallax, Inspector, Fullscreen, Back) */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = toggleAudio();
              setAudioActive(next);
            }}
            className={`p-2 rounded-lg border backdrop-blur-md transition-all text-xs font-mono flex items-center gap-1.5 ${
              audioActive
                ? 'bg-[#00ffff]/15 border-[#00ffff]/60 text-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                : 'bg-[#0f172a]/70 border-[#334155] text-[#64748b]'
            }`}
            title="Toggle Synthesized Cyber FX"
          >
            {audioActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden md:inline">{audioActive ? 'FX ON' : 'FX MUTE'}</span>
          </button>

          {/* 3D Mouse Parallax Toggle */}
          <button
            onClick={() => setEnable3DParallax(!enable3DParallax)}
            className={`p-2 rounded-lg border backdrop-blur-md transition-all text-xs font-mono hidden sm:flex items-center gap-1.5 ${
              enable3DParallax
                ? 'bg-[#00ff7f]/15 border-[#00ff7f]/60 text-[#00ff7f] shadow-[0_0_10px_rgba(0,255,127,0.3)]'
                : 'bg-[#0f172a]/70 border-[#334155] text-[#64748b]'
            }`}
            title="Toggle 3D Mouse Gyro Parallax"
          >
            <Compass className="h-4 w-4" />
            <span className="hidden md:inline">3D PARALLAX</span>
          </button>

          {/* Inspector Breakdown Toggle */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`p-2 rounded-lg border backdrop-blur-md transition-all text-xs font-mono flex items-center gap-1.5 ${
              showInspector
                ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]'
                : 'bg-[#0f172a]/70 border-[#334155] text-[#94a3b8] hover:text-white'
            }`}
            title="Timeline Phase Inspector"
          >
            <Sliders className="h-4 w-4" />
            <span className="hidden md:inline">TIMELINE LAB</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#0f172a]/70 border border-[#334155] text-[#94a3b8] hover:text-white backdrop-blur-md transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Cinematic Mode'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Back to Applet (if provided) */}
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#00d4ff] text-[#05080e] font-bold uppercase hover:bg-white transition-all shadow-[0_0_12px_rgba(0,212,255,0.4)]"
            >
              RETURN TO OSINT
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* THE CENTRAL HUD VECTOR STAGE (CRISP SVG HUD GEOMETRY)         */}
      {/* ============================================================== */}
      <div className="relative z-10 flex items-center justify-center w-full max-w-[700px] h-[550px] sm:h-[620px]">
        <svg
          viewBox="0 0 800 760"
          className="w-full h-full max-h-[580px] drop-shadow-[0_0_20px_rgba(0,255,255,0.35)]"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Main Neon Cyan -> Neon Green Gradient */}
            <linearGradient id="hudNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="50%" stopColor="#00f5b8" />
              <stop offset="100%" stopColor="#00ff7f" />
            </linearGradient>

            {/* Inverted Gradient for Accents */}
            <linearGradient id="hudNeonGradInvert" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff7f" />
              <stop offset="100%" stopColor="#00ffff" />
            </linearGradient>

            {/* Cyan Glitch Gradient */}
            <linearGradient id="hudCyanAccent" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ff7f" stopOpacity="0.8" />
            </linearGradient>

            {/* Multi-tier Neon Glow SVG Filter */}
            <filter id="hudNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="9" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* High-intensity Glow for text lock */}
            <filter id="textGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Central Singularity Flash Node */}
          <circle
            ref={centralCoreRef}
            cx="400"
            cy="380"
            r="16"
            fill="url(#hudNeonGrad)"
            filter="url(#hudNeonGlow)"
            className="opacity-0"
          />

          {/* MAIN HUD TRIANGLE ASSEMBLE GROUP */}
          <g ref={mainTriangleGroupRef} className="origin-[400px_380px]">
            
            {/* 1. OUTER SEGMENTED TRIANGULAR BORDER (Exact Match to Video 00:00 - 00:04) */}
            {/* Left Diagonal Segment */}
            <path
              ref={outerSegmentLeftRef}
              d="M 395 160 L 205 500"
              stroke="url(#hudNeonGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              filter="url(#hudNeonGlow)"
            />

            {/* Right Diagonal Segment with Technical Gap and Step Notch */}
            <path
              ref={outerSegmentRightRef}
              d="M 405 160 L 515 355 M 527 376 L 595 500"
              stroke="url(#hudNeonGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              filter="url(#hudNeonGlow)"
            />

            {/* Bottom Segment with Central Cutout Notch */}
            <path
              ref={outerSegmentBaseRef}
              d="M 215 500 L 350 500 M 450 500 L 585 500"
              stroke="url(#hudNeonGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              filter="url(#hudNeonGlow)"
            />

            {/* 2. INNER CONCENTRIC TRIANGLE */}
            <polygon
              ref={innerTriangleRef}
              points="400,205 565,480 235,480"
              stroke="url(#hudNeonGradInvert)"
              strokeWidth="1.8"
              strokeDasharray="14 6 45 6 100 8"
              fill="none"
              opacity="0.75"
              filter="url(#hudNeonGlow)"
            />

            {/* 3. HORIZONTAL TECHNICAL ACCENT SCAN LINE (Crosses lower third at y=420) */}
            <line
              ref={horizontalAccentLineRef}
              x1="220"
              y1="420"
              x2="580"
              y2="420"
              stroke="url(#hudCyanAccent)"
              strokeWidth="1.8"
              strokeDasharray="6 4 120 6 80 4"
              opacity="0.8"
            />

            {/* Technical Notch Bits & Digital Accent Cuts */}
            <g ref={techNotchesGroupRef} opacity="0.9">
              {/* Top vertex micro-cap */}
              <line x1="392" y1="145" x2="408" y2="145" stroke="#00ffff" strokeWidth="2" />
              
              {/* Stepped notch along right edge */}
              <polyline
                points="515,355 522,355 522,376 527,376"
                stroke="#00ff7f"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Bottom center bracket bridge */}
              <polyline
                points="350,500 355,508 445,508 450,500"
                stroke="#00ffff"
                strokeWidth="2"
                fill="none"
              />

              {/* Little corner dots */}
              <circle cx="215" cy="500" r="2.5" fill="#00ff7f" />
              <circle cx="585" cy="500" r="2.5" fill="#00ffff" />
            </g>

            {/* 4. THREE SATELLITE MICRO-TRIANGLES (Top, Bottom-Left, Bottom-Right) */}
            {/* Top Vertex Satellite */}
            <polygon
              ref={satelliteTopRef}
              points="400,105 412,125 388,125"
              fill="url(#hudNeonGrad)"
              stroke="#00ffff"
              strokeWidth="1"
              filter="url(#hudNeonGlow)"
            />

            {/* Bottom-Left Satellite */}
            <polygon
              ref={satelliteLeftRef}
              points="160,515 172,535 148,535"
              fill="url(#hudNeonGrad)"
              stroke="#00ffff"
              strokeWidth="1"
              filter="url(#hudNeonGlow)"
            />

            {/* Bottom-Right Satellite */}
            <polygon
              ref={satelliteRightRef}
              points="640,515 652,535 628,535"
              fill="url(#hudNeonGrad)"
              stroke="#00ff7f"
              strokeWidth="1"
              filter="url(#hudNeonGlow)"
            />

            {/* 5. THREE INTERNAL MICRO-TRIANGLES (Seen in Video 00:07) */}
            <g ref={innerTrianglesGroupRef} opacity="0" className="origin-[400px_380px]">
              {/* Inverted triangle above center text */}
              <polygon
                points="400,325 412,305 388,305"
                fill="#00ffff"
                opacity="0.8"
              />
              {/* Bottom-left inner triangle */}
              <polygon
                points="340,445 350,460 330,460"
                fill="#00ff7f"
                opacity="0.8"
              />
              {/* Bottom-right inner triangle */}
              <polygon
                points="460,445 470,460 450,460"
                fill="#00ffff"
                opacity="0.8"
              />
            </g>

            {/* 6. TARGETING BRACKETS AROUND CENTER TEXT [ TRIANGLE ] */}
            <g ref={targetingBracketsGroupRef} className="origin-[400px_380px]">
              {/* Left Bracket with Top and Bottom Corner L-Serifs */}
              <path
                ref={leftBracketRef}
                d="M 285 360 L 270 360 L 270 400 L 285 400"
                stroke="#00ffff"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="square"
                filter="url(#hudNeonGlow)"
              />

              {/* Right Bracket with Top and Bottom Corner L-Serifs */}
              <path
                ref={rightBracketRef}
                d="M 515 360 L 530 360 L 530 400 L 515 400"
                stroke="#00ff7f"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="square"
                filter="url(#hudNeonGlow)"
              />
            </g>

            {/* 7. THE WORD 'TRIANGLE' (Exact Center Text) */}
            {/* Background Glow Text Layer for Neon Radiance */}
            <text
              ref={textGlowRef}
              x="400"
              y="388"
              textAnchor="middle"
              className="font-heading font-black tracking-[0.25em] text-[34px] sm:text-[38px] fill-[#00ffff] opacity-90 select-none"
              style={{
                fontFamily: "'Orbitron', 'JetBrains Mono', sans-serif",
                filter: 'url(#textGlowFilter)',
              }}
            >
              TRIANGLE
            </text>

            {/* Sharp Foreground Text Layer */}
            <text
              ref={textElementRef}
              x="400"
              y="388"
              textAnchor="middle"
              className="font-heading font-black tracking-[0.25em] text-[34px] sm:text-[38px] fill-white select-none drop-shadow-[0_0_8px_#00ff7f]"
              style={{
                fontFamily: "'Orbitron', 'JetBrains Mono', sans-serif",
              }}
            >
              TRIANGLE
            </text>
          </g>
        </svg>

        {/* Ambient Corner Sparkle (Bottom Right as seen in video) */}
        <div className="absolute -bottom-4 -right-4 sm:bottom-2 sm:right-6 pointer-events-none flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-[#00ffff]/60 animate-pulse" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIMELINE CONTROLS & HUD STATUS BAR (BOTTOM)                    */}
      {/* ============================================================== */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto space-y-2.5 max-w-4xl mx-auto w-full px-2">
        
        {/* Active Phase Notification Pill */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-[#00ffff] bg-[#0b1324]/80 px-3 py-1 rounded-md border border-[#00ffff]/30 backdrop-blur-md">
            <Activity className="h-3.5 w-3.5 text-[#00ff7f] animate-pulse" />
            <span className="font-bold tracking-wider">{activePhaseLabel}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[#94a3b8] bg-[#0b1324]/80 px-2.5 py-1 rounded-md border border-[#1e293b]">
            <span className="text-[#00ff7f] font-bold">
              00:{currentTime.toFixed(1).padStart(4, '0')}
            </span>
            <span>/</span>
            <span>00:10.0</span>
          </div>
        </div>

        {/* Scrubbable Timeline Track */}
        <div className="relative group w-full h-3 bg-[#0d1627] border border-[#1e293b] rounded-full overflow-hidden cursor-pointer shadow-inner">
          {/* Timeline phase demarcation tick lines (0s, 1s, 2s, 6s, 9s, 10s) */}
          <div className="absolute top-0 bottom-0 left-[10%] w-[1px] bg-[#334155]" title="1.0s Text Reveal" />
          <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-[#00ffff]/50" title="2.0s Lock" />
          <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-[#ff3366]/50" title="6.0s Glitch Outro" />
          <div className="absolute top-0 bottom-0 left-[90%] w-[1px] bg-[#334155]" title="9.0s Collapse" />

          {/* Active Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-[#00ffff] to-[#00ff7f] transition-all duration-75 relative rounded-full"
            style={{ width: `${(currentTime / 10) * 100}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_white]" />
          </div>

          {/* Transparent click/seek overlay */}
          <input
            type="range"
            min="0"
            max="10"
            step="0.05"
            value={currentTime}
            onChange={(e) => seekTimeline(parseFloat(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        {/* Playback Controls Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a1224]/85 border border-[#1e293b] rounded-xl px-4 py-2.5 backdrop-blur-md">
          {/* Left: Play / Pause / Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className={`p-2 rounded-lg font-mono text-xs uppercase flex items-center gap-1.5 transition-all font-bold ${
                isPlaying
                  ? 'bg-[#00ff7f] text-[#05080e] shadow-[0_0_12px_rgba(0,255,127,0.4)]'
                  : 'bg-[#00ffff] text-[#05080e] shadow-[0_0_12px_rgba(0,255,255,0.4)]'
              }`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => seekTimeline(0)}
              className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] hover:text-white transition-all text-xs font-mono flex items-center gap-1"
              title="Restart 10s Animation Loop"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">RESTART</span>
            </button>
          </div>

          {/* Middle: Jump to Exact Timeline Phase (0:00, 0:01, 0:02, 0:06, 0:08) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-mono text-[#64748b] mr-1 hidden lg:inline">JUMP:</span>
            {[
              { time: 0, label: '0:00 ASSEMBLE' },
              { time: 1.0, label: '0:01 REVEAL' },
              { time: 2.0, label: '0:02 LIVING HUD' },
              { time: 6.2, label: '0:06 GLITCH' },
              { time: 7.8, label: '0:08 COLLAPSE' },
            ].map((phase) => (
              <button
                key={phase.time}
                onClick={() => seekTimeline(phase.time)}
                className={`text-[10px] font-mono px-2 py-1 rounded transition-colors whitespace-nowrap border ${
                  Math.abs(currentTime - phase.time) < 1.0
                    ? 'bg-[#00ffff]/20 text-[#00ffff] border-[#00ffff]/40 font-bold'
                    : 'bg-[#0b1324] text-[#94a3b8] border-[#1e293b] hover:text-white'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>

          {/* Right: Playback Speed Multipliers */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-[10px] text-[#64748b] mr-1 hidden sm:inline">SPEED:</span>
            {[0.5, 1.0, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-[#00ff7f]/20 text-[#00ff7f] border border-[#00ff7f]/40 font-bold'
                    : 'text-[#64748b] hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIMELINE LAB INSPECTOR DRAWER (TECHNICAL BREAKDOWN)            */}
      {/* ============================================================== */}
      {showInspector && (
        <div className="absolute top-16 right-4 z-30 w-80 sm:w-96 bg-[#0a1224]/95 border border-[#1e293b] rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fade-in font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <div className="flex items-center gap-2 text-[#00ffff] font-bold uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              <span>TIMELINE LAB & SPECIFICATION</span>
            </div>
            <button
              onClick={() => setShowInspector(false)}
              className="text-[#64748b] hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-[11px] text-[#94a3b8]">
            <div className="p-2 rounded bg-[#070e1c] border border-[#1e293b]">
              <span className="text-[#00ffff] font-bold block">0:00 - 0:01 (Intro)</span>
              <span>Geometric core flash, segmented triangle border draws in, satellite markers deploy into outer orbit.</span>
            </div>
            <div className="p-2 rounded bg-[#070e1c] border border-[#1e293b]">
              <span className="text-[#00ff7f] font-bold block">0:01 - 0:02 (Text Reveal)</span>
              <span>Minimalist targeting brackets [ ] expand around center. Scrambles random cryptographic glyphs before locking into bold 'TRIANGLE'.</span>
            </div>
            <div className="p-2 rounded bg-[#070e1c] border border-[#1e293b]">
              <span className="text-[#38bdf8] font-bold block">0:02 - 0:06 (Idle / Living HUD)</span>
              <span>Gentle breathing pulse of the triangle scale (1.0 &harr; 1.025). Ambient 3D canvas particles (triangles, crosshairs, sparkles) drift upward.</span>
            </div>
            <div className="p-2 rounded bg-[#070e1c] border border-[#1e293b]">
              <span className="text-[#ff3366] font-bold block">0:06 - 0:09 (Outro Glitch & Collapse)</span>
              <span>Horizontal displacement glitch jitter, text scrambles and disappears. Nested borders implode back into the central singularity.</span>
            </div>
            <div className="p-2 rounded bg-[#070e1c] border border-[#1e293b]">
              <span className="text-[#94a3b8] font-bold block">0:09 - 0:10 (Reboot)</span>
              <span>Quiet zero state before seamless loop repetition.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
