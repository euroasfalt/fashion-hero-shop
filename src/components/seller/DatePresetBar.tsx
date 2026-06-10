"use client";

import { useState, useEffect } from "react";
import type { PresetId, CustomRange } from "@/lib/seller/date-presets";

interface DatePresetBarProps {
  active: PresetId;
  onChange: (preset: PresetId) => void;
  customRange: CustomRange;
  onApplyCustom: (range: CustomRange) => void;
}

const PRESETS: { id: PresetId; label: string }[] = [
  { id: "7d",     label: "7 dni" },
  { id: "30d",    label: "30 dni" },
  { id: "90d",    label: "90 dni" },
  { id: "tm",     label: "Ten miesiąc" },
  { id: "pm",     label: "Poprz. miesiąc" },
  { id: "custom", label: "Custom" },
];

const glassBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.40)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow: "0 2px 12px rgba(180,160,130,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
};

const glassActive: React.CSSProperties = {
  background: "rgba(33,33,33,0.88)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(33,33,33,0.7)",
  boxShadow: "0 2px 12px rgba(33,33,33,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
};

function fmtIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatPretty(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
}

export function DatePresetBar({ active, onChange, customRange, onApplyCustom }: DatePresetBarProps) {
  const today = new Date();
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [pendingFrom, setPendingFrom] = useState(customRange.from || fmtIso(monthAgo));
  const [pendingTo, setPendingTo]     = useState(customRange.to   || fmtIso(today));

  useEffect(() => {
    if (customRange.from) setPendingFrom(customRange.from);
    if (customRange.to)   setPendingTo(customRange.to);
  }, [customRange.from, customRange.to]);

  const dirty = pendingFrom !== customRange.from || pendingTo !== customRange.to;
  const valid = !!(pendingFrom && pendingTo && pendingFrom <= pendingTo);
  const days  = valid ? Math.round((new Date(pendingTo).getTime() - new Date(pendingFrom).getTime()) / 86_400_000) + 1 : 0;

  const customPillLabel = customRange.applied
    ? `${formatPretty(customRange.from)} – ${formatPretty(customRange.to)}`
    : "Custom";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PRESETS.map((p) => {
        const isActive = active === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className="text-[11px] uppercase tracking-[0.07em] px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap"
            style={isActive ? glassActive : glassBase}
          >
            <span className={isActive ? "text-white" : "text-[#4a4a4a]"}>
              {p.id === "custom" ? customPillLabel : p.label}
            </span>
          </button>
        );
      })}

      {active === "custom" && (
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b]">Od</span>
            <input
              type="date"
              value={pendingFrom}
              max={pendingTo}
              onChange={(e) => setPendingFrom(e.target.value)}
              className="text-[11px] text-[#212121] rounded-[8px] px-2 py-1 focus:outline-none"
              style={glassBase}
            />
          </div>
          <span className="text-[#6b6b6b]">→</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b]">Do</span>
            <input
              type="date"
              value={pendingTo}
              min={pendingFrom}
              max={fmtIso(today)}
              onChange={(e) => setPendingTo(e.target.value)}
              className="text-[11px] text-[#212121] rounded-[8px] px-2 py-1 focus:outline-none"
              style={glassBase}
            />
          </div>
          {valid && (
            <span className="text-[10px] text-[#6b6b6b] tabular-nums px-2 border-l border-[#e0dad0]">{days} dni</span>
          )}
          <button
            disabled={!valid || !dirty}
            onClick={() => onApplyCustom({ from: pendingFrom, to: pendingTo, applied: true })}
            className="text-[11px] uppercase tracking-[0.07em] px-3 py-1.5 rounded-full transition-all duration-150 disabled:opacity-40"
            style={customRange.applied && !dirty ? {
              ...glassActive,
              background: "rgba(33,33,33,0.60)",
            } : glassActive}
          >
            <span className="text-white">{customRange.applied && !dirty ? "✓ Zastosowano" : "Zastosuj"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
