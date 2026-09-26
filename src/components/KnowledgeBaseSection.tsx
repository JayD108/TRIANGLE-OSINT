import React, { useState, useMemo } from 'react';
import { WEAPON_SYSTEMS, DEFENSE_SOES } from '../data/mockIntelligence';
import { WeaponSystem, DefenseSOE } from '../types/osint';
import { playCyberClick, playAlertChime, playRadarPing } from '../lib/soundFx';
import { EncryptedText } from './ui/encrypted-text';
import {
  Flag,
  DollarSign,
  Activity,
  Shield,
  Filter,
  Lock,
  Unlock,
  Scale,
  Search,
  ChevronDown,
  X,
  Crosshair,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Building2,
  TrendingUp,
  Cpu,
  Factory,
  Globe2,
  Compass,
} from 'lucide-react';

export function KnowledgeBaseSection() {
  const [activeGeneration, setActiveGeneration] = useState<string>('All Generations');
  const [selectedSoeFilter, setSelectedSoeFilter] = useState<string>('All SOEs');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'speed' | 'stealth' | 'cost'>('default');
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'soe' | 'compare' | 'armaments' | 'timeline'>('home');
  const [isClassifiedMode, setIsClassifiedMode] = useState<boolean>(false);

  // Detail Modal State
  const [detailSystem, setDetailSystem] = useState<WeaponSystem | null>(null);
  const [detailSoe, setDetailSoe] = useState<DefenseSOE | null>(null);

  // Comparison State (2 items)
  const [compareList, setCompareList] = useState<WeaponSystem[]>([
    WEAPON_SYSTEMS[0], // F-22
    WEAPON_SYSTEMS[7], // Rafale
  ]);

  const generationPills = [
    'All Generations',
    '3rd Generation',
    '4th Generation',
    '4.5th Generation',
    '5th Generation',
    'Strategic Strike',
    'Missile Shield',
    'HALE UAV',
  ];

  const soePills = [
    'All SOEs',
    'Global Aerospace (Aerospace)',
    'DARPA/Global R&D (R&D Labs)',
    'Global Electronics (Electronics)',
    'Global Dynamics (Missiles)',
    'Mazagon Dock (Global Dockyards)',
    'BrahMos Aerospace',
    'Dassault-Safran',
    'UAC / Rostec',
    'AVIC (China)',
    'Lockheed / Boeing',
  ];

  const countries = ['All', 'United States', 'Russia', 'China', 'France', 'Global Command', 'United Kingdom / Germany / Italy / Spain'];
  const statuses = ['All', 'In service', 'In limited service', 'Development/Testing'];

  // Filter & Sort Logic
  const filteredSystems = useMemo(() => {
    return WEAPON_SYSTEMS.filter((sys) => {
      // Generation filter
      const matchesGen =
        activeGeneration === 'All Generations'
          ? true
          : sys.generation.toLowerCase().includes(activeGeneration.toLowerCase()) ||
            activeGeneration.toLowerCase().includes(sys.generation.toLowerCase());

      // SOE filter
      const matchesSoe =
        selectedSoeFilter === 'All SOEs'
          ? true
          : (sys.soeEntity && sys.soeEntity.toLowerCase().includes(selectedSoeFilter.split(' ')[0].toLowerCase())) ||
            sys.manufacturer.toLowerCase().includes(selectedSoeFilter.split(' ')[0].toLowerCase());

      // Search query filter
      const matchesSearch =
        sys.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sys.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sys.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sys.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sys.soeEntity && sys.soeEntity.toLowerCase().includes(searchQuery.toLowerCase()));

      // Country filter
      const matchesCountry = selectedCountry === 'All' || sys.origin.includes(selectedCountry);

      // Status filter
      const matchesStatus = selectedStatus === 'All' || sys.status === selectedStatus;

      return matchesGen && matchesSoe && matchesSearch && matchesCountry && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'speed') return b.speedScore - a.speedScore;
      if (sortBy === 'stealth') return b.stealthRating - a.stealthRating;
      if (sortBy === 'cost') return b.unitCost.localeCompare(a.unitCost);
      return 0;
    });
  }, [activeGeneration, selectedSoeFilter, searchQuery, selectedCountry, selectedStatus, sortBy]);

  const toggleCompare = (sys: WeaponSystem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playCyberClick(1200);
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === sys.id);
      if (exists) {
        return prev.filter((item) => item.id !== sys.id);
      }
      if (prev.length >= 2) {
        return [prev[1], sys];
      }
      return [...prev, sys];
    });
  };

  const handleClassifiedToggle = () => {
    playAlertChime();
    setIsClassifiedMode(!isClassifiedMode);
  };

  return (
    <div className="w-full space-y-6">
      {/* AEROTACTICAL Brand Navigation Bar (Widescreen Full-Width Design) */}
      <div className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-4 sm:px-6 py-3.5 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/40 shadow-[0_0_14px_rgba(0,212,255,0.4)] shrink-0">
              <Crosshair className="h-5 w-5 text-[#00d4ff] animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-lg md:text-xl font-black uppercase tracking-wider text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]">
                  AEROTACTICAL
                </span>
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest hidden sm:inline">
                  // ARSENAL & SOE DEFENSE INTEL
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#94a3b8] hidden md:block">
                Strategic aerial superiority, missile defense systems, and sovereign defense industrial ecosystem
              </p>
            </div>
          </div>

          {/* Sub Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                playCyberClick(1100);
                setActiveSubTab('home');
              }}
              className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 transition-all rounded-md whitespace-nowrap ${
                activeSubTab === 'home'
                  ? 'text-[#00d4ff] font-bold bg-[#00d4ff]/10 border-b-2 border-[#00d4ff] shadow-[0_2px_12px_rgba(0,212,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              ALL JETS ({filteredSystems.length})
            </button>

            <button
              onClick={() => {
                playCyberClick(1150);
                setActiveSubTab('soe');
              }}
              className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 transition-all rounded-md flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'soe'
                  ? 'text-[#00ff88] font-bold bg-[#00ff88]/10 border-b-2 border-[#00ff88] shadow-[0_2px_12px_rgba(0,255,136,0.3)]'
                  : 'text-[#94a3b8] hover:text-[#00ff88]'
              }`}
            >
              <Factory className="h-3.5 w-3.5" />
              <span>DEFENSE SOEs ({DEFENSE_SOES.length})</span>
            </button>

            <button
              onClick={() => {
                playCyberClick(1200);
                setActiveSubTab('compare');
              }}
              className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 transition-all rounded-md flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'compare'
                  ? 'text-[#00d4ff] font-bold bg-[#00d4ff]/10 border-b-2 border-[#00d4ff] shadow-[0_2px_12px_rgba(0,212,255,0.3)]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>COMPARE ({compareList.length})</span>
            </button>

            <button
              onClick={() => {
                playCyberClick(1100);
                setActiveSubTab('armaments');
              }}
              className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 transition-all rounded-md whitespace-nowrap ${
                activeSubTab === 'armaments'
                  ? 'text-[#00d4ff] font-bold bg-[#00d4ff]/10 border-b-2 border-[#00d4ff]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              ARMAMENTS
            </button>

            <button
              onClick={() => {
                playCyberClick(1100);
                setActiveSubTab('timeline');
              }}
              className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 transition-all rounded-md whitespace-nowrap ${
                activeSubTab === 'timeline'
                  ? 'text-[#00d4ff] font-bold bg-[#00d4ff]/10 border-b-2 border-[#00d4ff]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              TIMELINE
            </button>
          </div>

          {/* Classified Access Toggle Badge */}
          <button
            onClick={handleClassifiedToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition-all duration-200 shrink-0 self-start lg:self-auto ${
              isClassifiedMode
                ? 'bg-[#ff3366]/20 border-[#ff3366] text-[#ff3366] shadow-[0_0_16px_rgba(255,51,102,0.4)] animate-pulse'
                : 'bg-[#0f172a] border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]'
            }`}
          >
            {isClassifiedMode ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            <span className="font-bold">{isClassifiedMode ? 'CLEARANCE: TOP SECRET' : 'CLASSIFIED ACCESS'}</span>
          </button>
        </div>
      </div>

      {/* Full-Width Telemetry & Operational Stats Ribbon */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#08101e] border border-[#1e293b] rounded-xl p-3.5 text-xs font-mono">
        <div className="flex items-center gap-3 px-2 border-r border-[#1e293b]">
          <Crosshair className="h-4 w-4 text-[#00d4ff] shrink-0" />
          <div>
            <div className="text-[10px] text-[#64748b] uppercase">TOTAL COMBAT PLATFORMS</div>
            <div className="text-white font-bold text-sm">{WEAPON_SYSTEMS.length} Systems Cataloged</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 border-r border-[#1e293b]">
          <Shield className="h-4 w-4 text-[#00ff88] shrink-0" />
          <div>
            <div className="text-[10px] text-[#64748b] uppercase">5TH GEN STEALTH FLEET</div>
            <div className="text-[#00ff88] font-bold text-sm">4 Platforms (F-22, F-35, Su-57, J-20, AMCA)</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 border-r border-[#1e293b]">
          <Factory className="h-4 w-4 text-[#a78bfa] shrink-0" />
          <div>
            <div className="text-[10px] text-[#64748b] uppercase">DEFENSE SOEs & DPSUs</div>
            <div className="text-[#a78bfa] font-bold text-sm">10 Monitored (Global Aerospace, DARPA/Global R&D, Global Electronics, Global Dynamics, Global Dockyards)</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2">
          <Activity className="h-4 w-4 text-[#f59e0b] shrink-0" />
          <div>
            <div className="text-[10px] text-[#64748b] uppercase">Allied DEFENSE ORDERS</div>
            <div className="text-[#f59e0b] font-bold text-sm">180 Tejas Mk1A + 26 Rafale-M + 31 MQ-9B</div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar (Widescreen Edge-to-Edge Layout) */}
      <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0a1224]/80 border border-[#1e293b] rounded-xl p-3">
        {/* Search input (Widescreen responsive) */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search platform, SOE (Global Aerospace, DARPA/Global R&D...), country, radar, weapon..."
            className="w-full bg-[#070d18] border border-[#1e293b] pl-9 pr-3 py-2 font-mono text-xs text-[#00d4ff] placeholder-[#475569] rounded-lg focus:border-[#00d4ff] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: SHOW FILTERS + Reset */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => {
              playCyberClick(1000);
              setShowFilters(!showFilters);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-mono text-xs uppercase tracking-wider font-semibold ${
              showFilters
                ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.3)]'
                : 'bg-[#0f1d33] border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>{showFilters ? 'HIDE ADVANCED FILTERS' : 'ADVANCED FILTERS'}</span>
          </button>

          {(activeGeneration !== 'All Generations' || selectedSoeFilter !== 'All SOEs' || selectedCountry !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setActiveGeneration('All Generations');
                setSelectedSoeFilter('All SOEs');
                setSelectedCountry('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="text-xs font-mono text-[#ff3366] hover:underline"
            >
              RESET ALL
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Advanced Filters Drawer */}
      {showFilters && (
        <div className="w-full bg-[#0b1324] border border-[#1e293b] rounded-xl p-4 space-y-4 animate-fade-in shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Filter */}
            <div>
              <label className="text-[10px] font-mono uppercase text-[#64748b] block mb-1">
                ORIGIN NATION
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  playCyberClick(1100);
                  setSelectedCountry(e.target.value);
                }}
                className="w-full bg-[#070d18] border border-[#1e293b] px-3 py-2 font-mono text-xs text-white rounded-lg focus:border-[#00d4ff] focus:outline-none"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Status Filter */}
            <div>
              <label className="text-[10px] font-mono uppercase text-[#64748b] block mb-1">
                OPERATIONAL SERVICE STATUS
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  playCyberClick(1100);
                  setSelectedStatus(e.target.value);
                }}
                className="w-full bg-[#070d18] border border-[#1e293b] px-3 py-2 font-mono text-xs text-white rounded-lg focus:border-[#00d4ff] focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* SOE Filter */}
            <div>
              <label className="text-[10px] font-mono uppercase text-[#64748b] block mb-1">
                DEFENSE SOE / PRIME CONTRACTOR
              </label>
              <select
                value={selectedSoeFilter}
                onChange={(e) => {
                  playCyberClick(1100);
                  setSelectedSoeFilter(e.target.value);
                }}
                className="w-full bg-[#070d18] border border-[#1e293b] px-3 py-2 font-mono text-xs text-[#00ff88] rounded-lg focus:border-[#00ff88] focus:outline-none"
              >
                {soePills.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div>
              <label className="text-[10px] font-mono uppercase text-[#64748b] block mb-1">
                SORT METRICS
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  playCyberClick(1100);
                  setSortBy(e.target.value as 'default' | 'speed' | 'stealth' | 'cost');
                }}
                className="w-full bg-[#070d18] border border-[#1e293b] px-3 py-2 font-mono text-xs text-white rounded-lg focus:border-[#00d4ff] focus:outline-none"
              >
                <option value="default">Default Order</option>
                <option value="speed">Highest Speed</option>
                <option value="stealth">Highest Stealth Rating</option>
                <option value="cost">Unit Cost</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Generation Filter Pill Strip (Full Width Scrolling Pill Strip) */}
      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-mono uppercase text-[#64748b] shrink-0 font-bold">
            GENERATION:
          </span>
          {generationPills.map((gen) => {
            const isActive = activeGeneration === gen;
            return (
              <button
                key={gen}
                onClick={() => {
                  playCyberClick(1150);
                  setActiveGeneration(gen);
                }}
                className={`px-3.5 py-1.5 text-xs font-mono tracking-wider transition-all duration-200 whitespace-nowrap rounded-full border ${
                  isActive
                    ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff] font-bold shadow-[0_0_14px_rgba(0,212,255,0.4)]'
                    : 'bg-[#08101e] border-[#1e293b] text-[#94a3b8] hover:text-white hover:border-[#334155]'
                }`}
              >
                {gen}
              </button>
            );
          })}
        </div>

        {/* Quick SOE Filter Chip Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-mono uppercase text-[#64748b] shrink-0 font-bold flex items-center gap-1">
            <Factory className="h-3 w-3 text-[#00ff88]" />
            SOE FILTER:
          </span>
          {soePills.map((soe) => {
            const isActive = selectedSoeFilter === soe;
            return (
              <button
                key={soe}
                onClick={() => {
                  playCyberClick(1150);
                  setSelectedSoeFilter(soe);
                }}
                className={`px-2.5 py-1 text-[11px] font-mono tracking-wider transition-all whitespace-nowrap rounded-md border ${
                  isActive
                    ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                    : 'bg-[#0a0f1d] border-[#1e293b] text-[#94a3b8] hover:text-[#00ff88]'
                }`}
              >
                {soe}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          SUB-VIEW: SOE & DEFENSE GIANTS DIRECTORY
         ======================================================== */}
      {activeSubTab === 'soe' && (
        <div className="w-full space-y-6 animate-fade-in">
          <div className="bg-[#0b1324] border border-[#1e293b] rounded-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
              <div>
                <h3 className="font-heading text-xl font-bold uppercase text-white flex items-center gap-2">
                  <Factory className="h-5 w-5 text-[#00ff88]" />
                  <span>DEFENSE STATE-OWNED ENTERPRISES (SOEs) & DPSU DIRECTORY</span>
                </h3>
                <p className="text-xs font-mono text-[#94a3b8]">
                  Critical manufacturing nodes, state shipyards, R&D laboratories, and global defense contractors shaping Allied and global military posture.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 px-3 py-1 rounded-lg">
                  ATMANIRBHAR BHARAT MONITORED
                </span>
              </div>
            </div>

            {/* Full-Width Grid of 10 Defense SOEs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-6">
              {DEFENSE_SOES.map((soe) => (
                <div
                  key={soe.id}
                  onClick={() => {
                    playCyberClick(1200);
                    setDetailSoe(soe);
                  }}
                  className="group cursor-pointer bg-[#070e1c] border border-[#152238] hover:border-[#00ff88]/70 hover:shadow-[0_8px_25px_rgba(0,255,136,0.18)] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e293b] text-[#00d4ff] border border-[#334155]">
                          {soe.country}
                        </span>
                        <h4 className="font-heading text-base font-bold uppercase text-white mt-1 group-hover:text-[#00ff88] transition-colors">
                          {soe.name}
                        </h4>
                        <span className="text-xs font-mono text-[#00ff88] font-semibold">
                          ({soe.acronym})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#a78bfa] border border-[#a78bfa]/40 bg-[#a78bfa]/10 px-2 py-0.5 rounded">
                        {soe.type.split(' ')[0]}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-[#94a3b8] line-clamp-3 leading-relaxed">
                      {soe.roleInGlobalDefense}
                    </p>

                    {/* Financial Metrics */}
                    <div className="grid grid-cols-2 gap-2 bg-[#091122] p-2.5 rounded-lg border border-[#1e293b] text-[11px] font-mono">
                      <div>
                        <span className="text-[10px] text-[#64748b] block">ANNUAL REVENUE</span>
                        <span className="text-white font-semibold">{soe.annualRevenue}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748b] block">ORDER BOOK</span>
                        <span className="text-[#00ff88] font-semibold">{soe.orderBook}</span>
                      </div>
                    </div>

                    {/* Flagship Programs */}
                    <div>
                      <span className="text-[10px] font-mono text-[#64748b] uppercase block mb-1">
                        FLAGSHIP PROGRAMS
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {soe.flagshipPrograms.slice(0, 3).map((prog, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 bg-[#0b172e] border border-[#1e293b] text-[#e0e0e0] rounded"
                          >
                            {prog}
                          </span>
                        ))}
                        {soe.flagshipPrograms.length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 text-[#64748b]">
                            +{soe.flagshipPrograms.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#152238] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#64748b] truncate max-w-[160px]">
                      {soe.stockTicker || soe.headquarters}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playCyberClick(1100);
                        setSelectedSoeFilter(soe.acronym);
                        setActiveSubTab('home');
                      }}
                      className="text-xs font-mono text-[#00d4ff] hover:text-white flex items-center gap-1"
                    >
                      <span>VIEW WEAPONS</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW: COMPARISON MODE
         ======================================================== */}
      {activeSubTab === 'compare' && (
        <div className="w-full bg-[#0b1324] border border-[#1e293b] rounded-xl p-6 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
            <div>
              <h3 className="font-heading text-xl font-bold uppercase text-white flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#00d4ff]" />
                <span>SIDE-BY-SIDE TACTICAL DOGFIGHT & BVR COMPARISON</span>
              </h3>
              <p className="text-xs font-mono text-[#94a3b8]">
                Comparing aerodynamic agility, supercruise threshold, radar cross section (RCS), and BVR engagement envelopes.
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('home')}
              className="px-3.5 py-1.5 bg-[#0f172a] text-xs font-mono text-[#00d4ff] border border-[#00d4ff]/40 rounded-lg hover:bg-[#00d4ff]/15 transition-colors self-start sm:self-auto"
            >
              &larr; BACK TO FLEET
            </button>
          </div>

          {compareList.length < 2 ? (
            <div className="text-center py-10 font-mono text-sm text-[#94a3b8] space-y-2">
              <p>Select at least 2 aircraft from the grid by clicking the "COMPARE" button on each card.</p>
              <button
                onClick={() => setActiveSubTab('home')}
                className="px-4 py-2 bg-[#00d4ff] text-[#0a0a0f] font-bold text-xs uppercase rounded-lg hover:bg-white transition-colors"
              >
                BROWSE AIRCRAFT FLEET
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {compareList.slice(0, 2).map((jet, idx) => (
                <div
                  key={jet.id}
                  className="bg-[#070e1c] border border-[#1e293b] rounded-xl p-5 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#00d4ff] uppercase tracking-wider font-semibold">
                      COMPARE SLOT 0{idx + 1}
                    </span>
                    <button
                      onClick={() => toggleCompare(jet)}
                      className="text-xs font-mono text-[#ff3366] hover:underline"
                    >
                      REMOVE
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={jet.imgUrl}
                      alt={jet.name}
                      className="h-20 w-32 object-cover rounded-lg border border-[#1e293b]"
                    />
                    <div>
                      <h4 className="font-heading text-lg font-bold uppercase text-white">
                        {jet.name}
                      </h4>
                      <p className="text-xs font-mono text-[#00d4ff]">{jet.generation}</p>
                      <p className="text-xs font-mono text-[#94a3b8]">{jet.origin} · {jet.manufacturer}</p>
                    </div>
                  </div>

                  {/* Metrics Comparison Bars */}
                  <div className="space-y-3 pt-3 border-t border-[#1e293b] font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[#94a3b8] mb-1">
                        <span>TOP SPEED SCORE</span>
                        <span className="text-white font-bold">{jet.speedScore}/100 ({jet.maxSpeedFormatted})</span>
                      </div>
                      <div className="h-2 w-full bg-[#111c30] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] rounded-full"
                          style={{ width: `${jet.speedScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#94a3b8] mb-1">
                        <span>DOGFIGHT MANEUVERABILITY</span>
                        <span className="text-white font-bold">{jet.maneuverScore}/100</span>
                      </div>
                      <div className="h-2 w-full bg-[#111c30] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00ff88] to-[#ff00ff] rounded-full"
                          style={{ width: `${jet.maneuverScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#94a3b8] mb-1">
                        <span>STEALTH OBSERVABILITY</span>
                        <span className="text-white font-bold">{jet.stealthRating}/100</span>
                      </div>
                      <div className="h-2 w-full bg-[#111c30] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00d4ff] to-[#3b82f6] rounded-full"
                          style={{ width: `${jet.stealthRating}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specifications Table */}
                  <div className="space-y-2 pt-3 border-t border-[#1e293b] font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-[#152238]">
                      <span className="text-[#64748b]">UNIT COST</span>
                      <span className="text-white font-semibold">{jet.unitCost}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#152238]">
                      <span className="text-[#64748b]">PRIMARY RADAR</span>
                      <span className="text-[#00d4ff] truncate max-w-[200px]">{jet.radarSystem || 'AESA'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#152238]">
                      <span className="text-[#64748b]">COMBAT RADIUS</span>
                      <span className="text-white">{jet.combatRange || '1,200 km'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748b]">STATUS</span>
                      <span className="text-[#00ff88]">{jet.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-VIEW: ARMAMENTS & WEAPON SYSTEMS
         ======================================================== */}
      {activeSubTab === 'armaments' && (
        <div className="w-full bg-[#0b1324] border border-[#1e293b] rounded-xl p-6 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
            <div>
              <h3 className="font-heading text-xl font-bold uppercase text-white flex items-center gap-2">
                <Crosshair className="h-5 w-5 text-[#00d4ff]" />
                <span>PRECISION MISSILE & ARMAMENT ENVELOPES</span>
              </h3>
              <p className="text-xs font-mono text-[#94a3b8]">
                BVR air-to-air missiles, supersonic anti-ship cruise missiles, and high-altitude air defense grids.
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('home')}
              className="px-3.5 py-1.5 bg-[#0f172a] text-xs font-mono text-[#00d4ff] border border-[#00d4ff]/40 rounded-lg hover:bg-[#00d4ff]/15 transition-colors"
            >
              &larr; BACK TO FLEET
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#070e1c] border border-[#1e293b] rounded-xl p-5 space-y-3">
              <span className="px-2.5 py-1 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 text-xs font-mono uppercase rounded-md">
                BVR AIR-TO-AIR
              </span>
              <h4 className="font-heading text-lg font-bold text-white uppercase">Meteor & Astra Mk2</h4>
              <p className="text-xs font-mono text-[#94a3b8] leading-relaxed">
                Ramjet-powered beyond-visual-range missiles with over 150+ km no-escape zone, equipped on IAF Rafales, Tejas Mk1A, and Su-30MKI.
              </p>
            </div>

            <div className="bg-[#070e1c] border border-[#1e293b] rounded-xl p-5 space-y-3">
              <span className="px-2.5 py-1 bg-[#ff00ff]/10 text-[#ff00ff] border border-[#ff00ff]/30 text-xs font-mono uppercase rounded-md">
                SUPERSONIC STRIKE
              </span>
              <h4 className="font-heading text-lg font-bold text-white uppercase">BrahMos-ER & SCALP</h4>
              <p className="text-xs font-mono text-[#94a3b8] leading-relaxed">
                Mach 3.0 supersonic sea-skimming cruise missiles capable of neutralizing hardened naval warships and mountain command bunkers at 500 km range.
              </p>
            </div>

            <div className="bg-[#070e1c] border border-[#1e293b] rounded-xl p-5 space-y-3">
              <span className="px-2.5 py-1 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 text-xs font-mono uppercase rounded-md">
                STRATEGIC SHIELD
              </span>
              <h4 className="font-heading text-lg font-bold text-white uppercase">S-400 & Project Kusha</h4>
              <p className="text-xs font-mono text-[#94a3b8] leading-relaxed">
                Layered multi-tiered air defense network covering 400 km engagement perimeter against stealth jets, cruise missiles, and ballistic targets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-VIEW: TIMELINE
         ======================================================== */}
      {activeSubTab === 'timeline' && (
        <div className="w-full bg-[#0b1324] border border-[#1e293b] rounded-xl p-6 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
            <div>
              <h3 className="font-heading text-xl font-bold uppercase text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00d4ff]" />
                <span>Global Theaters AIR COMBAT INDUCTION TIMELINE (2020 - 2035)</span>
              </h3>
              <p className="text-xs font-mono text-[#94a3b8]">
                Evolution of 4.5th generation modernization and 5th-generation stealth induction schedules.
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('home')}
              className="px-3.5 py-1.5 bg-[#0f172a] text-xs font-mono text-[#00d4ff] border border-[#00d4ff]/40 rounded-lg hover:bg-[#00d4ff]/15 transition-colors"
            >
              &larr; BACK TO FLEET
            </button>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex gap-4 p-4 bg-[#070e1c] border-l-4 border-[#00d4ff] rounded-r-xl">
              <div className="font-bold text-[#00d4ff] text-sm shrink-0">2020 - 2022</div>
              <div>
                <h5 className="font-bold text-white uppercase text-sm">36 Dassault Rafales Inducted into IAF</h5>
                <p className="text-[#94a3b8] mt-1">Golden Arrows (Ambala) & Flying Bullets (Hashimara) operational with Meteor & SCALP.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-[#070e1c] border-l-4 border-[#00ff88] rounded-r-xl">
              <div className="font-bold text-[#00ff88] text-sm shrink-0">2024 - 2026</div>
              <div>
                <h5 className="font-bold text-white uppercase text-sm">Global Aerospace Tejas Mk1A Deliveries & S-400 Deployment</h5>
                <p className="text-[#94a3b8] mt-1">180 Tejas Mk1A production lines running at Global Aerospace Bengaluru and Nashik with Uttam AESA radars.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-[#070e1c] border-l-4 border-[#a78bfa] rounded-r-xl">
              <div className="font-bold text-[#a78bfa] text-sm shrink-0">2028 - 2032</div>
              <div>
                <h5 className="font-bold text-white uppercase text-sm">AMCA 5th Gen First Flight & 26 Rafale-M INS Vikrant</h5>
                <p className="text-[#94a3b8] mt-1">Maiden flight of Allied AMCA stealth fighter; full carrier air wing integration on INS Vikrant.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN AIRCRAFT GRID (Full-Width Responsive Edge-to-Edge)
         ======================================================== */}
      {activeSubTab === 'home' && (
        <div className="w-full">
          {filteredSystems.length === 0 ? (
            <div className="text-center py-16 bg-[#08101e] border border-[#1e293b] rounded-xl font-mono text-sm text-[#94a3b8] space-y-3">
              <Crosshair className="h-8 w-8 text-[#64748b] mx-auto" />
              <p>No combat aircraft or weapon systems match the selected filter criteria.</p>
              <button
                onClick={() => {
                  setActiveGeneration('All Generations');
                  setSelectedSoeFilter('All SOEs');
                  setSelectedCountry('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#00d4ff] text-[#0a0a0f] font-bold text-xs uppercase rounded-lg hover:bg-white transition-colors"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 min-[2400px]:grid-cols-7 gap-5 w-full">
              {filteredSystems.map((jet) => {
                const isSelectedForCompare = compareList.some((item) => item.id === jet.id);

                return (
                  <div
                    key={jet.id}
                    onClick={() => {
                      playCyberClick(1200);
                      setDetailSystem(jet);
                    }}
                    className={`group cursor-pointer bg-[#070e1c] border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                      isSelectedForCompare
                        ? 'border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.35)]'
                        : 'border-[#152238] hover:border-[#00d4ff]/70 hover:shadow-[0_8px_25px_rgba(0,212,255,0.18)]'
                    }`}
                  >
                    {/* Top Image Container */}
                    <div className="relative h-48 w-full bg-[#0a1224] overflow-hidden">
                      <img
                        src={jet.imgUrl}
                        alt={jet.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      {/* Vignette Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-transparent to-black/30 pointer-events-none" />

                      {/* Status Pill Badge (Top Right) */}
                      <span
                        className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold rounded-full shadow-md ${
                          jet.status === 'In service'
                            ? 'bg-[#00d4ff] text-[#070e1c] shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                            : jet.status === 'In limited service'
                            ? 'bg-[#00d4ff]/90 text-[#070e1c]'
                            : 'bg-[#1e293b] text-[#94a3b8] border border-[#334155]'
                        }`}
                      >
                        {jet.status}
                      </span>

                      {/* Flagship SOE Tag (Top Left) */}
                      {jet.soeEntity && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded bg-[#0a0a0f]/90 text-[#00ff88] border border-[#00ff88]/40 shadow-sm">
                          SOE: {jet.soeEntity.split(' ')[0]}
                        </span>
                      )}

                      {/* Generation Tag (Bottom Left) */}
                      <div className="absolute bottom-2 left-2.5">
                        <span className="text-[11px] font-mono uppercase text-[#00d4ff] bg-[#070e1c]/90 px-2 py-0.5 rounded border border-[#00d4ff]/30 font-semibold shadow">
                          {jet.generation}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-heading text-base font-bold uppercase tracking-wide text-white group-hover:text-[#00d4ff] transition-colors leading-tight">
                          {jet.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[#94a3b8] truncate">
                          <Flag className="h-3 w-3 text-[#64748b] shrink-0" />
                          <span className="truncate">{jet.origin}</span>
                        </div>
                      </div>

                      {/* Spec Badges Row (Cost & Speed) */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0c1629] p-2 rounded-lg border border-[#16233a]">
                        <div className="flex items-center gap-1.5 text-[#94a3b8] truncate">
                          <DollarSign className="h-3 w-3 text-[#64748b] shrink-0" />
                          <span className="truncate">{jet.unitCost.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#00d4ff] font-semibold truncate justify-end">
                          <Activity className="h-3 w-3 text-[#00d4ff] shrink-0" />
                          <span className="truncate">{jet.maxSpeedFormatted.split('(')[0].trim()}</span>
                        </div>
                      </div>

                      {/* Performance Bars (Speed & Maneuver) */}
                      <div className="space-y-2 pt-1 font-mono text-[11px]">
                        {/* Speed Progress Bar */}
                        <div>
                          <div className="flex justify-between items-center text-[#64748b] mb-1">
                            <span className="uppercase tracking-wider">SPEED</span>
                            <span className="text-[#00d4ff] font-bold">{jet.speedScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#111c30] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00d4ff] rounded-full shadow-[0_0_8px_#00d4ff]"
                              style={{ width: `${jet.speedScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Maneuver Progress Bar */}
                        <div>
                          <div className="flex justify-between items-center text-[#64748b] mb-1">
                            <span className="uppercase tracking-wider">MANEUVER</span>
                            <span className="text-[#00ff88] font-bold">{jet.maneuverScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#111c30] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00ff88] rounded-full shadow-[0_0_8px_#00ff88]"
                              style={{ width: `${jet.maneuverScore}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="pt-2 border-t border-[#152238] flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => toggleCompare(jet, e)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                            isSelectedForCompare
                              ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                              : 'bg-[#0a1224] border-[#1e293b] text-[#94a3b8] hover:text-white hover:border-[#334155]'
                          }`}
                        >
                          <Scale className="h-3 w-3" />
                          <span>{isSelectedForCompare ? 'COMPARING' : 'COMPARE'}</span>
                        </button>

                        <button
                          onClick={() => {
                            playCyberClick(1200);
                            setDetailSystem(jet);
                          }}
                          className="py-1.5 px-3 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] rounded-lg text-xs font-mono uppercase tracking-wider font-semibold border border-[#00d4ff]/30 transition-colors"
                        >
                          SPEC
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          AIRCRAFT CLASSIFIED DOSSIER MODAL
         ======================================================== */}
      {detailSystem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDetailSystem(null)}
        >
          <div
            className="bg-[#0b1324] border border-[#1e293b] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1e293b] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00d4ff]">
                  <span>{detailSystem.generation}</span>
                  <span>·</span>
                  <span>{detailSystem.origin}</span>
                  {detailSystem.soeEntity && (
                    <>
                      <span>·</span>
                      <span className="text-[#00ff88] font-bold">SOE: {detailSystem.soeEntity}</span>
                    </>
                  )}
                </div>
                <h3 className="font-heading text-2xl font-black uppercase text-white mt-1">
                  {detailSystem.name}
                </h3>
              </div>
              <button
                onClick={() => setDetailSystem(null)}
                className="text-[#64748b] hover:text-white p-2 rounded-lg hover:bg-[#1e293b]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img
                  src={detailSystem.imgUrl}
                  alt={detailSystem.name}
                  className="w-full h-56 object-cover rounded-xl border border-[#1e293b]"
                />
                <p className="text-xs font-mono text-[#94a3b8] leading-relaxed">
                  {detailSystem.overview}
                </p>

                <div className="p-3 bg-[#070e1c] border border-[#1e293b] rounded-xl space-y-1 font-mono text-xs">
                  <div className="text-[#00d4ff] font-bold uppercase">Allied OPERATIONAL POSTURE & RELEVANCE</div>
                  <p className="text-[#e0e0e0] leading-relaxed">
                    {detailSystem.deploymentStatus}
                  </p>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4 font-mono text-xs">
                <h4 className="text-sm font-heading font-bold uppercase text-white border-b border-[#1e293b] pb-2">
                  TELEMETRY & COMBAT ENVELOPE
                </h4>

                <div className="space-y-2">
                  {Object.entries(detailSystem.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-[#152238]">
                      <span className="text-[#64748b] uppercase">{key}</span>
                      <span className="text-white font-semibold text-right max-w-[200px]">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 border-b border-[#152238]">
                    <span className="text-[#64748b] uppercase">UNIT FLYAWAY COST</span>
                    <span className="text-[#00ff88] font-bold">{detailSystem.unitCost}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#152238]">
                    <span className="text-[#64748b] uppercase">PRIMARY RADAR / SENSOR</span>
                    <span className="text-[#00d4ff]">{detailSystem.radarSystem || 'AESA'}</span>
                  </div>
                </div>

                {detailSystem.hardpoints && detailSystem.hardpoints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[#64748b] uppercase block font-bold">
                      KEY ARMAMENTS & HARDPOINTS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailSystem.hardpoints.map((hp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-[#0c1629] text-[#e0e0e0] border border-[#1e293b] rounded text-[11px]"
                        >
                          {hp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#1e293b] pt-4 flex items-center justify-between">
              <span className="text-xs font-mono text-[#64748b]">
                CLASSIFIED ARCHIVAL ID: {detailSystem.id.toUpperCase()}
              </span>
              <button
                onClick={() => setDetailSystem(null)}
                className="px-5 py-2 bg-[#00d4ff] text-[#0a0a0f] font-mono text-xs uppercase font-bold rounded-lg hover:bg-white transition-colors"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SOE DETAIL MODAL
         ======================================================== */}
      {detailSoe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDetailSoe(null)}
        >
          <div
            className="bg-[#0b1324] border border-[#1e293b] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#1e293b] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00ff88]">
                  <span>{detailSoe.type}</span>
                  <span>·</span>
                  <span>{detailSoe.country}</span>
                </div>
                <h3 className="font-heading text-2xl font-black uppercase text-white mt-1">
                  {detailSoe.name} ({detailSoe.acronym})
                </h3>
              </div>
              <button
                onClick={() => setDetailSoe(null)}
                className="text-[#64748b] hover:text-white p-2 rounded-lg hover:bg-[#1e293b]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <p className="text-sm text-[#e0e0e0] leading-relaxed">
                {detailSoe.roleInGlobalDefense}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#070e1c] p-4 rounded-xl border border-[#1e293b]">
                <div>
                  <span className="text-[#64748b] text-[10px] block uppercase">ANNUAL REVENUE</span>
                  <span className="text-white font-bold text-sm">{detailSoe.annualRevenue}</span>
                </div>
                <div>
                  <span className="text-[#64748b] text-[10px] block uppercase">CURRENT ORDER BOOK</span>
                  <span className="text-[#00ff88] font-bold text-sm">{detailSoe.orderBook}</span>
                </div>
                <div>
                  <span className="text-[#64748b] text-[10px] block uppercase">WORKFORCE</span>
                  <span className="text-[#00d4ff] font-bold text-sm">{detailSoe.workforce.split(' ')[0]}</span>
                </div>
              </div>

              <div>
                <span className="text-[#64748b] uppercase block font-bold mb-2">
                  MAJOR FLAGSHIP DEFENSE PROGRAMS
                </span>
                <div className="flex flex-wrap gap-2">
                  {detailSoe.flagshipPrograms.map((prog, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#0c1629] text-white border border-[#1e293b] rounded-lg text-xs"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#64748b] uppercase block font-bold mb-1">
                  HEADQUARTERS & COLLABORATION
                </span>
                <p className="text-[#94a3b8]">{detailSoe.headquarters}</p>
                <p className="text-[#64748b] text-[11px] mt-1">
                  Key Partners: {detailSoe.keyCollaborators.join(' · ')}
                </p>
              </div>
            </div>

            <div className="border-t border-[#1e293b] pt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedSoeFilter(detailSoe.acronym);
                  setActiveSubTab('home');
                  setDetailSoe(null);
                }}
                className="px-4 py-2 bg-[#00ff88] text-[#0a0a0f] font-mono text-xs uppercase font-bold rounded-lg hover:bg-white transition-colors"
              >
                FILTER WEAPONS MADE BY {detailSoe.acronym}
              </button>
              <button
                onClick={() => setDetailSoe(null)}
                className="px-4 py-2 bg-[#1e293b] text-white font-mono text-xs uppercase rounded-lg hover:bg-[#334155] transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
