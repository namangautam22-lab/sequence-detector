"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import SampleSelector from "@/components/SampleSelector";
import ResultsTable from "@/components/ResultsTable";
import PredictionBadge from "@/components/PredictionBadge";
import { WindowPrediction, SAMPLES, LABEL_META, PredictedLabel } from "@/lib/types";

function parseCsvText(text: string): WindowPrediction[] {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) throw new Error("CSV too short");
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = vals[i]?.trim() ?? ""));
    return {
      window_id: row.window_id ?? `W${Math.random().toString(36).slice(2,5)}`,
      film: row.film ?? "Unknown",
      window_start: row.window_start ?? "00:00:00",
      window_end: row.window_end ?? "00:04:00",
      true_is_song: parseInt(row.true_is_song ?? "0") || 0,
      true_is_action: parseInt(row.true_is_action ?? "0") || 0,
      song_prob: parseFloat(row.song_prob ?? "0") || 0,
      action_prob: parseFloat(row.action_prob ?? "0") || 0,
      predicted_label: (row.predicted_label ?? "dialogue/neither") as WindowPrediction["predicted_label"],
      confidence: parseFloat(row.confidence ?? "0") || 0,
      correct: (row.correct === "YES" ? "YES" : "NO") as "YES" | "NO",
    };
  });
}

function StatBadge({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-xs text-[#8888AA]">{label}</span>
      {sub && <span className="text-[10px] text-[#8888AA]/60">{sub}</span>}
    </div>
  );
}

export default function HomePage() {
  const [rows, setRows] = useState<WindowPrediction[]>([]);
  const [activeSample, setActiveSample] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedName, setUploadedName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadSample(id: string) {
    if (!id) { setRows([]); setActiveSample(""); setUploadedName(""); return; }
    setLoading(true);
    setUploadedName("");
    setUploadError("");
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sample_id: id }),
      });
      const data = await res.json();
      setRows(data.predictions);
      setActiveSample(id);
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) { setUploadError("Please upload a .csv file"); return; }
    const text = await file.text();
    try {
      const parsed = parseCsvText(text);
      setRows(parsed);
      setActiveSample("");
      setUploadedName(file.name);
      setUploadError("");
    } catch {
      setUploadError("Could not parse CSV — check that columns match the expected schema.");
    }
  }

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, []);

  const correctCount = rows.filter((r) => r.correct === "YES").length;
  const activeMeta = SAMPLES.find((s) => s.id === activeSample);
  const labelCounts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.predicted_label] = (acc[r.predicted_label] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(13,13,26,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "#E94560" }}>
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2 10V5l4-3 4 3v5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <rect x="4" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Sequence Detector</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(233,69,96,0.15)", color: "#E94560", border: "1px solid rgba(233,69,96,0.25)" }}>
            Indian Film Engine
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://beam-ai-next-72ov.vercel.app/prototype"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#8888AA] hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
              <path d="M7 1.5A5.5 5.5 0 117 12.5 5.5 5.5 0 017 1.5z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4.5 7h5M7 4.5l2.5 2.5L7 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            TripTribe Prototype
          </a>
          <Link href="/about" className="text-xs text-[#8888AA] hover:text-white transition-colors">
            About
          </Link>
          <a
            href="/data/train_data.csv"
            download
            className="text-xs text-[#8888AA] hover:text-white transition-colors"
          >
            Data ↓
          </a>
        </div>
      </nav>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-8 gap-8 py-8">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">
              AI Sequence<br />Detector
            </h1>
            <p className="text-sm text-[#8888AA] mt-2 leading-relaxed">
              Classifies Indian film windows into song, action, dialogue, or QA edge cases using 150 multimodal features.
            </p>
          </div>

          {/* Stats row */}
          <div
            className="rounded-xl p-4 grid grid-cols-2 gap-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <StatBadge label="F1 — Song" value="96.4%" />
            <StatBadge label="F1 — Action" value="81.5%" />
            <StatBadge label="Test Accuracy" value="85.0%" sub="51/60 correct" />
            <StatBadge label="Features" value="150" sub="multimodal" />
          </div>

          {/* Samples */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#8888AA] font-semibold mb-3">
              Sample Datasets
            </div>
            <SampleSelector selected={activeSample} onChange={loadSample} />
          </div>

          {/* Upload */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#8888AA] font-semibold mb-3">
              Upload Your CSV
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className="rounded-xl cursor-pointer transition-all text-center py-5 px-4"
              style={{
                background: dragOver ? "rgba(233,69,96,0.08)" : "rgba(255,255,255,0.02)",
                border: `1.5px dashed ${dragOver ? "#E94560" : "rgba(255,255,255,0.12)"}`,
              }}
            >
              {uploadedName ? (
                <div>
                  <div className="text-sm font-semibold text-white truncate">{uploadedName}</div>
                  <div className="text-xs text-[#8888AA] mt-1">{rows.length} rows loaded</div>
                </div>
              ) : (
                <div>
                  <svg className="w-6 h-6 mx-auto mb-2 text-[#8888AA]" fill="none" viewBox="0 0 24 24">
                    <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="text-sm text-[#8888AA]">Drop or click to upload</div>
                  <div className="text-[11px] text-[#8888AA]/60 mt-1">.csv with matching columns</div>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-xs text-red-400 mt-2">{uploadError}</p>
            )}
          </div>

          {/* Data downloads */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#8888AA] font-semibold mb-3">
              Download Data
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Training Data", href: "/data/train_data.csv", sub: "140 labelled windows" },
                { label: "Test Data", href: "/data/test_data.csv", sub: "60 windows · real inference" },
                { label: "Pure Songs CSV", href: "/data/sample_1_pure_songs.csv", sub: "15 rows" },
                { label: "Pure Action CSV", href: "/data/sample_2_pure_action.csv", sub: "15 rows" },
                { label: "Dialogue CSV", href: "/data/sample_3_dialogue_neutral.csv", sub: "18 rows" },
                { label: "Ambiguous CSV", href: "/data/sample_4_ambiguous.csv", sub: "12 rows" },
                { label: "Full Test CSV", href: "/data/sample_5_mixed.csv", sub: "60 rows" },
              ].map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  download
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <span className="text-[#C0C0D8] group-hover:text-white transition-colors font-medium">{d.label}</span>
                    <span className="text-[#8888AA] ml-2">{d.sub}</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#8888AA] group-hover:text-white transition-colors shrink-0" fill="none" viewBox="0 0 14 14">
                    <path d="M7 2v7M7 9l-2.5-2.5M7 9l2.5-2.5M2 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-[#8888AA]">
                <div className="w-8 h-8 rounded-full border-2 border-[#E94560]/30 border-t-[#E94560] animate-spin" />
                <span className="text-sm">Running inference…</span>
              </div>
            </div>
          )}

          {!loading && rows.length > 0 && (
            <>
              {/* Results header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {activeMeta ? activeMeta.label : uploadedName}
                  </h2>
                  <p className="text-sm text-[#8888AA] mt-0.5">
                    {rows.length} windows · {correctCount}/{rows.length} correct predictions
                    {rows.length > 0 && (
                      <span className="ml-2 font-semibold" style={{ color: correctCount === rows.length ? "#22C55E" : "#F59E0B" }}>
                        ({Math.round(correctCount / rows.length * 100)}% accuracy)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {Object.entries(labelCounts).map(([label, count]) => {
                    const meta = LABEL_META[label as PredictedLabel];
                    return (
                      <span
                        key={label}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                      >
                        {meta.icon} {count}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Badge grid */}
              <div className={`grid gap-3 ${rows.length <= 5 ? "grid-cols-5" : rows.length <= 8 ? "grid-cols-4" : "grid-cols-5"}`}>
                {rows.slice(0, 20).map((row) => (
                  <PredictionBadge key={row.window_id} row={row} />
                ))}
              </div>

              {rows.length > 20 && (
                <p className="text-xs text-[#8888AA] text-center">
                  Showing badges for first 20 windows — full table below ({rows.length} total)
                </p>
              )}

              {/* Full table */}
              <ResultsTable rows={rows} />
            </>
          )}

          {!loading && rows.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-24">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                🎬
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Select a dataset to begin</h3>
                <p className="text-sm text-[#8888AA] mt-1 max-w-sm">
                  Choose one of the 5 curated sample sets, or upload your own CSV with the same column structure.
                </p>
              </div>
              <button
                onClick={() => loadSample("sample_5")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #E94560, #c13252)" }}
              >
                Load Mixed Realistic Demo
              </button>
            </div>
          )}
        </main>
      </div>

      <footer
        className="px-8 py-5 text-xs text-[#8888AA]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <span>
            Demo mode — inference pre-computed from{" "}
            <code className="text-[#C0C0D8] bg-white/5 px-1 rounded">sequence_detector.joblib</code>.
            Full real-time inference requires a Python / FastAPI backend.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/namangautam22-lab/sequence-detector"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
            <Link href="/about" className="hover:text-white transition-colors">
              About the model
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
