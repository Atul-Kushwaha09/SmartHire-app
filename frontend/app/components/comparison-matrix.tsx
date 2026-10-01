"use client";

import React, { useState, useEffect } from "react";
import { X, Award, Briefcase, GraduationCap, Mail, Phone, Scale, Sparkles, Crown, Trophy, TrendingUp } from "lucide-react";
import { API_BASE } from "../config";

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

interface ComparisonMatrixProps {
  jobId: number;
  candidateIds: number[];
  onClose: () => void;
}

// Visual bar component for inline comparison
function CompareBar({ value, max, color }: { value: number; max: number; color: string }) {
  const isWinner = value === max && max > 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-black tabular-nums ${isWinner ? "text-white" : "text-slate-400"}`}>
        {value}%
      </span>
      {isWinner && (
        <span className="text-[9px] text-amber-400 font-black">★</span>
      )}
    </div>
  );
}

export default function ComparisonMatrix({ jobId, candidateIds, onClose }: ComparisonMatrixProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparisonData() {
      try {
        const idsParam = candidateIds.join(",");
        const response = await fetch(
          `${API_BASE}/api/jobs/${jobId}/compare?ids=${idsParam}`
        );
        if (!response.ok) throw new Error("Failed to fetch comparison details");
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
        alert("Could not load candidate comparison details.");
      } finally {
        setLoading(false);
      }
    }

    if (candidateIds.length > 0) {
      fetchComparisonData();
    }
  }, [jobId, candidateIds]);

  const maxScore = candidates.length > 0 ? Math.max(...candidates.map(c => c.score)) : 0;
  const maxExp = candidates.length > 0 ? Math.max(...candidates.map(c => c.experience.years)) : 0;
  const maxTech = candidates.length > 0 ? Math.max(...candidates.map(c => c.technical_score)) : 0;
  const maxEdu = candidates.length > 0 ? Math.max(...candidates.map(c => c.education_score)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex flex-col w-full max-w-5xl h-full max-h-[88vh] rounded-3xl border border-white/[0.06] bg-[#0a0f1a] text-slate-100 shadow-2xl overflow-hidden animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] p-6 shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-white">
                Comparison Matrix
              </h2>
              <p className="text-[11px] text-slate-500">
                Side-by-side benchmark across all scoring dimensions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-500 border-t-transparent" />
            <p className="mt-4 text-xs font-semibold text-slate-500">Benchmarking candidates...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6">
            {/* Card-style comparison (responsive) */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${candidates.length}, minmax(260px, 1fr))` }}>
              {candidates.map((cand) => {
                const isOverallWinner = cand.score === maxScore && candidates.length > 1;

                return (
                  <div
                    key={cand.id}
                    className={`rounded-2xl border p-5 space-y-5 transition-all ${
                      isOverallWinner
                        ? "border-amber-500/30 bg-amber-500/[0.04] shadow-lg shadow-amber-500/5"
                        : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    {/* Profile Header */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[2px]">
                        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0f1a] text-xs font-black text-white">
                          {cand.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white truncate">{cand.name}</span>
                          {isOverallWinner && (
                            <Crown className="h-4 w-4 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">#{cand.id}</span>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="text-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Overall Fit</span>
                      <span className={`text-3xl font-black tabular-nums ${
                        cand.score >= 80 ? "text-emerald-400" : cand.score >= 50 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {cand.score}%
                      </span>
                    </div>

                    {/* Dimension Bars */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Technical</span>
                        <CompareBar value={cand.technical_score} max={maxTech} color="bg-indigo-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Experience</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-black text-cyan-400 text-sm tabular-nums">{cand.experience.years} Yrs</span>
                          {cand.experience.years === maxExp && candidates.length > 1 && (
                            <span className="text-[9px] text-amber-400 font-black">★ Most</span>
                          )}
                        </div>
                        <CompareBar value={cand.experience_score} max={Math.max(...candidates.map(c => c.experience_score))} color="bg-cyan-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Education</span>
                        <CompareBar value={cand.education_score} max={maxEdu} color="bg-emerald-500" />
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cand.education || "Not specified"}</p>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="border-t border-white/[0.04] pt-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="h-3 w-3 text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">AI Summary</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-4">
                        {cand.summary || "No summary generated."}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="border-t border-white/[0.04] pt-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">Skills</span>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        {cand.skills.map((s, idx) => (
                          <span key={idx} className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="border-t border-white/[0.04] pt-3 space-y-1 text-[11px] text-slate-500">
                      {cand.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-indigo-400/50" /> {cand.email}
                        </div>
                      )}
                      {cand.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-indigo-400/50" /> {cand.phone}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
