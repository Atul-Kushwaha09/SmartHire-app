"use client";

import React, { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, ArrowUpDown, Mail, Phone,
  Layers, Scale, Award, Trophy, ChevronRight, Sparkles, X,
  Crown, Medal, Star, TrendingUp
} from "lucide-react";

interface Candidate {
  id: number;
  job_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: {
    years: number;
    roles: string[];
    companies: string[];
  };
  education: string | null;
  summary: string | null;
  score: number;
  technical_score: number;
  experience_score: number;
  education_score: number;
  resume_text: string | null;
  created_at: string;
}

interface LeaderboardProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onCompareCandidates: (selectedIds: number[]) => void;
}

export default function Leaderboard({ candidates, onSelectCandidate, onCompareCandidates }: LeaderboardProps) {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "top" | "mid" | "low">("all");
  const [sortBy, setSortBy] = useState<"score" | "experience" | "technical">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectCompare = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 candidates simultaneously.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [candidates]);

  const processedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
        const matchesSkill = !skillFilter || c.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase());
        let matchesTier = true;
        if (tierFilter === "top") matchesTier = c.score >= 80;
        else if (tierFilter === "mid") matchesTier = c.score >= 50 && c.score < 80;
        else if (tierFilter === "low") matchesTier = c.score < 50;
        return matchesSearch && matchesSkill && matchesTier;
      })
      .sort((a, b) => {
        let valA = a.score, valB = b.score;
        if (sortBy === "experience") { valA = a.experience.years; valB = b.experience.years; }
        else if (sortBy === "technical") { valA = a.technical_score; valB = b.technical_score; }
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [candidates, search, skillFilter, tierFilter, sortBy, sortOrder]);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const tierCounts = useMemo(() => ({
    all: candidates.length,
    top: candidates.filter(c => c.score >= 80).length,
    mid: candidates.filter(c => c.score >= 50 && c.score < 80).length,
    low: candidates.filter(c => c.score < 50).length,
  }), [candidates]);

  const getRankBadge = (idx: number) => {
    const isFiltered = tierFilter !== "all" || search || skillFilter;
    if (isFiltered) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-[11px] font-bold text-slate-500">
          #{idx + 1}
        </div>
      );
    }
    if (idx === 0) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black text-[11px] shadow-md shadow-amber-500/25">
          <Crown className="h-4 w-4" />
        </div>
      );
    }
    if (idx === 1) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 font-black text-[11px]">
          <Medal className="h-4 w-4" />
        </div>
      );
    }
    if (idx === 2) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 font-black text-[11px]">
          <Star className="h-3.5 w-3.5" />
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] text-[11px] font-bold text-slate-500">
        #{idx + 1}
      </div>
    );
  };

  const getScoreDisplay = (score: number) => {
    if (score >= 80) {
      return (
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-3 py-1 glow-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-neon-ping" />
          <span className="text-xs font-black tabular-nums text-emerald-400">{score}%</span>
        </div>
      );
    }
    if (score >= 50) {
      return (
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 px-3 py-1 glow-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-black tabular-nums text-amber-400">{score}%</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/8 px-3 py-1 glow-rose">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
        <span className="text-xs font-black tabular-nums text-rose-400">{score}%</span>
      </div>
    );
  };

  return (
    <div className="glass-panel relative rounded-2xl p-6 transition-all duration-300">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white">
                Candidate Leaderboard
              </h2>
              <p className="text-[11px] text-slate-500">
                AI semantic scoring, technical match & experience alignment
              </p>
            </div>
          </div>
          <span className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold text-slate-400 tabular-nums">
            {candidates.length} Scored
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-white/[0.04] py-3">

          {/* Tier Buttons */}
          <div className="flex items-center gap-1 text-[11px]">
            {([
              { key: "all" as const, label: "All", count: tierCounts.all, activeClass: "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white" },
              { key: "top" as const, label: "Top ≥80%", count: tierCounts.top, activeClass: "bg-emerald-500 text-white" },
              { key: "mid" as const, label: "Mid 50-79%", count: tierCounts.mid, activeClass: "bg-amber-500 text-white" },
              { key: "low" as const, label: "Low <50%", count: tierCounts.low, activeClass: "bg-rose-500 text-white" },
            ]).map((tier) => (
              <button
                key={tier.key}
                onClick={() => setTierFilter(tier.key)}
                className={`rounded-lg px-2.5 py-1.5 font-semibold transition-all ${
                  tierFilter === tier.key
                    ? tier.activeClass
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                }`}
              >
                {tier.label} ({tier.count})
              </button>
            ))}
          </div>

          {/* Search & Skill Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 rounded-xl border border-white/[0.06] bg-white/[0.03] py-1.5 pl-8 pr-7 text-[11px] text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {allSkills.length > 0 && (
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-36 appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] py-1.5 pl-8 pr-3 text-[11px] font-semibold text-slate-300 outline-none transition focus:border-indigo-500/40"
                >
                  <option value="">All Skills</option>
                  {allSkills.map((skill, idx) => (
                    <option key={idx} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidates List */}
      {processedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] text-slate-600">
            <Layers className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-300">
            No candidate profiles found
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-slate-500">
            {candidates.length === 0
              ? "Upload candidate resumes to begin screening and ranking applicants automatically."
              : "No candidates matched your criteria. Try clearing filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {processedCandidates.map((cand, idx) => {
            const isRank1 = idx === 0 && tierFilter === "all" && !search && !skillFilter;

            return (
              <div
                key={cand.id}
                className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 animate-fade-up ${
                  selectedIds.includes(cand.id)
                    ? "border-indigo-500/40 bg-indigo-500/[0.06] shadow-md shadow-indigo-500/8"
                    : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04] hover:shadow-lg hover:shadow-black/10"
                }`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">

                  {/* Left: Checkbox + Rank + Avatar + Profile */}
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cand.id)}
                      onChange={() => handleSelectCompare(cand.id)}
                      className="h-4 w-4 shrink-0 rounded-md border-slate-700 text-indigo-500 bg-transparent focus:ring-indigo-500/30 accent-indigo-500"
                    />

                    {getRankBadge(idx)}

                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[2px] shadow-sm">
                      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0f1a] text-[11px] font-black text-white">
                        {getInitials(cand.name)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {cand.name}
                        </span>
                        {isRank1 && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-black text-amber-400">
                            <Sparkles className="h-3 w-3" /> Top Pick
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        {cand.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3" /> {cand.email}
                          </span>
                        )}
                        <span className="font-semibold text-slate-400">
                          {cand.experience.years} Yrs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Score Bars */}
                  <div className="flex flex-col gap-1 sm:w-44 shrink-0">
                    {[
                      { label: "Tech", val: cand.technical_score, color: "bg-indigo-500" },
                      { label: "Exp", val: cand.experience_score, color: "bg-cyan-500" },
                      { label: "Edu", val: cand.education_score, color: "bg-emerald-500" },
                    ].map((dim) => (
                      <div key={dim.label} className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-500 w-7">{dim.label}</span>
                        <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className={`h-full ${dim.color} rounded-full transition-all duration-700`}
                            style={{ width: `${dim.val}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 tabular-nums w-7 text-right">{dim.val}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Right: Score + Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    {getScoreDisplay(cand.score)}
                    <button
                      onClick={() => onSelectCandidate(cand)}
                      className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-bold text-slate-400 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/8 hover:text-indigo-400"
                    >
                      <span>Report</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                    </button>
                  </div>
                </div>

                {/* Skills Row */}
                {cand.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/[0.03] pt-2.5">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mr-1">
                      Skills:
                    </span>
                    {cand.skills.slice(0, 5).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        onClick={() => setSkillFilter(skillFilter === skill ? "" : skill)}
                        className={`cursor-pointer rounded-md px-2 py-0.5 text-[10px] font-semibold transition ${
                          skillFilter === skill
                            ? "bg-indigo-500 text-white"
                            : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {cand.skills.length > 5 && (
                      <span className="text-[10px] text-slate-600 font-semibold">
                        +{cand.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Comparison Dock */}
      {selectedIds.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-4 rounded-2xl border border-indigo-500/30 bg-[#0a0f1a]/95 px-6 py-3.5 text-white shadow-2xl shadow-indigo-500/10 backdrop-blur-xl animate-float">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-bold">
              {selectedIds.length} Selected
            </span>
          </div>
          <button
            onClick={() => onCompareCandidates(selectedIds)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-[11px] font-black shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 active:scale-[0.97]"
          >
            Compare Matrix
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setSelectedIds([])} className="rounded-lg p-1.5 text-slate-500 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
