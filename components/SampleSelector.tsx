"use client";

import { SAMPLES } from "@/lib/types";

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function SampleSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {SAMPLES.map((s) => {
        const active = selected === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(active ? "" : s.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
            style={{
              background: active ? `${s.color}15` : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? s.color + "40" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: active ? s.color : "rgba(255,255,255,0.2)" }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">{s.label}</div>
              <div className="text-xs text-[#8888AA] truncate mt-0.5">{s.tag}</div>
            </div>
            {active && (
              <svg className="w-4 h-4 shrink-0" style={{ color: s.color }} fill="none" viewBox="0 0 16 16">
                <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
