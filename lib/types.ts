export type PredictedLabel = "song" | "action" | "dialogue/neither" | "QA_QUEUE";

export interface WindowPrediction {
  window_id: string;
  film: string;
  window_start: string;
  window_end: string;
  true_is_song: number;
  true_is_action: number;
  song_prob: number;
  action_prob: number;
  predicted_label: PredictedLabel;
  confidence: number;
  correct: "YES" | "NO";
}

export interface SampleMeta {
  id: string;
  label: string;
  tag: string;
  color: string;
}

export const SAMPLES: SampleMeta[] = [
  { id: "sample_1", label: "Pure Songs",          tag: "Bahubali 2, RRR, Jawan",           color: "#22C55E" },
  { id: "sample_2", label: "Pure Action",          tag: "Dil Bechara, KGF2, Dangal",        color: "#EF4444" },
  { id: "sample_3", label: "Dialogue / Neutral",   tag: "Pushpa, KGF2, RRR, 3 Idiots",     color: "#3B82F6" },
  { id: "sample_4", label: "Ambiguous Edge Cases", tag: "RRR, 3 Idiots, Pushpa, Bahubali",  color: "#F59E0B" },
  { id: "sample_5", label: "Mixed Realistic",      tag: "DDLJ · KGF2 · 3 Idiots · RRR · Dangal", color: "#A78BFA" },
];

export const LABEL_META: Record<PredictedLabel, {
  color: string; bg: string; border: string; icon: string; text: string;
}> = {
  song:              { color: "#22C55E", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.2)",   icon: "🎵", text: "Song" },
  action:            { color: "#EF4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",   icon: "⚔️", text: "Action" },
  "dialogue/neither":{ color: "#3B82F6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.2)",  icon: "💬", text: "Dialogue" },
  QA_QUEUE:          { color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  icon: "⚠️", text: "QA Queue" },
};
