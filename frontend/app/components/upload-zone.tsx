"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, AlertCircle, CheckCircle2,
  RefreshCcw, Sparkles, FolderUp, ArrowUpFromLine
} from "lucide-react";
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
    <div className="glass-panel relative rounded-2xl p-5 transition-all duration-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-xs">
            <ArrowUpFromLine className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Resume Ingestion
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upload candidate CVs for AI evaluation
            </p>
          </div>
        </div>

        {/* Quick Demo Upload Button */}
        {activeJobId && (
          <button
            type="button"
            onClick={handleLoadDemoResumes}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
            title="Load sample candidates"
          >
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>Sample CVs</span>
          </button>
        )}
      </div>

      {/* Warning if no active role */}
      {!activeJobId && (
        <div className="mb-3.5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Please select or establish a target role first.</span>
        </div>
      )}

      {/* Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 px-4 text-center transition-all ${
          !activeJobId
            ? "cursor-not-allowed border-slate-200 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-900/20"
            : isDragActive
            ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/30 scale-[1.01]"
            : "cursor-pointer border-slate-200 bg-slate-50/40 hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/15"
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

        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition ${
          isDragActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
            : "bg-white text-slate-500 shadow-xs border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
        }`}>
          <UploadCloud className="h-5 w-5" />
        </div>

        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Click or drag & drop candidate resumes
        </p>
        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
          Supports multiple PDF, DOCX, DOC, or TXT profiles
        </p>
      </div>

      {/* Uploading File Logs */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Processing Queue ({files.length})</span>
            {isProcessing && (
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <RefreshCcw className="h-3 w-3 animate-spin" />
                Scoring with AI...
              </span>
            )}
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-xs dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className={`h-4 w-4 shrink-0 ${file.status === "error" ? "text-rose-500" : "text-indigo-600 dark:text-indigo-400"}`} />
                    <span className="truncate text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-[10px] font-mono text-slate-400">
                      ({formatSize(file.size)})
                    </span>
                  </div>

                  <div className="shrink-0 text-[10px] font-semibold">
                    {file.status === "uploading" && (
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <RefreshCcw className="h-2.5 w-2.5 animate-spin" />
                        Evaluating...
                      </span>
                    )}
                    {file.status === "success" && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Parsed
                      </span>
                    )}
                    {file.status === "error" && (
                      <span className="flex items-center gap-1 text-rose-500">
                        <AlertCircle className="h-3 w-3" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                {file.status === "uploading" && (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
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
