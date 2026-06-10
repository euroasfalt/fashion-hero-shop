"use client";

import { Sparkline } from "./Sparkline";

interface KPICardProps {
  label: string;
  value: string;
  delta: number;
  deltaLabel?: string;
  sparkline?: number[];
  accent?: string;
  primary?: boolean;
}

export function KPICard({ label, value, delta, deltaLabel, sparkline, accent = "#212121" }: KPICardProps) {
  const isPositive = delta >= 0;
  const sign = isPositive ? "+" : "";

  return (
    <div className="group relative rounded-[12px] px-4 py-3.5 flex flex-col gap-2 min-w-0 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 4px 24px rgba(180,160,130,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {/* hover overlay */}
      <div className="absolute inset-0 rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          background: "rgba(255,255,255,0.25)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[10px] uppercase tracking-[0.09em] text-[#6b6b6b] truncate">
            {label}
          </span>
          <span className="text-[22px] font-semibold text-[#212121] leading-none tabular-nums">
            {value}
          </span>
        </div>
        {sparkline && (
          <div className="flex-shrink-0 mt-1">
            <Sparkline data={sparkline} color={accent} height={32} width={72} />
          </div>
        )}
      </div>

      <div className="relative flex items-center gap-1.5">
        <span className={`text-[11px] font-medium tabular-nums ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {sign}{delta.toFixed(1)}%
        </span>
        <span className="text-[10px] text-[#6b6b6b]/70">
          {deltaLabel ?? "vs poprzedni okres"}
        </span>
      </div>
    </div>
  );
}
