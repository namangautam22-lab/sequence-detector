"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import SampleSelector from "@/components/SampleSelector";
import ResultsTable from "@/components/ResultsTable";
import PredictionBadge from "@/components/PredictionBadge";
import { WindowPrediction, SAMPLES } from "@/lib/types";

function parseCsvText(text: string): WindowPrediction[] {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h.trim()] = vals[i]?.trim() ?? ""));
    return {
      window_id: row.window_id,
      film: row.film,
      window_start: row.window_start,
      window_end: row.window_end,
      true_is_song: parseInt(row.true_is_song),
      true_is_action: parseInt(row.true_is_action),
      song_prob: parseFloat(row.song_prob),
      action_prob: parseFloat(row.action_prob),
      predicted_label: row.predicted_label as WindowPrediction["predicted_label"],
      confidence: parseFloat(row.confidence),
      correct: row.correct as "YES" | "NO",
    };
  });
}

export default function HomePage() {
  const [rows, setRows] = useState<WindowPrediction[]>([]);
  const [activeSample, setActiveSample] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedName, setUploadedName] = useState("");

  async function loadSample(id: string) {
    if (!id) { setRows([]); setActiveSample(""); return; }
    setLoading(true);
    setUploadedName("");
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

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = parseCsvText(text);
      setRows(parsed);
      setActiveSample("");
      setUploadedName(file.name);
    } catch {
      alert("Could not parse CSV. Make sure columns match the expected schema.");
    }
  }, []);

  const correctCount = rows.filter((r) => r.correct === "YES").length;
  const activeMeta = SAMPLES.find((s) => s.id === activeSample);

  return (
    <main
      className="min-h-screen text-white"
      style={{ background: "#0F0F1A", fontFamily: "Inter, sans-serif" }}
    >
      {/* Nav */}
      <nav className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: "#E94560" }} />
          <span className="text-sm font-semibold tracking-wide text-gray-200">
            AI Sequence Detector
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/10" style={{ background: "#1A1A2E" }}>
            Demo Mode · Pre-computed
          </span>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 pt-14 pb-8">
        <h1 className="text-4xl font-bold leading-tight mb-3">
          AI Sequence Detector{" "}
          <span style={{ color: "#E94560" }}>—</span>{" "}
          <span className="text-gray-300">Indian Film Engine</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Detects song blocks and action sequences from multimodal film features.
          150-feature Decision Tree · F1 Song 96.4% · F1 Action 81.5%
        </p>

        {/* Controls */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 max-w-xs">
            <SampleSelector selected={activeSample} onChange={loadSample} />
          </div>
          <div className="text-xs text-gray-500 pb-2">or</div>
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className="flex-1 max-w-xs rounded-lg border-2 border-dashed text-center py-2.5 px-4 text-sm text-gray-500 cursor-pointer transition-all"
            style={{
              borderColor: dragOver ? "#E94560" : "rgba(255,255,255,0.12)",
              background: dragOver ? "rgba(233,69,96,0.06)" : "#1A1A2E",
            }}
          >
            {uploadedName ? (
              <span className="text-white font-medium">{uploadedName}</span>
            ) : (
              "Drop a CSV here"
            )}
          </div>
        </div>

        {/* Score bar */}
        {rows.length > 0 && (
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="text-gray-400">
              {activeMeta ? activeMeta.label : uploadedName}
            </span>
            <span className="text-gray-600">·</span>
            <span className="font-semibold" style={{ color: correctCount === rows.length ? "#27AE60" : "#F39C12" }}>
              {correctCount}/{rows.length} correct
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-5xl mx-auto px-8 py-8 text-gray-400 text-sm animate-pulse">
          Loading predictions…
        </div>
      )}

      {/* Badge grid + table */}
      {!loading && rows.length > 0 && (
        <div className="max-w-5xl mx-auto px-8 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {rows.map((row) => (
              <PredictionBadge key={row.window_id} row={row} />
            ))}
          </div>
          <ResultsTable rows={rows} />
        </div>
      )}

      {/* Empty state */}
      {!loading && rows.length === 0 && (
        <div className="max-w-5xl mx-auto px-8 py-20 text-center text-gray-600">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-lg">Select a sample dataset to see predictions</p>
          <p className="text-sm mt-1">
            Try <strong className="text-gray-400">Sample 5: Mixed Realistic</strong> for the full demo
          </p>
        </div>
      )}

      <footer className="border-t border-white/5 mt-12 px-8 py-6 text-xs text-gray-600 max-w-5xl mx-auto">
        Full inference requires Python backend (FastAPI) — this demo uses pre-computed predictions from{" "}
        <code>sequence_detector.joblib</code>
      </footer>
    </main>
  );
}
