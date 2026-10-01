"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, Activity, Layers, Trash2, Cpu, Moon, Sun,
  BarChart3, Users, Award, CheckCircle2, Zap, TrendingUp,
  Shield, ArrowRight, Clock, ChevronRight, PanelLeftClose,
  PanelLeft, PlusCircle, UploadCloud, Briefcase
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
function useAnimatedCount(target: number, duration = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Compact layout and sidebar collapsible states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompactView, setIsCompactView] = useState(false);
  const [workstationTab, setWorkstationTab] = useState<"spec" | "upload" | "pipelines">("spec");

  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    ollama_status: string;
    message: string;
  } | null>(null);

  // Initialize theme (default to light mode as requested) & fetch initial data
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    Promise.all([fetchJobs(), checkHealth()]).finally(() => {
      setTimeout(() => setInitialLoading(false), 300);
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
    // Smoothly switch tab to resume upload for direct workflow
    setWorkstationTab("upload");
  };

  const handleCandidatesProcessed = () => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
    }
  };

  const handleDeleteJob = async (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this screening pipeline? All candidates will be removed."))
      return;

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
          description:
            "We are looking for a Senior Full-Stack Engineer to build scalable web applications. Required skills: Python, React, Next.js, FastAPI, Docker, and PostgreSQL. Candidates must have 5+ years of experience, design robust microservices, and lead technical architectures.",
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
  const topCandidate =
    candidates.length > 0
      ? [...candidates].sort((a, b) => b.score - a.score)[0]
      : null;
  const avgScore =
    candidates.length > 0
      ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)
      : 0;
  const qualifiedCount = candidates.filter((c) => c.score >= 80).length;

  // Animated counters
  const animCandidates = useAnimatedCount(candidates.length);
  const animTopScore = useAnimatedCount(topCandidate?.score || 0);
  const animQualified = useAnimatedCount(qualifiedCount);
  const animAvg = useAnimatedCount(avgScore);

  return (
    <div className="mesh-bg min-h-screen pb-16 transition-colors duration-300 relative text-slate-900 dark:text-slate-100">
      <div className="relative z-10">
        {/* ─── Modern Enterprise Top Navigation ─── */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90 shadow-2xs">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 py-2.5">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-xs">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                    SmartHire
                  </span>
                  <span className="rounded-md bg-indigo-50 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                    AI Platform
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  Intelligent Candidate Screening & Evaluation
                </span>
              </div>
            </div>

            {/* Middle: Active Pipeline Chip / Switcher */}
            {jobs.length > 0 && (
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Role:
                </span>
                <select
                  value={activeJob?.id || ""}
                  onChange={(e) => {
                    const job = jobs.find((j) => j.id === Number(e.target.value));
                    if (job) setActiveJob(job);
                  }}
                  className="bg-transparent font-semibold text-slate-800 outline-none dark:text-slate-200 max-w-[200px] truncate cursor-pointer"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id} className="dark:bg-slate-900">
                      {job.title}
                    </option>
                  ))}
                </select>
                <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {candidates.length} Applicants
                </span>
              </div>
            )}

            {/* Right Action Controls */}
            <div className="flex items-center gap-2">
              {/* Quick Demo Button */}
              <button
                onClick={handleLoadDemoPipeline}
                disabled={demoLoading}
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-300 disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{demoLoading ? "Loading..." : "Quick Demo"}</span>
              </button>

              {/* AI Engine Status */}
              {healthStatus && (
                <div
                  className={`hidden lg:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                    healthStatus.ollama_status === "connected"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300"
                  }`}
                  title={healthStatus.message}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        healthStatus.ollama_status === "connected"
                          ? "bg-emerald-400 animate-ping"
                          : "bg-blue-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-2 w-2 rounded-full ${
                        healthStatus.ollama_status === "connected" ? "bg-emerald-500" : "bg-blue-500"
                      }`}
                    />
                  </span>
                  <span className="text-[11px]">
                    {healthStatus.ollama_status === "connected" ? "Ollama LLM" : "Local NLP"}
                  </span>
                </div>
              )}

              {/* Sidebar Toggle for Wide Screen Candidate Review */}
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                title={isSidebarOpen ? "Collapse Setup Sidebar" : "Expand Setup Sidebar"}
              >
                {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                title="Toggle light / dark theme"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* ─── Main Workspace ─── */}
        <main className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-5">
          {/* Compact KPI Metrics Banner */}
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {/* Tile 1: Active Role */}
            <div className="glass-card rounded-xl p-3.5 animate-fade-up">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Target Role
                </span>
                <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="mt-1.5 truncate text-sm font-bold text-slate-900 dark:text-white">
                {activeJob ? activeJob.title : "No Role Established"}
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                {activeJob
                  ? `${activeJob.requirements.length} Match Criteria Configured`
                  : "Create role criteria to begin"}
              </p>
            </div>

            {/* Tile 2: Candidates Screened */}
            <div
              className="glass-card rounded-xl p-3.5 animate-fade-up"
              style={{ animationDelay: "60ms" }}
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Screened Candidates
                </span>
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-1.5 text-xl font-black tabular-nums text-slate-900 dark:text-white">
                {animCandidates}
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Applicants parsed & evaluated
              </p>
            </div>

            {/* Tile 3: Top Match Score */}
            <div
              className="glass-card rounded-xl p-3.5 animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Top Match Score
                </span>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-1.5 text-xl font-black tabular-nums text-indigo-600 dark:text-indigo-400">
                {topCandidate ? `${animTopScore}%` : "—"}
              </div>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {topCandidate ? topCandidate.name : "Awaiting applicant resumes"}
              </p>
            </div>

            {/* Tile 4: Qualified Ratio */}
            <div
              className="glass-card rounded-xl p-3.5 animate-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  High-Fit Candidates
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                  {animQualified}
                </span>
                <span className="text-[11px] text-slate-400">≥80% match</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Average score: <span className="font-bold text-slate-700 dark:text-slate-300">{animAvg}%</span>
              </p>
            </div>
          </div>

          {/* ─── Main Grid Layout (Adaptive & Compactable) ─── */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
            {/* Left Workstation Column (Collapsible) */}
            {isSidebarOpen && (
              <div className="space-y-4 lg:col-span-5 transition-all">
                {/* Segmented Workstation Tabs */}
                <div className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setWorkstationTab("spec")}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                      workstationTab === "spec"
                        ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400 font-bold"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Role Criteria</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkstationTab("upload")}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                      workstationTab === "upload"
                        ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400 font-bold"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Ingest CVs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkstationTab("pipelines")}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
                      workstationTab === "pipelines"
                        ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400 font-bold"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Pipelines ({jobs.length})</span>
                  </button>
                </div>

                {/* Tab 1: Role Specification */}
                {workstationTab === "spec" && (
                  <div className="animate-fade-up">
                    <JobInput onJobCreated={handleJobCreated} activeJob={activeJob} />
                  </div>
                )}

                {/* Tab 2: Resume Ingestion */}
                {workstationTab === "upload" && (
                  <div className="animate-fade-up">
                    <UploadZone
                      activeJobId={activeJob ? activeJob.id : null}
                      onCandidatesProcessed={handleCandidatesProcessed}
                    />
                  </div>
                )}

                {/* Tab 3: Pipelines Management */}
                {workstationTab === "pipelines" && (
                  <div className="glass-panel rounded-2xl p-4 animate-fade-up">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Saved Screening Pipelines
                      </h3>
                      <button
                        onClick={() => setWorkstationTab("spec")}
                        className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        + New Role
                      </button>
                    </div>

                    {jobs.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">
                        No pipelines created yet.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {jobs.map((job) => (
                          <div
                            key={job.id}
                            onClick={() => setActiveJob(job)}
                            className={`group flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition-all ${
                              activeJob?.id === job.id
                                ? "border-indigo-400 bg-indigo-50/60 shadow-xs dark:border-indigo-500/50 dark:bg-indigo-950/30"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <p
                                className={`text-xs font-bold truncate ${
                                  activeJob?.id === job.id
                                    ? "text-indigo-700 dark:text-indigo-400"
                                    : "text-slate-800 dark:text-slate-200"
                                }`}
                              >
                                {job.title}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {new Date(job.created_at).toLocaleDateString()} •{" "}
                                {job.requirements.length} skills
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {activeJob?.id === job.id && (
                                <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                  Active
                                </span>
                              )}
                              <button
                                onClick={(e) => handleDeleteJob(job.id, e)}
                                title="Delete pipeline"
                                className="opacity-0 group-hover:opacity-100 transition rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Right Column: Leaderboard (Expands to full width when sidebar is collapsed) */}
            <div
              className={`transition-all ${
                isSidebarOpen ? "lg:col-span-7" : "lg:col-span-12"
              }`}
            >
              <Leaderboard
                candidates={candidates}
                onSelectCandidate={setActiveCandidate}
                onCompareCandidates={setComparingIds}
                isCompact={isCompactView}
                onToggleCompact={() => setIsCompactView((prev) => !prev)}
              />
            </div>
          </div>
        </main>

        {/* ─── Footer ─── */}
        <footer className="mt-12 border-t border-slate-200 py-4 text-xs dark:border-slate-800">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 flex items-center justify-between text-slate-500">
            <p className="text-[11px]">
              © {new Date().getFullYear()} SmartHire • Intelligent Candidate Screening
            </p>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Data processed locally & securely</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Candidate Detail Drawer */}
      <CandidateDetail
        candidate={activeCandidate}
        onClose={() => setActiveCandidate(null)}
      />

      {/* Floating Comparison Matrix Modal */}
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
