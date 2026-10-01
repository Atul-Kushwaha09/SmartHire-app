"use client";

import React, { useState, useMemo } from "react";
import {
  Search, SlidersHorizontal, ArrowUpDown, Mail, Phone,
  Layers, Scale, Award, Trophy, ChevronRight, Sparkles, X,
  Crown, Medal, Star, TrendingUp, LayoutGrid, ListFilter,
  CheckCircle2, Eye, ShieldCheck, Check
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
  isCompact?: boolean;
  onToggleCompact?: () => void;
}

export default function Leaderboard({
  candidates,
  onSelectCandidate,
  onCompareCandidates,
  isCompact: externalCompact,
  onToggleCompact,
}: LeaderboardProps) {
  const [internalCompact, setInternalCompact] = useState(false);
  const isCompact = externalCompact !== undefined ? externalCompact : internalCompact;
  const toggleCompact = onToggleCompact || (() => setInternalCompact((prev) => !prev));

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
          (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
          (c.summary && c.summary.toLowerCase().includes(search.toLowerCase()));
        const matchesSkill =
          !skillFilter || c.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase());
        let matchesTier = true;
        if (tierFilter === "top") matchesTier = c.score >= 80;
        else if (tierFilter === "mid") matchesTier = c.score >= 50 && c.score < 80;
        else if (tierFilter === "low") matchesTier = c.score < 50;
        return matchesSearch && matchesSkill && matchesTier;
      })
      .sort((a, b) => {
        let valA = a.score;
        let valB = b.score;
        if (sortBy === "experience") {
          valA = a.experience.years;
          valB = b.experience.years;
        } else if (sortBy === "technical") {
          valA = a.technical_score;
          valB = b.technical_score;
        }
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [candidates, search, skillFilter, tierFilter, sortBy, sortOrder]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const tierCounts = useMemo(
    () => ({
      all: candidates.length,
      top: candidates.filter((c) => c.score >= 80).length,
      mid: candidates.filter((c) => c.score >= 50 && c.score < 80).length,
      low: candidates.filter((c) => c.score < 50).length,
    }),
    [candidates]
  );

  const getRankBadge = (idx: number) => {
    const isFiltered = tierFilter !== "all" || search || skillFilter;
    if (isFiltered) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          #{idx + 1}
        </div>
      );
    }
    if (idx === 0) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 font-black text-[11px] shadow-sm shadow-amber-500/20">
          <Crown className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (idx === 1) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 text-slate-800 font-black text-[11px] border border-slate-300 dark:border-slate-700">
          <Medal className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (idx === 2) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white font-black text-[11px]">
          <Star className="h-3.5 w-3.5" />
        </div>
      );
    }
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        #{idx + 1}
      </div>
    );
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return {
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/80",
        bar: "bg-emerald-500",
        label: "Top Match",
      };
    }
    if (score >= 50) {
      return {
        pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/80",
        bar: "bg-amber-500",
        label: "Moderate Fit",
      };
    }
    return {
      pill: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/80",
      bar: "bg-rose-500",
      label: "Low Fit",
    };
  };

  return (
    <div className="glass-panel relative rounded-2xl p-5 transition-all duration-300">
      {/* ─── Top Filter Controls ─── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Candidate Leaderboard
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {processedCandidates.length} evaluated applicant{processedCandidates.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* View density & Compare Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length >= 2 && (
            <button
              onClick={() => onCompareCandidates(selectedIds)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Compare ({selectedIds.length})</span>
            </button>
          )}

          {/* Density Toggle Button */}
          <button
            onClick={toggleCompact}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title={isCompact ? "Switch to detailed cards" : "Switch to compact table"}
          >
            {isCompact ? (
              <>
                <LayoutGrid className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Detailed Cards</span>
              </>
            ) : (
              <>
                <ListFilter className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Compact View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Search & Filter Bar ─── */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-8 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Skill Filter Dropdown */}
        {allSkills.length > 0 && (
          <div className="relative">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 px-2.5 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:focus:border-indigo-400"
            >
              <option value="">All Skills ({allSkills.length})</option>
              {allSkills.slice(0, 30).map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort by Dropdown */}
        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 px-2 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
          >
            <option value="score">Sort: Match Score</option>
            <option value="experience">Sort: Experience</option>
            <option value="technical">Sort: Technical Fit</option>
          </select>

          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
            title={`Order: ${sortOrder === "desc" ? "Highest First" : "Lowest First"}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Tier Pills Bar ─── */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: "all", label: "All Applicants", count: tierCounts.all },
          { key: "top", label: "Top Fit (≥80%)", count: tierCounts.top },
          { key: "mid", label: "Moderate (50-79%)", count: tierCounts.mid },
          { key: "low", label: "Low (<50%)", count: tierCounts.low },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTierFilter(tab.key as any)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              tierFilter === tab.key
                ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                tierFilter === tab.key
                  ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ─── Empty State ─── */}
      {processedCandidates.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 px-4 text-center dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
            No candidates match current criteria
          </h3>
          <p className="mt-1 text-[11px] text-slate-400 max-w-xs">
            Try adjusting search terms, tier filters, or upload more candidate resumes.
          </p>
        </div>
      )}

      {/* ─── Compact Table Mode ─── */}
      {isCompact && processedCandidates.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <tr>
                <th className="py-2.5 pl-3 pr-2 w-10">Compare</th>
                <th className="py-2.5 px-2 w-12 text-center">Rank</th>
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Experience</th>
                <th className="py-2.5 px-3">Top Skills</th>
                <th className="py-2.5 px-3 text-right">Score</th>
                <th className="py-2.5 pl-2 pr-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {processedCandidates.map((candidate, idx) => {
                const isSelected = selectedIds.includes(candidate.id);
                const badge = getScoreBadge(candidate.score);

                return (
                  <tr
                    key={candidate.id}
                    onClick={() => onSelectCandidate(candidate)}
                    className="group cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    {/* Compare checkbox */}
                    <td
                      className="py-2 pl-3 pr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCompare(candidate.id);
                      }}
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 group-hover:border-indigo-400"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="py-2 px-2 text-center">
                      <div className="flex justify-center">{getRankBadge(idx)}</div>
                    </td>

                    {/* Candidate Name & Contact */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-bold text-[10px] text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          {getInitials(candidate.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {candidate.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {candidate.email || candidate.phone || "No direct email"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="py-2 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {candidate.experience.years} yrs
                      </span>
                      {candidate.experience.roles.length > 0 && (
                        <span className="ml-1 text-[10px] text-slate-400">
                          ({candidate.experience.roles[0]})
                        </span>
                      )}
                    </td>

                    {/* Top Skills */}
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {candidate.skills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="text-[9px] text-slate-400 self-center">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Match Score */}
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black border ${badge.pill}`}
                      >
                        {candidate.score}%
                      </span>
                    </td>

                    {/* Action button */}
                    <td
                      className="py-2 pl-2 pr-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCandidate(candidate);
                      }}
                    >
                      <button
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Detailed Card Mode ─── */}
      {!isCompact && processedCandidates.length > 0 && (
        <div className="space-y-2.5">
          {processedCandidates.map((candidate, idx) => {
            const isSelected = selectedIds.includes(candidate.id);
            const badge = getScoreBadge(candidate.score);

            return (
              <div
                key={candidate.id}
                onClick={() => onSelectCandidate(candidate)}
                className="group relative cursor-pointer rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all duration-200 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-indigo-500/60"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Avatar, Name & Summary */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Rank Indicator */}
                    <div className="shrink-0 pt-0.5">{getRankBadge(idx)}</div>

                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200/60 dark:from-indigo-950/80 dark:to-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800">
                      {getInitials(candidate.name)}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {candidate.name}
                        </h3>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {candidate.experience.years} Yrs Exp
                        </span>
                      </div>

                      {/* Brief candidate summary */}
                      {candidate.summary && (
                        <p className="mt-1 line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          {candidate.summary}
                        </p>
                      )}

                      {/* Skills tags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.2 text-[9px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 4 && (
                          <span className="self-center text-[9px] font-semibold text-slate-400">
                            +{candidate.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Score breakdown & Compare trigger */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {/* Mini Dimension Bars */}
                    <div className="hidden md:flex flex-col gap-1 w-24 text-[9px]">
                      <div className="flex justify-between text-slate-500">
                        <span>Tech Fit</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {candidate.technical_score}%
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${candidate.technical_score}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Experience</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {candidate.experience_score}%
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${candidate.experience_score}%` }}
                        />
                      </div>
                    </div>

                    {/* Overall Score Pill */}
                    <div className="flex flex-col items-end">
                      <div
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 shadow-2xs ${badge.pill}`}
                      >
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-black tabular-nums">{candidate.score}%</span>
                      </div>
                      <span className="mt-0.5 text-[9px] font-semibold text-slate-400">
                        {badge.label}
                      </span>
                    </div>

                    {/* Compare Selection Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCompare(candidate.id);
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800"
                      }`}
                      title={isSelected ? "Remove from comparison" : "Select to compare"}
                    >
                      {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : <Scale className="h-3.5 w-3.5" />}
                    </button>

                    {/* View Arrow */}
                    <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
