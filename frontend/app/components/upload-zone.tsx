"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, AlertCircle, CheckCircle2, RefreshCcw, Sparkles, FolderUp, Layers, ArrowUpFromLine, ShieldCheck } from "lucide-react";
import { API_BASE } from "../config";
import { createSampleResumeFiles } from "../sample-data";

interface UploadZoneProps {
  activeJobId: number | null;
  onCandidatesProcessed: (candidates: any[]) => void;
}

interface UploadingFile {
  name: string;
  size: number;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
}

export default function UploadZone({ activeJobId, onCandidatesProcessed }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const triggerInputClick = () => {
    if (!activeJobId) return;
    fileInputRef.current?.click();
  };

  const handleLoadDemoResumes = () => {
    if (!activeJobId) return;
    const sampleFiles = createSampleResumeFiles();
    processFiles(sampleFiles);
  };

  const processFiles = async (fileList: File[]) => {
    if (!activeJobId) return;

    const validExtensions = ["pdf", "docx", "doc", "txt"];
    const uploadList: UploadingFile[] = [];
    const validFiles: File[] = [];

    fileList.forEach((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      if (validExtensions.includes(ext)) {
        uploadList.push({ name: f.name, size: f.size, status: "uploading", progress: 35 });
        validFiles.push(f);
      } else {
        uploadList.push({ name: f.name, size: f.size, status: "error", progress: 0 });
      }
    });

    setFiles(uploadList);
    if (validFiles.length === 0) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      validFiles.forEach((f) => formData.append("files", f));

      setFiles((prev) =>
        prev.map((item) => (item.status === "uploading" ? { ...item, progress: 70 } : item))
      );

      const response = await fetch(`${API_BASE}/api/jobs/${activeJobId}/resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Resume processing failed.");

      const results = await response.json();

      setFiles((prev) =>
        prev.map((item) =>
          item.status === "uploading" ? { ...item, status: "success", progress: 100 } : item
        )
      );

      onCandidatesProcessed(results);
    } catch (err) {
      setFiles((prev) =>
        prev.map((item) => (item.status === "uploading" ? { ...item, status: "error" } : item))
      );
      console.error(err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setFiles([]), 5000);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-6 transition-all duration-300">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-500/8 to-transparent blur-3xl" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <ArrowUpFromLine className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white">
              Resume Ingestion
            </h2>
            <p className="text-[11px] text-slate-500">
              AI-powered parsing & automated match scoring
            </p>
          </div>
        </div>

        {!activeJobId && (
          <span className="flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 px-2.5 py-1 text-[11px] font-semibold text-amber-500 animate-pulse">
            <AlertCircle className="h-3.5 w-3.5" />
            Select pipeline
          </span>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 px-6 text-center transition-all duration-300 ${
          !activeJobId
            ? "cursor-not-allowed border-white/[0.04] bg-white/[0.01] opacity-40"
            : isDragActive
            ? "scale-[1.02] border-indigo-500 bg-indigo-500/8 shadow-xl shadow-indigo-500/15"
            : "cursor-pointer border-white/[0.06] bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/[0.03] hover:shadow-lg hover:shadow-indigo-500/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileSelect}
          className="hidden"
          disabled={!activeJobId}
        />

        {/* Icon */}
        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
          isDragActive
            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-110"
            : "bg-gradient-to-br from-white/[0.06] to-white/[0.02] text-indigo-400 group-hover:scale-105 group-hover:shadow-md"
        }`}>
          <UploadCloud className="h-8 w-8" />
        </div>

        <p className="text-xs font-bold text-slate-200">
          Drag & drop resumes or <span className="text-indigo-400 underline underline-offset-2">browse files</span>
        </p>
        <p className="mt-1.5 text-[11px] text-slate-500">
          Accepts multiple files • PDF, DOCX, DOC, or TXT
        </p>

        {/* Format badges */}
        <div className="mt-3.5 flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
          {[".PDF", ".DOCX", ".TXT"].map((ext) => (
            <span key={ext} className="rounded-md bg-white/[0.04] px-2 py-0.5 border border-white/[0.04]">
              {ext}
            </span>
          ))}
        </div>
      </div>

      {/* Demo Resumes Button */}
      {activeJobId && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-[11px] font-semibold text-slate-400">
              Need test applicants?
            </span>
          </div>
          <button
            type="button"
            onClick={handleLoadDemoResumes}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-[11px] font-bold text-indigo-400 transition hover:bg-indigo-500/20 disabled:opacity-40"
          >
            <Layers className="h-3.5 w-3.5" />
            Load 3 Demo Resumes
          </button>
        </div>
      )}

      {/* Processing Queue */}
      {files.length > 0 && (
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Processing Queue ({files.length})</span>
            {isProcessing && (
              <span className="flex items-center gap-1.5 text-indigo-400">
                <RefreshCcw className="h-3 w-3 animate-spin" />
                Extracting & Scoring
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className={`h-4 w-4 shrink-0 ${file.status === "error" ? "text-rose-400" : "text-indigo-400"}`} />
                    <span className="truncate font-semibold text-slate-200">{file.name}</span>
                    <span className="shrink-0 font-mono text-[10px] text-slate-500">
                      ({formatSize(file.size)})
                    </span>
                  </div>

                  <div className="shrink-0 text-xs font-semibold">
                    {file.status === "uploading" && (
                      <span className="flex items-center gap-1 text-indigo-400">
                        <RefreshCcw className="h-3 w-3 animate-spin" /> Scoring
                      </span>
                    )}
                    {file.status === "success" && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                      </span>
                    )}
                    {file.status === "error" && (
                      <span className="flex items-center gap-1 text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5" /> Failed
                      </span>
                    )}
                  </div>
                </div>

                {file.status === "uploading" && (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
