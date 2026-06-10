"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KPICard } from "@/components/seller/KPICard";
import { SalesChart } from "@/components/seller/SalesChart";
import { TransactionsTable } from "@/components/seller/TransactionsTable";
import { MarketingCostModal, type MarketingEntry } from "@/components/seller/MarketingCostModal";
import { DatePresetBar } from "@/components/seller/DatePresetBar";
import { derivePeriodData, type PresetId, type CustomRange } from "@/lib/seller/date-presets";
import { PERSONAS, generateTransactions, type PersonaId } from "@/lib/seller/mock-data";

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln zł`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)} k zł`;
  return `${n} zł`;
}

function delta(current: number, prev: number): number {
  if (prev === 0) return 0;
  return ((current - prev) / prev) * 100;
}

export default function DashboardPage() {
  const router = useRouter();
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);
  const [preset, setPreset] = useState<PresetId>("30d");
  const [customRange, setCustomRange] = useState<CustomRange>({ from: "", to: "", applied: false });
  const [mktModalOpen, setMktModalOpen] = useState(false);
  const [mktCampaigns, setMktCampaigns] = useState<MarketingEntry[]>([]);
  const [extraMkt, setExtraMkt] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("sellerPersona") as PersonaId | null;
    if (!stored || !(stored in PERSONAS)) {
      router.push("/login");
      return;
    }
    setPersonaId(stored);
    // Load persisted campaigns for this persona
    try {
      const raw = localStorage.getItem(`mktCampaigns_${stored}`);
      if (raw) {
        const parsed: MarketingEntry[] = JSON.parse(raw);
        setMktCampaigns(parsed);
        setExtraMkt(parsed.reduce((s, e) => s + e.amount, 0));
      }
    } catch {
      // ignore parse errors
    }
  }, [router]);

  if (!personaId) return null;

  const persona = PERSONAS[personaId];
  const { topProducts } = persona;
  const transactions = generateTransactions(personaId);

  const derived = derivePeriodData(personaId, preset, customRange);
  const { period, sparklines, gmvByDay, marginByDay, presetLabel } = derived;

  function handlePresetChange(p: PresetId) {
    setPreset(p);
    if (p !== "custom") setCustomRange({ from: "", to: "", applied: false });
  }

  function handleMktSubmit(entry: Omit<MarketingEntry, "id">) {
    const newEntry: MarketingEntry = { ...entry, id: Date.now() };
    setMktCampaigns((prev) => {
      const updated = [...prev, newEntry];
      if (personaId) localStorage.setItem(`mktCampaigns_${personaId}`, JSON.stringify(updated));
      return updated;
    });
    setExtraMkt((prev) => prev + entry.amount);
    setToast(`Dodano koszt: ${entry.amount} zł · ${entry.channel}`);
    setTimeout(() => setToast(null), 2200);
  }

  function handleLogout() {
    sessionStorage.removeItem("sellerPersona");
    router.push("/login");
  }

  const kpis = [
    {
      label: "Marża netto",
      value: fmt(period.netMargin),
      delta: delta(period.netMargin, period.netMarginPrev),
      sparkline: sparklines.margin,
      accent: "#22c55e",
    },
    {
      label: "Przychód (GMV)",
      value: fmt(period.gmv),
      delta: delta(period.gmv, period.gmvPrev),
      sparkline: sparklines.gmv,
      accent: "#212121",
    },
    {
      label: "Liczba zamówień",
      value: String(period.orders),
      delta: delta(period.orders, period.ordersPrev),
      sparkline: sparklines.orders,
      accent: "#6b6b6b",
    },
    {
      label: "Koszty marketingu",
      value: fmt(period.marketingCost + extraMkt),
      delta: delta(period.marketingCost + extraMkt, period.marketingCostPrev),
      sparkline: sparklines.mkt,
      accent: "#f59e0b",
    },
    {
      label: "Śr. wartość zam. (AOV)",
      value: `${period.aov} zł`,
      delta: delta(period.aov, period.aovPrev),
      sparkline: sparklines.aov,
      accent: "#8b5cf6",
    },
  ];

  return (
    <div className="min-h-screen" style={{background: "linear-gradient(135deg, #ece9e2 0%, #e4d9cc 35%, #ecddd0 60%, #e8e2d8 100%)"}}>
      {/* Top bar */}
      <header className="bg-white border-b border-[#e0dad0] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#212121]">
              FashionHero
            </a>
            <span className="text-[#e0dad0]">/</span>
            <span className="text-[11px] text-[#6b6b6b] uppercase tracking-[0.12em]">
              Seller Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Logout icon */}
            <button
              onClick={handleLogout}
              title="Wyloguj"
              className="text-[#6b6b6b] hover:text-[#212121] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>

            <select
              value={personaId}
              onChange={(e) => {
                const p = e.target.value as PersonaId;
                sessionStorage.setItem("sellerPersona", p);
                setPersonaId(p);
                // Load campaigns for the new persona
                try {
                  const raw = localStorage.getItem(`mktCampaigns_${p}`);
                  if (raw) {
                    const parsed: MarketingEntry[] = JSON.parse(raw);
                    setMktCampaigns(parsed);
                    setExtraMkt(parsed.reduce((s, e) => s + e.amount, 0));
                  } else {
                    setMktCampaigns([]);
                    setExtraMkt(0);
                  }
                } catch {
                  setMktCampaigns([]);
                  setExtraMkt(0);
                }
              }}
              className="text-[11px] text-[#6b6b6b] bg-transparent border border-[#e0dad0] rounded px-2 py-1 cursor-pointer"
            >
              {(["urbanedge", "marta", "dropstyle"] as PersonaId[]).map((id) => (
                <option key={id} value={id}>
                  {PERSONAS[id].name}
                </option>
              ))}
            </select>

            {/* Seller meta */}
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[13px] font-semibold text-[#212121] flex items-center gap-1.5">
                {persona.name}
                {persona.pro && (
                  <span className="text-[9px] bg-[#21212118] text-[#212121]/70 px-1.5 py-0.5 rounded-[3px] uppercase tracking-[0.04em] font-semibold">
                    Pro
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#6b6b6b] flex items-center gap-1 mt-0.5">
                {persona.rating >= 4 ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#d4a017" className="flex-shrink-0">
                    <path d="M7 4h10v2h3a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-.35a5 5 0 0 1-3.65 3.87V20h3v2H8v-2h3v-2.13A5 5 0 0 1 7.35 14H7a4 4 0 0 1-4-4V8a2 2 0 0 1 2-2h2V4zm0 4H5v2a2 2 0 0 0 2 2V8zm10 0v4a2 2 0 0 0 2-2V8h-2z"/>
                  </svg>
                ) : "★"}
                {persona.rating.toFixed(1)} · {persona.description}
              </span>
            </div>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0"
              style={{ backgroundColor: persona.avatarBg }}
            >
              {persona.initials}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 flex flex-col gap-6">
        {/* Page title + date preset bar */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-[18px] font-semibold text-[#212121]">Twój Dashboard</h1>
            <p className="text-[12px] text-[#6b6b6b] mt-0.5">
              {persona.description} · {presetLabel}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <DatePresetBar
              active={preset}
              onChange={handlePresetChange}
              customRange={customRange}
              onApplyCustom={(r) => { setCustomRange(r); setPreset("custom"); }}
            />
            <div className="flex items-center gap-3 text-[11px] text-[#6b6b6b]">
              <span>Marża <strong className="text-[#212121]">{period.marginPct}%</strong></span>
              <span className="text-[#e0dad0]">|</span>
              <span>
                Zwroty{" "}
                <strong className={period.returnRate > 20 ? "text-red-500" : "text-[#212121]"}>
                  {period.returnRate}%
                </strong>
              </span>
              {persona.rating >= 4.5 && (
                <>
                  <span className="text-[#e0dad0]">|</span>
                  <span className="text-[9px] bg-[#212121] text-white px-1.5 py-0.5 rounded uppercase tracking-wide">Pro</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map((k) => (
            <KPICard key={k.label} {...k} />
          ))}
        </div>

        {/* Marketing quick row */}
        <div
          className="flex items-center justify-between rounded-[12px] px-5 py-3 -mt-3"
          style={{
            background: "rgba(255,255,255,0.40)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 2px 16px rgba(180,160,130,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6b6b6b]">Koszty marketingu · {presetLabel}</span>
            <span className="text-[12px] font-semibold text-[#212121] tabular-nums">
              {fmt(period.marketingCost + extraMkt)}
            </span>
            {mktCampaigns.length > 0 && (
              <span className="text-[10px] text-[#6b6b6b]">
                ({mktCampaigns.length} kampani{mktCampaigns.length === 1 ? "a" : "e"})
              </span>
            )}
          </div>
          <button
            onClick={() => setMktModalOpen(true)}
            className="text-[11px] uppercase tracking-[0.08em] rounded-full px-4 py-1.5 transition-all duration-150 hover:-translate-y-px"
            style={{
              background: "rgba(33,33,33,0.82)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(33,33,33,0.6)",
              boxShadow: "0 2px 10px rgba(33,33,33,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
              color: "#fff",
            }}
          >
            + Dodaj koszt mkt
          </button>
        </div>

        {/* Sales chart */}
        <SalesChart gmvByDay={gmvByDay} marginByDay={marginByDay} campaigns={mktCampaigns} />

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionsTable transactions={transactions} marketingEntries={mktCampaigns} />
          </div>

          <div
            className="rounded-[14px] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 4px 24px rgba(180,160,130,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <div className="px-5 py-4 border-b border-[#e0dad0]/60">
              <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#212121]">
                Top produkty
              </h3>
            </div>
            <div className="divide-y divide-[#e0dad0]/60">
              {topProducts.slice(0, 8).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-[10px] text-[#6b6b6b]/50 tabular-nums w-4">{i + 1}</span>
                  <div
                    className="w-6 h-6 rounded-[2px] flex-shrink-0"
                    style={{
                      background: `radial-gradient(ellipse at 40% 40%, ${p.hex}99 0%, ${p.hex}44 60%, #ece9e2 100%)`,
                      border: "1px solid rgba(0,0,0,0.07)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#212121] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#6b6b6b]">{p.variant}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-[#212121] tabular-nums">{p.sold} szt.</p>
                    <p className="text-[10px] text-green-600 tabular-nums">
                      {(p.gmv / 1000).toFixed(1)}k zł
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MarketingCostModal
        open={mktModalOpen}
        onClose={() => setMktModalOpen(false)}
        onSubmit={handleMktSubmit}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#212121] text-white text-[12px] px-5 py-3 rounded-full shadow-lg z-50 pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );
}
