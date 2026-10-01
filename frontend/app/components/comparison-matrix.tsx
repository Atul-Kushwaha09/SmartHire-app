"use client";

import React, { useState, useEffect } from "react";
import {
  X, Award, Briefcase, GraduationCap, Mail, Phone,
  Scale, Sparkles, Crown, Trophy, TrendingUp, CheckCircle2
} from "lucide-react";
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

function CompareBar({ value, max, color }: { value: number; max: number; color: string }) {
  const isWinner = value === max && max > 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span
        className={`text-xs font-black tabular-nums ${
          isWinner ? "text-indigo-600 dark:text-indigo-400 font-extrabold" : "text-slate-600 dark:text-slate-400"
        }`}
      >
        {value}%
      </span>
      {isWinner && <span className="text-[10px] text-amber-500 font-black">★</span>}
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

  const maxScore = candidates.length > 0 ? Math.max(...candidates.map((c) => c.score)) : 0;
  const maxExp = candidates.length > 0 ? Math.max(...candidates.map((c) => c.experience.years)) : 0;
  const maxTech = candidates.length > 0 ? Math.max(...candidates.map((c) => c.technical_score)) : 0;
  const maxEdu = candidates.length > 0 ? Math.max(...candidates.map((c) => c.education_score)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex flex-col w-full max-w-5xl h-full max-h-[88vh] rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden animate-scale-in dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 p-5 shrink-0 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Multi-Candidate Comparison Matrix
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Side-by-side dimensional benchmarking across {candidates.length} candidates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Table / Columns */}
        <div className="flex-1 overflow-auto p-5">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-500">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span className="text-xs font-medium">Computing comparative metrics...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((c) => {
                const isOverallWinner = c.score === maxScore && maxScore > 0;

                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                      isOverallWinner
                        ? "border-indigo-300 bg-indigo-50/20 shadow-sm dark:border-indigo-500/50 dark:bg-indigo-950/20"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60"
                    }`}
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                              {c.name}
                            </h3>
                            {isOverallWinner && (
                              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                <Crown className="h-3 w-3" /> Top Pick
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {c.email || c.phone || "No contact info"}
                          </p>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-lg font-black tabular-nums text-indigo-600 dark:text-indigo-400">
                            {c.score}%
                          </span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">
                            Score
                          </span>
                        </div>
                      </div>

                      {/* Dimension Comparison Bars */}
                      <div className="space-y-2.5 rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40 mb-3">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                              Technical Fit
                            </span>
                          </div>
                          <CompareBar
                            value={c.technical_score}
                            max={maxTech}
                            color="bg-indigo-600 dark:bg-indigo-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                              Experience Match
                            </span>
                          </div>
                          <CompareBar
                            value={c.experience_score}
                            max={maxExp}
                            color="bg-blue-600 dark:bg-blue-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                              Education
                            </span>
                          </div>
                          <CompareBar
                            value={c.education_score}
                            max={maxEdu}
                            color="bg-emerald-600 dark:bg-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Key Profile Stats */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Experience Years</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.experience.years} Yrs
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Education</span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">
                            {c.education || "None listed"}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Top Match Skills ({c.skills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {c.skills.slice(0, 6).map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Summary Quote */}
                    {c.summary && (
                      <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] leading-relaxed text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                        <p className="line-clamp-2 italic">"{c.summary}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
