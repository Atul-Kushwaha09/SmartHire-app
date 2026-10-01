"use client";

import React, { useState, useEffect } from "react";
import {
  X, Briefcase, GraduationCap, Award, FileText, CheckCircle2,
  Sparkles, Mail, Phone, Copy, Check, ChevronRight, BrainCircuit,
  Calendar, ExternalLink, TrendingUp, CheckCircle, AlertTriangle
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

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

interface CandidateDetailProps {
  candidate: Candidate | null;
  onClose: () => void;
}

// Radial gauge component optimized for light and dark backgrounds
function RadialGauge({ score, size = 110 }: { score: number; size?: number }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const color = score >= 80 ? "#059669" : score >= 50 ? "#d97706" : "#e11d48";

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="currentColor" strokeWidth="8" fill="none"
          className="text-slate-100 dark:text-slate-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black tabular-nums" style={{ color }}>
          {score}%
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Match
        </span>
      </div>
    </div>
  );
}

export default function CandidateDetail({ candidate, onClose }: CandidateDetailProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "experience" | "resume">("summary");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!candidate) return null;

  const handleCopyResume = () => {
    if (candidate.resume_text) {
      navigator.clipboard.writeText(candidate.resume_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const chartData = [
    { name: "Technical Fit", score: candidate.technical_score, fill: "#4f46e5" },
    { name: "Experience", score: candidate.experience_score, fill: "#0284c7" },
    { name: "Education", score: candidate.education_score, fill: "#059669" },
  ];

  const tabs = [
    { key: "summary" as const, label: "Match Evaluation" },
    { key: "experience" as const, label: "Skills & Experience" },
    { key: "resume" as const, label: "Full Resume Text" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      {/* Clickable Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl animate-slide-in-right sm:w-[540px] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 font-black text-sm text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800">
              {candidate.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Candidate Dossier
                </span>
                <span className="rounded-md bg-slate-200/70 px-1.5 py-0.2 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  #{candidate.id}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {candidate.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contact Info Strip */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/40 px-5 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
          {candidate.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              {candidate.email}
            </span>
          )}
          {candidate.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-indigo-500" />
              {candidate.phone}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
            <Calendar className="h-3.5 w-3.5" />
            {candidate.experience.years} Yrs Exp
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-bold dark:border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-center transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/40 dark:border-indigo-400 dark:text-indigo-400 dark:bg-indigo-950/20"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "summary" && (
            <>
              {/* Radial Score + Dimension Breakdown */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex items-center gap-5">
                  <RadialGauge score={candidate.score} />
                  <div className="flex-1 space-y-2.5">
                    {[
                      { label: "Technical Competencies", value: candidate.technical_score, color: "bg-indigo-600" },
                      { label: "Role Experience Depth", value: candidate.experience_score, color: "bg-blue-600" },
                      { label: "Education & Background", value: candidate.education_score, color: "bg-emerald-600" },
                    ].map((dim) => (
                      <div key={dim.label}>
                        <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                          <span className="text-slate-600 dark:text-slate-400">{dim.label}</span>
                          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                            {dim.value}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className={`h-full ${dim.color} rounded-full transition-all duration-500`}
                            style={{ width: `${dim.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Evaluation Summary */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    AI Evaluation Summary
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {candidate.summary || "No qualitative synthesis available."}
                </p>
              </div>

              {/* Top Identified Skills */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Identified Skills ({candidate.skills.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-indigo-200/80 bg-indigo-50/70 px-2 py-0.5 text-[11px] font-medium text-indigo-800 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Banner */}
              {candidate.education && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Education Background</span>
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {candidate.education}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "experience" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Career Track Record</span>
                  </h4>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {candidate.experience.years} Total Years
                  </span>
                </div>

                {/* Roles & Companies */}
                {candidate.experience.roles.length > 0 ? (
                  <div className="space-y-2.5">
                    {candidate.experience.roles.map((role, rIdx) => {
                      const company = candidate.experience.companies[rIdx] || "Organization";
                      return (
                        <div
                          key={rIdx}
                          className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] dark:bg-indigo-900/50 dark:text-indigo-300">
                            {rIdx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {role}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {company}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No specific role milestones segmented.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "resume" && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Extracted Resume Text
                </span>
                <button
                  type="button"
                  onClick={handleCopyResume}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3.5 font-mono text-[11px] leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                {candidate.resume_text || "Resume text unavailable."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
