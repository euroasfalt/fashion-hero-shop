import { PERSONAS, type PersonaId } from "./mock-data";

export type PresetId = "7d" | "30d" | "90d" | "tm" | "pm" | "custom";

export interface CustomRange {
  from: string;
  to: string;
  applied: boolean;
}

interface PresetMeta {
  mult: number;
  days: number;
  prevMult: number;
  label: string;
}

const PRESET_META: Record<Exclude<PresetId, "custom">, PresetMeta> = {
  "7d":  { mult: 0.24, days: 7,  prevMult: 0.95, label: "ostatnie 7 dni" },
  "30d": { mult: 1.0,  days: 30, prevMult: 1.0,  label: "ostatnie 30 dni" },
  "90d": { mult: 2.85, days: 90, prevMult: 1.05, label: "ostatnie 90 dni" },
  "tm":  { mult: 0.62, days: 21, prevMult: 0.85, label: "ten miesiąc do dziś" },
  "pm":  { mult: 1.04, days: 30, prevMult: 0.97, label: "poprzedni miesiąc" },
};

function fmtPlDate(d: Date): string {
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
}

function resizeSeries(arr: number[], n: number): number[] {
  if (arr.length === n) return arr.slice();
  if (n < arr.length) return arr.slice(arr.length - n);
  const out = arr.slice();
  let i = 0;
  while (out.length < n) {
    const v = arr[i % arr.length];
    const drift = 1 + Math.sin(out.length / 5) * 0.08;
    out.unshift(Math.round(v * drift));
    i++;
  }
  return out;
}

export interface DerivedData {
  period: {
    gmv: number; gmvPrev: number;
    orders: number; ordersPrev: number;
    netMargin: number; netMarginPrev: number;
    marginPct: number;
    returnRate: number;
    returns: number; returnsPrev: number;
    returnCost: number;
    marketingCost: number; marketingCostPrev: number;
    aov: number; aovPrev: number;
  };
  gmvByDay: number[];
  marginByDay: number[];
  sparklines: {
    gmv: number[]; margin: number[];
    orders: number[]; mkt: number[]; aov: number[];
  };
  presetLabel: string;
  presetDays: number;
}

export function derivePeriodData(
  personaId: PersonaId,
  preset: PresetId,
  customRange?: CustomRange
): DerivedData {
  const p = PERSONAS[personaId];
  let meta: PresetMeta = PRESET_META[preset as Exclude<PresetId, "custom">] ?? PRESET_META["30d"];

  if (preset === "custom" && customRange?.from && customRange?.to && customRange.applied) {
    const from = new Date(customRange.from);
    const to = new Date(customRange.to);
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1);
    meta = {
      mult: days / 30,
      days: Math.min(120, Math.max(2, days)),
      prevMult: 1.0,
      label: `${fmtPlDate(from)} → ${fmtPlDate(to)}`,
    };
  }

  const m = meta.mult;
  const pm = meta.prevMult;
  const base = p.period;

  const period = {
    gmv:               Math.round(base.gmv * m),
    gmvPrev:           Math.round(base.gmvPrev * m * pm),
    orders:            Math.round(base.orders * m),
    ordersPrev:        Math.round(base.ordersPrev * m * pm),
    netMargin:         Math.round(base.netMargin * m),
    netMarginPrev:     Math.round(base.netMarginPrev * m * pm),
    marginPct:         base.marginPct,
    returnRate:        base.returnRate,
    returns:           Math.round(base.returns * m),
    returnsPrev:       Math.round(base.returnsPrev * m * pm),
    returnCost:        Math.round(base.returnCost * m),
    marketingCost:     Math.round(base.marketingCost * m),
    marketingCostPrev: Math.round(base.marketingCostPrev * m * pm),
    aov:               base.aov,
    aovPrev:           base.aovPrev,
  };

  const gmvByDay    = resizeSeries(p.gmvByDay,    meta.days);
  const marginByDay = resizeSeries(p.marginByDay, meta.days);

  const rescaleSpark = (arr: number[]) =>
    arr.map((v) => v * (m === 1 ? 1 : 0.9 + m * 0.1));

  const sparklines = {
    gmv:    rescaleSpark(p.sparklines.gmv),
    margin: rescaleSpark(p.sparklines.margin),
    orders: p.sparklines.orders.map((v) => v * (m === 1 ? 1 : 0.85 + m * 0.15)),
    mkt:    rescaleSpark(p.sparklines.mkt),
    aov:    p.sparklines.aov.slice(),
  };

  return { period, gmvByDay, marginByDay, sparklines, presetLabel: meta.label, presetDays: meta.days };
}
