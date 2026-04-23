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
  description: string;
}

export const SAMPLES: SampleMeta[] = [
  { id: "sample_1", label: "Sample 1: Pure Songs", description: "DDLJ, Dil Bechara, Kabir Singh…" },
  { id: "sample_2", label: "Sample 2: Pure Action", description: "RRR, KGF2, Bahubali 2…" },
  { id: "sample_3", label: "Sample 3: Dialogue / Neutral", description: "3 Idiots, Dangal, DDLJ…" },
  { id: "sample_4", label: "Sample 4: Ambiguous (Song + Action)", description: "RRR, KGF2, Bahubali 2 borderline…" },
  { id: "sample_5", label: "Sample 5: Mixed Realistic", description: "DDLJ, RRR, 3 Idiots, KGF2, Dangal" },
];

export const LABEL_META: Record<PredictedLabel, { color: string; bg: string; icon: string; text: string }> = {
  song: { color: "#27AE60", bg: "rgba(39,174,96,0.12)", icon: "🎵", text: "Song" },
  action: { color: "#E74C3C", bg: "rgba(231,76,60,0.12)", icon: "⚔️", text: "Action" },
  "dialogue/neither": { color: "#2980B9", bg: "rgba(41,128,185,0.12)", icon: "💬", text: "Dialogue" },
  QA_QUEUE: { color: "#F39C12", bg: "rgba(243,156,18,0.12)", icon: "⚠️", text: "QA Queue" },
};
