"use client";

import { useState } from "react";
import type { Transaction } from "@/lib/seller/mock-data";
import type { MarketingEntry } from "./MarketingCostModal";

type FilterChip = "all" | "completed" | "returned" | "marketing";

interface TransactionsTableProps {
  transactions: Transaction[];
  marketingEntries?: MarketingEntry[];
}

const CHANNEL_COLOR: Record<string, string> = {
  FB: "#1877f2",
  Instagram: "#e1306c",
  Google: "#4285f4",
  TikTok: "#000000",
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "short" });
}

function ProductSwatch({ hex, size = 20 }: { hex: string; size?: number }) {
  return (
    <div
      className="rounded-[2px] flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(ellipse at 40% 40%, ${hex}99 0%, ${hex}44 60%, #ece9e2 100%)`,
        border: "1px solid rgba(0,0,0,0.07)",
      }}
    />
  );
}

interface DrillDownProps {
  tx: Transaction;
  onClose: () => void;
}

function DrillDown({ tx, onClose }: DrillDownProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-[8px] sm:rounded-[4px] shadow-xl p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[13px] font-semibold text-[#212121]">Transakcja #{tx.id}</h3>
          <button onClick={onClose} className="text-[#6b6b6b] hover:text-[#212121] text-[18px] leading-none">×</button>
        </div>

        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#e0dad0]">
          <ProductSwatch hex={tx.product.hex} size={40} />
          <div>
            <p className="text-[13px] font-medium text-[#212121]">{tx.product.name}</p>
            <p className="text-[11px] text-[#6b6b6b]">{tx.product.variant} · Rozmiar {tx.size}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <Row label="Klient" value={tx.customerName} />
          <Row label="Miasto" value={tx.city} />
          <Row label="Płatność" value={tx.payment} />
          <Row label="Data" value={formatDate(tx.date)} />
          <Row label="Cena" value={`${tx.price} zł`} />
          <Row
            label="Marża netto"
            value={tx.returned ? `–${Math.abs(tx.netMargin)} zł` : `${tx.netMargin} zł`}
            valueClass={tx.returned ? "text-red-500" : "text-green-600"}
          />
          {tx.marginPct !== null && <Row label="Marża %" value={`${tx.marginPct}%`} />}
          <Row
            label="Status"
            value={tx.returned ? "Zwrot" : "Zrealizowane"}
            valueClass={tx.returned ? "text-red-500" : "text-green-600"}
          />
          {tx.rating !== null && (
            <Row label="Ocena klienta" value={`${"★".repeat(tx.rating)}${"☆".repeat(5 - tx.rating)}`} />
          )}
        </div>
      </div>
    </div>
  );
}

interface MktDrillDownProps {
  entry: MarketingEntry;
  mktIndex: number;
  onClose: () => void;
}

function MktDrillDown({ entry, mktIndex, onClose }: MktDrillDownProps) {
  const mktId = `#M${String(mktIndex + 1).padStart(4, "0")}`;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-[8px] sm:rounded-[4px] shadow-xl p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[13px] font-semibold text-[#212121]">Wydatek marketingowy <span className="text-[#b3471f]">{mktId}</span></h3>
          <button onClick={onClose} className="text-[#6b6b6b] hover:text-[#212121] text-[18px] leading-none">×</button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <Row label="Kanał" value={entry.channel} />
          <Row label="Data" value={formatDate(new Date(entry.date))} />
          <Row label="Kwota" value={`−${entry.amount} zł`} valueClass="text-[#b3471f]" />
          {entry.campaign && <Row label="Kampania" value={entry.campaign} />}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b] mb-0.5">{label}</p>
      <p className={`text-[12px] font-medium text-[#212121] ${valueClass ?? ""}`}>{value}</p>
    </div>
  );
}

export function TransactionsTable({ transactions, marketingEntries = [] }: TransactionsTableProps) {
  const [filter, setFilter] = useState<FilterChip>("all");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [selectedMkt, setSelectedMkt] = useState<{ entry: MarketingEntry; index: number } | null>(null);

  const chips: { id: FilterChip; label: string }[] = [
    { id: "all",       label: "Wszystkie" },
    { id: "completed", label: "Zrealizowane" },
    { id: "returned",  label: "Zwroty" },
    ...(marketingEntries.length > 0 ? [{ id: "marketing" as FilterChip, label: "Marketing" }] : []),
  ];

  const filteredTx = transactions.filter((t) => {
    if (filter === "completed") return !t.returned;
    if (filter === "returned")  return t.returned;
    if (filter === "marketing") return false;
    return true;
  });

  const showMkt = filter === "all" || filter === "marketing";

  return (
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
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0dad0]/60">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#212121]">Transakcje</h3>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {chips.map((c) => {
            const isActive = filter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className="text-[10px] uppercase tracking-[0.07em] px-2.5 py-1 rounded-full transition-all duration-150"
                style={isActive ? {
                  background: "rgba(33,33,33,0.88)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(33,33,33,0.7)",
                  boxShadow: "0 2px 8px rgba(33,33,33,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
                  color: "#fff",
                } : {
                  background: "rgba(255,255,255,0.40)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.55)",
                  boxShadow: "0 1px 6px rgba(180,160,130,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
                  color: "#4a4a4a",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e0dad0]">
              {["#", "Produkt / Kanał", "Kwota", "Wynik", "Klient / Kampania", "Data", "Status"].map((h) => (
                <th key={h} className="text-left text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b] px-4 py-2.5 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Marketing rows */}
            {showMkt && marketingEntries.map((m, mi) => (
              <tr
                key={`mkt-${m.id}`}
                onClick={() => setSelectedMkt({ entry: m, index: mi })}
                className="border-b border-[#e0dad0]/60 hover:bg-white/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-2.5 text-[11px] text-[#b3471f] tabular-nums font-medium">
                  #{`M${String(mi + 1).padStart(4, "0")}`}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-[2px] flex-shrink-0 flex items-center justify-center text-white text-[8px] font-bold"
                      style={{ background: CHANNEL_COLOR[m.channel] ?? "#b3471f" }}
                    >
                      {m.channel[0]}
                    </span>
                    <p className="text-[11px] font-medium text-[#212121]">{m.channel}</p>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[12px] text-[#b3471f] tabular-nums whitespace-nowrap font-medium">
                  −{m.amount} zł
                </td>
                <td className="px-4 py-2.5 text-[12px] text-[#b3471f] tabular-nums whitespace-nowrap font-medium">
                  −{m.amount} zł
                </td>
                <td className="px-4 py-2.5 text-[11px] text-[#6b6b6b] whitespace-nowrap">
                  {m.campaign || "—"}
                </td>
                <td className="px-4 py-2.5 text-[11px] text-[#6b6b6b] whitespace-nowrap">
                  {formatDate(new Date(m.date))}
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-block text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                    Marketing
                  </span>
                </td>
              </tr>
            ))}

            {/* Transaction rows */}
            {filteredTx.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => setSelected(tx)}
                className="border-b border-[#e0dad0]/60 hover:bg-white/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-2.5 text-[11px] text-[#6b6b6b] tabular-nums">#{tx.id}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <ProductSwatch hex={tx.product.hex} />
                    <div>
                      <p className="text-[11px] font-medium text-[#212121]">{tx.product.name}</p>
                      <p className="text-[10px] text-[#6b6b6b]">{tx.product.variant}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[12px] text-[#212121] tabular-nums whitespace-nowrap">
                  {tx.price} zł
                </td>
                <td className={`px-4 py-2.5 text-[12px] font-medium tabular-nums whitespace-nowrap ${tx.returned ? "text-red-500" : "text-green-600"}`}>
                  {tx.returned ? `–${Math.abs(tx.netMargin)}` : `+${tx.netMargin}`} zł
                </td>
                <td className="px-4 py-2.5 text-[11px] text-[#6b6b6b] whitespace-nowrap">{tx.customerName}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#6b6b6b] whitespace-nowrap">{formatDate(tx.date)}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-block text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-full ${
                    tx.returned ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                  }`}>
                    {tx.returned ? "Zwrot" : "OK"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTx.length === 0 && (!showMkt || marketingEntries.length === 0) && (
          <p className="text-center text-[12px] text-[#6b6b6b] py-8">Brak transakcji</p>
        )}
      </div>

      {selected    && <DrillDown    tx={selected}       onClose={() => setSelected(null)}    />}
      {selectedMkt && <MktDrillDown entry={selectedMkt.entry} mktIndex={selectedMkt.index} onClose={() => setSelectedMkt(null)} />}
    </div>
  );
}
