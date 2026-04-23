"use client";

import { WindowPrediction, LABEL_META, PredictedLabel } from "@/lib/types";

export default function PredictionBadge({ row }: { row: WindowPrediction }) {
  const meta = LABEL_META[row.predicted_label as PredictedLabel];
  const pct = Math.round(row.confidence * 100);

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${meta.bg} 0%, rgba(13,13,26,0.6) 100%)`,
        border: `1px solid ${meta.border}`,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Subtle glow dot top-right */}
      <div
        className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-30 blur-xl"
        style={{ background: meta.color }}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{meta.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
            {meta.text}
          </span>
        </div>
        {row.correct === "YES" ? (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/25 shrink-0">
            ✓
          </span>
        ) : (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/25 shrink-0">
            ✗
          </span>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold text-white leading-snug">{row.film}</div>
        <div className="text-[11px] text-[#8888AA] mt-0.5 font-mono">
          {row.window_start} – {row.window_end}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-wider text-[#8888AA]">Confidence</span>
          <span className="text-xs font-bold font-mono" style={{ color: meta.color }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})` }}
          />
        </div>
      </div>
    </div>
  );
}
