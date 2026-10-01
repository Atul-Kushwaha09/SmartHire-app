"use client";

import React, { useState, useEffect } from "react";
import {
  X, Briefcase, GraduationCap, Award, FileText, CheckCircle2,
  Sparkles, Mail, Phone, Copy, Check, ChevronRight, BrainCircuit,
  Calendar, ExternalLink, TrendingUp
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

// Radial gauge component
function RadialGauge({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const color = score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#fb7185";
  const bgColor = score >= 80 ? "rgba(52,211,153,0.1)" : score >= 50 ? "rgba(251,191,36,0.1)" : "rgba(251,113,133,0.1)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="rgba(148,163,184,0.08)" strokeWidth="8" fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black tabular-nums" style={{ color }}>
          {score}%
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
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
    { name: "Technical Fit", score: candidate.technical_score, fill: "#818cf8" },
    { name: "Experience", score: candidate.experience_score, fill: "#22d3ee" },
    { name: "Education", score: candidate.education_score, fill: "#34d399" }
  ];

  const tabs = [
    { key: "summary" as const, label: "Match Evaluation" },
    { key: "experience" as const, label: "Skills & Experience" },
    { key: "resume" as const, label: "Raw Resume" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">

      {/* Clickable Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-white/[0.06] bg-[#0a0f1a] text-slate-100 shadow-2xl animate-slide-in-right sm:w-[560px]">

        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-base shadow-lg shadow-indigo-500/20">
              {candidate.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Candidate Dossier
                </span>
                <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                  #{candidate.id}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">{candidate.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contact Info Strip */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.04] bg-white/[0.01] px-6 py-2.5 text-xs text-slate-500">
          {candidate.email && (
            <span className="flex items-center gap-1.5 text-slate-400">
              <Mail className="h-3.5 w-3.5 text-indigo-400/70" />
              {candidate.email}
            </span>
          )}
          {candidate.phone && (
            <span className="flex items-center gap-1.5 text-slate-400">
              <Phone className="h-3.5 w-3.5 text-indigo-400/70" />
              {candidate.phone}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-indigo-400 font-semibold ml-auto">
            <Calendar className="h-3.5 w-3.5" />
            {candidate.experience.years} Yrs Experience
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.06] text-[11px] font-bold">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-center transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/[0.04]"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {activeTab === "summary" && (
            <>
              {/* Radial Score + Dimension Breakdown */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 via-[#0a0f1a] to-purple-950/20 p-6">
                <div className="flex items-center gap-6">
                  <RadialGauge score={candidate.score} />
                  <div className="flex-1 space-y-3">
                    {/* Dimension mini bars */}
                    {[
                      { label: "Technical Fit", value: candidate.technical_score, color: "bg-indigo-500" },
                      { label: "Experience", value: candidate.experience_score, color: "bg-cyan-500" },
                      { label: "Education", value: candidate.education_score, color: "bg-emerald-500" },
                    ].map((dim) => (
                      <div key={dim.label}>
                        <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                          <span className="text-slate-400">{dim.label}</span>
                          <span className="text-white tabular-nums">{dim.value}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className={`h-full ${dim.color} rounded-full transition-all duration-700`}
                            style={{ width: `${dim.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Verdict */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    AI Semantic Verdict
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {candidate.summary || "Candidate demonstrated relevant qualifications matching the target pipeline role."}
                </p>
              </div>

              {/* Dimension Chart */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">
                  Dimension Alignment
                </span>
                <div className="h-44 w-full">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={11} />
                        <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={85} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#1e293b",
                            borderRadius: "12px",
                            fontSize: "12px",
                            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)"
                          }}
                        />
                        <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "experience" && (
            <>
              {/* Skills */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-3 text-cyan-400">
                  <BrainCircuit className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Extracted Skills ({candidate.skills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-indigo-500/30 hover:bg-indigo-500/8"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Timeline */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-4 text-indigo-400">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Career Timeline
                  </span>
                </div>
                {candidate.experience.roles && candidate.experience.roles.length > 0 ? (
                  <div className="space-y-0">
                    {candidate.experience.roles.map((role, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 pl-4 pb-4 last:pb-0">
                        {/* Timeline line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-indigo-500/20 to-transparent" />
                        {/* Timeline dot */}
                        <div className="absolute -left-[3px] top-1.5 h-[7px] w-[7px] rounded-full bg-indigo-500 ring-2 ring-[#0a0f1a]" />
                        <div>
                          <div className="text-xs font-bold text-white">{role}</div>
                          {candidate.experience.companies[idx] && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{candidate.experience.companies[idx]}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No structured roles found in resume text.</p>
                )}
              </div>

              {/* Education */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Education & Credentials
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {candidate.education || "Self-taught / Not explicitly specified"}
                </p>
              </div>
            </>
          )}

          {activeTab === "resume" && (
            <div className="rounded-2xl border border-white/[0.06] bg-[#060a12] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Parsed Text Content
                </span>
                <button
                  onClick={handleCopyResume}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-400">
                {candidate.resume_text || "No raw text available."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
