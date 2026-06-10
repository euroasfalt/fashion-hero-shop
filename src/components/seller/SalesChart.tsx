"use client";

import { useState } from "react";
import type { MarketingEntry } from "./MarketingCostModal";

interface SalesChartProps {
  gmvByDay: number[];
  marginByDay: number[];
  campaigns?: MarketingEntry[];
  className?: string;
}

function formatZl(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
  return String(v);
}

function fmt(v: number): string {
  return `${v.toLocaleString("pl-PL")} zł`;
}

const CHANNEL_COLOR: Record<string, string> = {
  FB: "#1877f2",
  Instagram: "#e1306c",
  Google: "#4285f4",
  TikTok: "#000000",
};

export function SalesChart({ gmvByDay, marginByDay, campaigns = [], className }: SalesChartProps) {
  const [hoverId, setHoverId] = useState<number | null>(null);

  const W = 760;
  const H = 180;
  const PADL = 40;
  const PADR = 12;
  const PADT = 16;
  const PADB = 28;
  const chartW = W - PADL - PADR;
  const chartH = H - PADT - PADB;

  const allVals = [...gmvByDay, ...marginByDay];
  const maxV = Math.max(...allVals);
  const minV = Math.min(0, Math.min(...allVals));
  const range = maxV - minV || 1;

  function toX(i: number) {
    return PADL + (i / (gmvByDay.length - 1)) * chartW;
  }
  function toY(v: number) {
    return PADT + (1 - (v - minV) / range) * chartH;
  }

  function makePath(data: number[]) {
    return data
      .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
      .join(" ");
  }

  function makeArea(data: number[]) {
    const line = makePath(data);
    const baseline = toY(0).toFixed(1);
    return `${line} L${toX(data.length - 1).toFixed(1)},${baseline} L${toX(0).toFixed(1)},${baseline} Z`;
  }

  const days = gmvByDay.length;
  const tickEvery = Math.ceil(days / 7);
  const ticks = Array.from({ length: days }, (_, i) => i).filter(
    (i) => i % tickEvery === 0 || i === days - 1
  );

  // Real dates: index 0 = (days-1) days ago, index days-1 = today
  function tickLabel(i: number): string {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "short" }).replace(".", "");
  }

  const gridLines = 4;
  const yTicks = Array.from({ length: gridLines + 1 }, (_, i) =>
    minV + (i / gridLines) * range
  );

  // Map campaigns to chart x positions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const markers = campaigns
    .map((c) => {
      const cDate = new Date(c.date);
      cDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.round((today.getTime() - cDate.getTime()) / 86_400_000);
      if (daysAgo < 0 || daysAgo > days - 1) return null;
      const idx = Math.max(0, Math.min(days - 1, days - 1 - daysAgo));
      const x = toX(idx);
      const y = toY(gmvByDay[idx]);
      return { ...c, x, y, daysAgo, idx, dateObj: cDate };
    })
    .filter(Boolean) as (MarketingEntry & { x: number; y: number; daysAgo: number; idx: number; dateObj: Date })[];

  const hoverMarker = markers.find((m) => m.id === hoverId) ?? null;
  const tooltipW = 200;
  const tipX = hoverMarker
    ? Math.max(8, Math.min(W - tooltipW - 8, hoverMarker.x - tooltipW / 2))
    : 0;
  const tipBelow = hoverMarker ? hoverMarker.y < 80 : false;

  return (
    <div
      className={`rounded-[14px] px-5 py-4 ${className ?? ""}`}
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 4px 24px rgba(180,160,130,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#212121]">
          Sprzedaż – 30 dni
        </h3>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[10px] text-[#6b6b6b]">
            <span className="inline-block w-3 h-0.5 bg-[#212121] rounded" />
            GMV
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-[#6b6b6b]">
            <span className="inline-block w-3 h-0.5 bg-[#22c55e] rounded" />
            Marża netto
          </span>
          {campaigns.length > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] text-[#6b6b6b]">
              <span className="inline-block w-3 h-0.5 border-t border-dashed border-[#b3471f]" />
              Kampanie
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
          <defs>
            <linearGradient id="gmv-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#212121" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#212121" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="margin-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={PADL} y1={toY(v)} x2={W - PADR} y2={toY(v)}
                stroke="#e0dad0" strokeWidth="0.5"
              />
              <text x={PADL - 4} y={toY(v) + 4} textAnchor="end" fontSize="9" fill="#6b6b6b">
                {formatZl(v)}
              </text>
            </g>
          ))}

          {/* Areas */}
          <path d={makeArea(gmvByDay)} fill="url(#gmv-fill)" />
          <path d={makeArea(marginByDay)} fill="url(#margin-fill)" />

          {/* Lines */}
          <path d={makePath(gmvByDay)} fill="none" stroke="#212121" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={makePath(marginByDay)} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round" />

          {/* X ticks */}
          {ticks.map((i) => (
            <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#6b6b6b">
              {tickLabel(i)}
            </text>
          ))}

          {/* Campaign markers */}
          {markers.map((m) => {
            const isActive = m.id === hoverId;
            return (
              <g
                key={m.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverId(m.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <line
                  x1={m.x} y1={PADT} x2={m.x} y2={PADT + chartH}
                  stroke="#b3471f" strokeWidth="1" strokeDasharray="3,3"
                  opacity={isActive ? 1 : 0.5}
                />
                <circle cx={m.x} cy={m.y} r={isActive ? 7 : 5}
                  fill="#fff" stroke="#b3471f" strokeWidth="2" />
                <circle cx={m.x} cy={m.y} r="2.5" fill="#b3471f" />
                {/* invisible hit target */}
                <circle cx={m.x} cy={m.y} r="14" fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoverMarker && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: tipX,
              top: tipBelow ? hoverMarker.y + 18 : hoverMarker.y - 12,
              transform: tipBelow ? "translateY(0)" : "translateY(-100%)",
              width: tooltipW,
            }}
          >
            <div className="bg-white border border-[#e0dad0] rounded-[4px] shadow-md p-3 text-left">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: CHANNEL_COLOR[hoverMarker.channel] ?? "#b3471f" }}
                />
                <span className="text-[11px] font-semibold text-[#212121]">{hoverMarker.channel}</span>
                <span className="text-[10px] text-[#6b6b6b] ml-auto tabular-nums">
                  {hoverMarker.dateObj.toLocaleDateString("pl-PL", { day: "2-digit", month: "short" })}
                  {hoverMarker.daysAgo === 0 ? " · dziś" : ` · ${hoverMarker.daysAgo}d temu`}
                </span>
              </div>
              {hoverMarker.campaign && (
                <p className="text-[12px] font-medium text-[#212121] mb-0.5">{hoverMarker.campaign}</p>
              )}
              <p className="text-[14px] font-semibold text-[#b3471f] tabular-nums">−{fmt(hoverMarker.amount)}</p>
              <p className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b] border-t border-[#e0dad0] pt-1.5 mt-1.5">
                Koszt marketingu zaksięgowany
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
