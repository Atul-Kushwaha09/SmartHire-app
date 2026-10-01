"use client";

import React, { useState } from "react";
import {
  Briefcase, Sparkles, FileText, CheckCircle2,
  Code2, BrainCircuit, Rocket, Compass, Target, ArrowRight,
  ChevronDown, ChevronUp
} from "lucide-react";
import { API_BASE } from "../config";

interface JobInputProps {
  onJobCreated: (job: any) => void;
  activeJob: any;
}

const CATEGORIES = [
  { id: "all", label: "All Roles" },
  { id: "engineering", label: "Engineering" },
  { id: "ai", label: "AI & Data" },
  { id: "product", label: "Product & Lead" },
];

const TEMPLATES = [
  {
    category: "engineering",
    icon: Code2,
    badge: "5+ Yrs Exp",
    title: "Senior Full-Stack Engineer",
    description: "We are looking for a Senior Full-Stack Engineer to build scalable web applications. Required skills: Python, React, Next.js, FastAPI, Docker, and PostgreSQL. Candidates must have 5+ years of experience, design robust microservices, and lead technical architectures. Bachelor's or Master's degree in CS preferred.",
  },
  {
    category: "ai",
    icon: BrainCircuit,
    badge: "3+ Yrs Exp",
    title: "AI / Data Scientist",
    description: "Seeking a Data Scientist to build and deploy predictive ML models. Required skills: Python, SQL, Machine Learning, Deep Learning, PyTorch, Scikit-Learn, and NLP. Experience with Large Language Models (LLMs) and data visualization tools is a big plus. 3+ years of experience required.",
  },
  {
    category: "product",
    icon: Rocket,
    badge: "4+ Yrs Exp",
    title: "Technical Product Manager",
    description: "We are hiring a Technical Product Manager to oversee SaaS platform growth. Required skills: Agile, Scrum, Product Management, Jira, Roadmap planning, and system design concepts. You will collaborate with engineering teams to scope features and define product specifications. 4+ years of experience.",
  },
  {
    category: "engineering",
    icon: Compass,
    badge: "Junior / Mid",
    title: "Frontend UI/UX Developer",
    description: "Looking for a talented Frontend UI/UX Developer to build responsive web interfaces. Required skills: JavaScript, TypeScript, React, Next.js, Tailwind CSS, HTML5, CSS3, and Figma. Candidates should emphasize web performance, accessibility (a11y), and micro-animations.",
  }
];

export default function JobInput({ onJobCreated, activeJob }: JobInputProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const filteredTemplates = selectedCategory === "all"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCategory);

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setTitle(template.title);
    setDescription(template.description);
    setMessage(`Applied "${template.title}" template.`);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create job description.");

      const job = await response.json();
      onJobCreated(job);
      setTitle("");
      setDescription("");
      setMessage("Screening pipeline established successfully!");
      setTimeout(() => setMessage(""), 3500);
    } catch (error: any) {
      alert(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel relative rounded-2xl p-5 transition-all duration-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-xs">
            <Target className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Target Role Specification
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Define qualification benchmarks & requirements
            </p>
          </div>
        </div>

        {/* Compact Preset Toggle */}
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <span>Presets</span>
          {showPresets ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Collapsible Presets Section */}
      {showPresets && (
        <div className="mb-4 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/40 animate-fade-up">
          {/* Category Tabs */}
          <div className="mb-2.5 flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-md px-2 py-1 font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {filteredTemplates.map((tmpl, idx) => {
              const Icon = tmpl.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    applyTemplate(tmpl);
                    setShowPresets(false);
                  }}
                  className="group flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2 text-left transition-all hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tmpl.title}
                      </div>
                      <div className="text-[9px] text-slate-400">{tmpl.badge}</div>
                    </div>
                  </div>
                  <Sparkles className="h-3 w-3 shrink-0 text-slate-400 group-hover:text-indigo-500" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="job-title" className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <span>Role / Title</span>
            <span className="text-[10px] font-normal text-slate-400">e.g. Senior Backend Engineer</span>
          </label>
          <input
            id="job-title"
            type="text"
            required
            placeholder="e.g. Lead Cloud Architect"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          />
        </div>

        <div>
          <label htmlFor="job-desc" className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <span>Requirements & Criteria</span>
            <span className="text-[10px] font-normal text-slate-400">Skills, responsibilities, tools</span>
          </label>
          <textarea
            id="job-desc"
            required
            rows={3}
            placeholder="Specify required skills, frameworks, years of experience, and role responsibilities..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs leading-relaxed text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !description.trim()}
          className="relative flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing & Creating Pipeline...</span>
            </div>
          ) : (
            <>
              <FileText className="h-3.5 w-3.5" />
              <span>Establish Screening Pipeline</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-80" />
            </>
          )}
        </button>
      </form>

      {/* Success Notification Feedback */}
      {message && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 animate-fade-up">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Active Job Profile Display */}
      {activeJob && (
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Active Target Role
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              #{activeJob.id}
            </span>
          </div>
          <h3 className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100">
            {activeJob.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {activeJob.description}
          </p>
          {activeJob.requirements && activeJob.requirements.length > 0 && (
            <div className="mt-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Key Criteria ({activeJob.requirements.length}):
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {activeJob.requirements.map((req: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-md border border-indigo-200/80 bg-white px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:border-indigo-800/60 dark:bg-slate-900 dark:text-indigo-300"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
