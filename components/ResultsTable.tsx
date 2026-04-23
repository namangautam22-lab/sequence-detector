"use client";

import { WindowPrediction, LABEL_META, PredictedLabel } from "@/lib/types";

function rowBg(label: PredictedLabel) {
  return LABEL_META[label]?.bg ?? "transparent";
}

export default function ResultsTable({ rows }: { rows: WindowPrediction[] }) {
  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-gray-400">
            <th className="px-4 py-3">Window</th>
            <th className="px-4 py-3">Film</th>
            <th className="px-4 py-3">Timestamps</th>
            <th className="px-4 py-3 text-center">Song Prob</th>
            <th className="px-4 py-3 text-center">Action Prob</th>
            <th className="px-4 py-3">Prediction</th>
            <th className="px-4 py-3 text-center">Confidence</th>
            <th className="px-4 py-3 text-center">Correct?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const meta = LABEL_META[row.predicted_label as PredictedLabel];
            const pct = Math.round(row.confidence * 100);
            return (
              <tr
                key={row.window_id}
                style={{ background: rowBg(row.predicted_label as PredictedLabel) }}
                className="border-b border-white/5 transition-colors hover:brightness-125"
              >
                <td className="px-4 py-3 font-mono text-gray-300">{row.window_id}</td>
                <td className="px-4 py-3 font-medium text-white">{row.film}</td>
                <td className="px-4 py-3 font-mono text-gray-400 text-xs whitespace-nowrap">
                  {row.window_start} – {row.window_end}
                </td>
                <td className="px-4 py-3 text-center font-mono" style={{ color: "#27AE60" }}>
                  {(row.song_prob * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-center font-mono" style={{ color: "#E74C3C" }}>
                  {(row.action_prob * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: meta.color + "22", color: meta.color, border: `1px solid ${meta.color}44` }}
                  >
                    <span>{meta.icon}</span>
                    {meta.text}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: meta.color }}
                      />
                    </div>
                    <span className="font-mono text-xs text-gray-300">{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {row.correct === "YES" ? (
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                      YES
                    </span>
                  ) : (
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
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
