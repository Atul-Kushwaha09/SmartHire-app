"use client";

import React, { useState } from "react";
import { Briefcase, Sparkles, FileText, CheckCircle2, ChevronRight, Code2, BrainCircuit, Rocket, Compass, Target, ArrowRight } from "lucide-react";
import { API_BASE } from "../config";

interface JobInputProps {
  onJobCreated: (job: any) => void;
  activeJob: any;
}

const CATEGORIES = [
  { id: "all", label: "All Presets" },
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
    <div className="glass-panel relative overflow-hidden rounded-2xl p-6 transition-all duration-300">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/12 via-purple-500/8 to-transparent blur-3xl" />

      {/* Header */}
      <div className="mb-5 flex items-center gap-3 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white">
            Job Specification
          </h2>
          <p className="text-[11px] text-slate-500">
            Define the screening criteria & required competencies
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-3 flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-lg px-2.5 py-1.5 font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/25"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Preset Cards */}
      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filteredTemplates.map((tmpl, idx) => {
          const Icon = tmpl.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(tmpl)}
              className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-all hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/20">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {tmpl.title}
                  </div>
                  <div className="text-[10px] text-slate-500">{tmpl.badge}</div>
                </div>
              </div>
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-indigo-400 group-hover:scale-110" />
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="job-title" className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Role / Position Title</span>
            <span className="text-[10px] font-normal text-slate-600">e.g. Senior Backend Engineer</span>
          </label>
          <input
            id="job-title"
            type="text"
            required
            placeholder="e.g. Lead Cloud Architect"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label htmlFor="job-desc" className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Requirements & Description</span>
            <span className="text-[10px] font-normal text-slate-600">Skills, responsibilities, tools</span>
          </label>
          <textarea
            id="job-desc"
            required
            rows={4}
            placeholder="Outline required programming languages, frameworks, target years of experience, and role expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-xs leading-relaxed text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !description.trim()}
          className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-xs font-black text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing & Creating Pipeline...</span>
            </div>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Launch Screening Pipeline</span>
              <ArrowRight className="h-4 w-4 opacity-70" />
            </>
          )}
        </button>
      </form>

      {/* Success Toast */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3.5 py-2.5 text-xs font-medium text-emerald-400 animate-fade-up">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Active Pipeline Profile */}
      {activeJob && (
        <div className="mt-5 rounded-xl border border-indigo-500/15 bg-indigo-500/[0.04] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              Active Pipeline
            </span>
            <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
              #{activeJob.id}
            </span>
          </div>
          <h3 className="mt-1 text-sm font-bold text-white">
            {activeJob.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {activeJob.description}
          </p>
          {activeJob.requirements && activeJob.requirements.length > 0 && (
            <div className="mt-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Match Criteria ({activeJob.requirements.length}):
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {activeJob.requirements.map((req: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-md border border-indigo-500/15 bg-indigo-500/8 px-2 py-0.5 text-[10px] font-semibold text-indigo-300"
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
