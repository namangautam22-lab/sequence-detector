"use client";

import { WindowPrediction, LABEL_META, PredictedLabel } from "@/lib/types";

export default function PredictionBadge({ row }: { row: WindowPrediction }) {
  const meta = LABEL_META[row.predicted_label as PredictedLabel];
  const pct = Math.round(row.confidence * 100);

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2 border"
      style={{ background: meta.bg, borderColor: meta.color + "44" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{meta.icon}</span>
        <span className="font-bold text-base" style={{ color: meta.color }}>
          {meta.text}
        </span>
        <span className="ml-auto text-xs text-gray-400 font-mono">
          {row.window_start} – {row.window_end}
        </span>
      </div>
      <div className="text-sm text-gray-300 font-medium">{row.film}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: meta.color }}
          />
        </div>
        <span className="text-xs font-mono" style={{ color: meta.color }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}
