"use client";

import { SAMPLES } from "@/lib/types";

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function SampleSelector({ selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
        Load Sample Dataset
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg px-4 py-2.5 text-sm font-medium text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E94560]"
        style={{ background: "#1A1A2E" }}
      >
        <option value="">— Select a sample —</option>
        {SAMPLES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
