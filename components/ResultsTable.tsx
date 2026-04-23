"use client";

import { WindowPrediction, LABEL_META, PredictedLabel } from "@/lib/types";

function ProbBar({ value, color }: { value: number; color: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-xs w-8 text-right" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

export default function ResultsTable({ rows }: { rows: WindowPrediction[] }) {
  if (!rows.length) return null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["Win", "Film", "Timestamps", "Song", "Action", "Prediction", "Confidence", "Result"].map((h) => (
              <th key={h} className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-[#8888AA]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const meta = LABEL_META[row.predicted_label as PredictedLabel];
            const pct = Math.round(row.confidence * 100);
            const isLast = idx === rows.length - 1;
            return (
              <tr
                key={row.window_id}
                className="group transition-colors"
                style={{
                  borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-[#8888AA]">{row.window_id}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-medium text-white text-sm">{row.film}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-[#8888AA] whitespace-nowrap">
                    {row.window_start} – {row.window_end}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <ProbBar value={row.song_prob} color="#22C55E" />
                </td>
                <td className="px-5 py-4">
                  <ProbBar value={row.action_prob} color="#EF4444" />
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{
                      background: meta.bg,
                      color: meta.color,
                      border: `1px solid ${meta.border}`,
                    }}
                  >
                    <span className="text-base leading-none">{meta.icon}</span>
                    {meta.text}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-[#8888AA] w-8">{pct}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {row.correct === "YES" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      YES
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      NO
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
