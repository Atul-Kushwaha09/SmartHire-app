"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles, Activity, Layers, Trash2, Cpu, Moon, Sun,
  BarChart3, Users, Award, CheckCircle2, Zap, TrendingUp,
  Shield, ArrowRight, Clock
} from "lucide-react";
import { API_BASE } from "../config";
import { createSampleResumeFiles } from "../sample-data";
import JobInput from "./job-input";
import UploadZone from "./upload-zone";
import Leaderboard from "./leaderboard";
import CandidateDetail from "./candidate-detail";
import ComparisonMatrix from "./comparison-matrix";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  created_at: string;
}

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

// Animated counter hook
function useAnimatedCount(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [comparingIds, setComparingIds] = useState<number[] | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    ollama_status: string;
    message: string;
  } | null>(null);

  // Initialize theme and fetch jobs & health
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }

    Promise.all([fetchJobs(), checkHealth()]).finally(() => {
      setTimeout(() => setInitialLoading(false), 400);
    });
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  // Fetch candidates whenever active job changes
  useEffect(() => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
    } else {
      setCandidates([]);
    }
  }, [activeJob]);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data);
      }
    } catch (e) {
      console.warn("Backend server not reachable yet.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        if (data.length > 0 && !activeJob) {
          setActiveJob(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load jobs list", err);
    }
  };

  const fetchCandidates = async (jobId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/candidates`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setActiveJob(newJob);
  };

  const handleCandidatesProcessed = () => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
    }
  };

  const handleDeleteJob = async (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this screening pipeline? All candidates will be removed.")) return;

    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        if (activeJob?.id === jobId) {
          setActiveJob(null);
        }
      }
    } catch (err) {
      alert("Failed to delete pipeline.");
    }
  };

  // 1-Click Interactive Demo Loader
  const handleLoadDemoPipeline = async () => {
    setDemoLoading(true);
    try {
      const jobRes = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Senior Full-Stack Engineer",
          description: "We are looking for a Senior Full-Stack Engineer to build scalable web applications. Required skills: Python, React, Next.js, FastAPI, Docker, and PostgreSQL. Candidates must have 5+ years of experience, design robust microservices, and lead technical architectures.",
        }),
      });

      if (!jobRes.ok) throw new Error("Could not create demo pipeline");
      const newJob = await jobRes.json();
      setJobs((prev) => [newJob, ...prev]);
      setActiveJob(newJob);

      const sampleFiles = createSampleResumeFiles();
      const formData = new FormData();
      sampleFiles.forEach((file) => formData.append("files", file));

      const uploadRes = await fetch(`${API_BASE}/api/jobs/${newJob.id}/resumes`, {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        await fetchCandidates(newJob.id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to auto-load demo pipeline.");
    } finally {
      setDemoLoading(false);
    }
  };

  // Calculations for stats
  const topCandidate = candidates.length > 0
    ? [...candidates].sort((a, b) => b.score - a.score)[0]
    : null;
  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)
    : 0;
  const qualifiedCount = candidates.filter((c) => c.score >= 80).length;

  // Animated stats
  const animCandidates = useAnimatedCount(candidates.length);
  const animTopScore = useAnimatedCount(topCandidate?.score || 0);
  const animQualified = useAnimatedCount(qualifiedCount);
  const animAvg = useAnimatedCount(avgScore);

  // Current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mesh-bg min-h-screen pb-24 transition-colors duration-400 relative">
      {/* Content sits above noise layer */}
      <div className="relative z-10">

        {/* ─── Premium Glass Header ─── */}
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[var(--bg-primary)]/80 backdrop-blur-2xl transition-colors duration-300">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">

            {/* Logo & Brand */}
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/30">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0a0f1a]">
                  <Sparkles className="h-[18px] w-[18px] text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white">
                    SMARTSCREENER
                  </span>
                  <span className="rounded-md bg-gradient-to-r from-indigo-500/15 to-purple-500/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                    AI v1.0
                  </span>
                </div>
                <span className="text-[10px] font-medium tracking-wider text-slate-400 dark:text-slate-500">
                  Intelligent Resume Screening & Ranking
                </span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-2.5">

              {/* Quick Demo */}
              <button
                onClick={handleLoadDemoPipeline}
                disabled={demoLoading}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-indigo-500/25 bg-indigo-500/8 px-3.5 py-2 text-[11px] font-bold text-indigo-500 transition-all hover:bg-indigo-500/15 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 disabled:opacity-40 dark:text-indigo-400"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{demoLoading ? "Loading Demo..." : "Quick Demo"}</span>
              </button>

              {/* Health Badge */}
              {healthStatus && (
                <div className={`hidden md:flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold ${
                  healthStatus.ollama_status === "connected"
                    ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-500 dark:text-emerald-400"
                    : "border-amber-500/25 bg-amber-500/8 text-amber-500 dark:text-amber-400"
                }`}>
                  <span className={`relative flex h-2 w-2`}>
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      healthStatus.ollama_status === "connected" ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                    }`} />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${
                      healthStatus.ollama_status === "connected" ? "bg-emerald-500" : "bg-amber-500"
                    }`} />
                  </span>
                  {healthStatus.ollama_status === "connected" ? (
                    <>
                      <Cpu className="h-3.5 w-3.5" />
                      <span>Ollama LLM</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-3.5 w-3.5" />
                      <span>Local NLP</span>
                    </>
                  )}
                </div>
              )}

              {/* Pipeline Selector */}
              {jobs.length > 0 && (
                <div className="hidden lg:flex items-center">
                  <select
                    value={activeJob?.id || ""}
                    onChange={(e) => {
                      const job = jobs.find((j) => j.id === Number(e.target.value));
                      if (job) setActiveJob(job);
                    }}
                    className="rounded-xl border border-white/[0.08] bg-white/5 py-2 px-3 text-[11px] font-semibold text-slate-300 outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 dark:bg-slate-900/60"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.requirements.length} skills)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
                title="Toggle color theme"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* ─── Main Workspace ─── */}
        <main className="mx-auto max-w-[1400px] px-6 pt-8">

          {/* KPI Stats Bar — animated counters */}
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

            {/* Stat 1: Active Role */}
            <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "0ms" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Active Pipeline
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5 truncate text-[15px] font-black text-slate-900 dark:text-white">
                {activeJob ? activeJob.title : "No Active Pipeline"}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {activeJob ? `${activeJob.requirements.length} match criteria` : "Create a role to begin"}
              </p>
            </div>

            {/* Stat 2: Candidates Screened */}
            <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Resumes Evaluated
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5 text-2xl font-black tabular-nums text-slate-900 dark:text-white animate-count-up">
                {animCandidates}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Applicants in current pipeline
              </p>
            </div>

            {/* Stat 3: Top Match Score */}
            <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "160ms" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Top Match Score
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5 text-2xl font-black tabular-nums text-indigo-500 dark:text-indigo-400 animate-count-up">
                {topCandidate ? `${animTopScore}%` : "—"}
              </div>
              <p className="mt-1 truncate text-[11px] text-slate-500">
                {topCandidate ? topCandidate.name : "Awaiting resumes"}
              </p>
            </div>

            {/* Stat 4: Qualified Ratio */}
            <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  High-Fit Candidates
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black tabular-nums text-emerald-500 dark:text-emerald-400 animate-count-up">
                  {animQualified}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  ≥80% match
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Average pipeline score: <span className="font-bold text-slate-400">{animAvg}%</span>
              </p>
            </div>
          </div>

          {/* ─── 2-Column Application Layout ─── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            {/* Left Column */}
            <div className="space-y-6 lg:col-span-5">
              <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
                <JobInput onJobCreated={handleJobCreated} activeJob={activeJob} />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: "180ms" }}>
                <UploadZone
                  activeJobId={activeJob ? activeJob.id : null}
                  onCandidatesProcessed={handleCandidatesProcessed}
                />
              </div>

              {/* Existing Pipelines Drawer */}
              {jobs.length > 0 && (
                <div className="glass-panel rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "260ms" }}>
                  <div className="mb-3.5 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <Layers className="h-3.5 w-3.5 text-indigo-500" />
                      Screening Pipelines ({jobs.length})
                    </h3>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setActiveJob(job)}
                        className={`group flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                          activeJob?.id === job.id
                            ? "border-indigo-500/50 bg-indigo-500/8 shadow-sm shadow-indigo-500/5"
                            : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className={`text-xs font-bold truncate ${
                            activeJob?.id === job.id ? "text-indigo-400" : "text-slate-200"
                          }`}>
                            {job.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {new Date(job.created_at).toLocaleDateString()} • {job.requirements.length} skills
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {activeJob?.id === job.id && (
                            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[9px] font-black text-indigo-400">
                              Active
                            </span>
                          )}
                          <button
                            onClick={(e) => handleDeleteJob(job.id, e)}
                            title="Delete pipeline"
                            className="opacity-0 group-hover:opacity-100 transition rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Leaderboard */}
            <div className="lg:col-span-7 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Leaderboard
                candidates={candidates}
                onSelectCandidate={setActiveCandidate}
                onCompareCandidates={setComparingIds}
              />
            </div>
          </div>
        </main>

        {/* ─── Footer ─── */}
        <footer className="mt-16 border-t border-white/[0.04] py-6">
          <div className="mx-auto max-w-[1400px] px-6 flex items-center justify-between">
            <p className="text-[11px] text-slate-600 dark:text-slate-500">
              © {new Date().getFullYear()} SmartScreener • AI-Powered Recruitment
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-500">
              <Shield className="h-3 w-3" />
              <span>Data processed locally</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ─── Floating Candidate Detail Drawer ─── */}
      <CandidateDetail
        candidate={activeCandidate}
        onClose={() => setActiveCandidate(null)}
      />

      {/* ─── Floating Comparison Matrix Modal ─── */}
      {comparingIds && activeJob && (
        <ComparisonMatrix
          jobId={activeJob.id}
          candidateIds={comparingIds}
          onClose={() => setComparingIds(null)}
        />
      )}
    </div>
  );
}
