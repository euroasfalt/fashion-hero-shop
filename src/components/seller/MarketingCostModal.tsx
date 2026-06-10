"use client";

import { useState } from "react";

export interface MarketingEntry {
  id: number;
  channel: "FB" | "Instagram" | "Google" | "TikTok";
  amount: number;
  date: string;
  campaign: string;
}

interface MarketingCostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<MarketingEntry, "id">) => void;
}

const CHANNELS = ["FB", "Instagram", "Google", "TikTok"] as const;
const CHANNEL_COLOR: Record<string, string> = {
  FB: "#1877f2",
  Instagram: "#e1306c",
  Google: "#4285f4",
  TikTok: "#000000",
};

export function MarketingCostModal({ open, onClose, onSubmit }: MarketingCostModalProps) {
  const [channel, setChannel] = useState<MarketingEntry["channel"]>("FB");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [campaign, setCampaign] = useState("");

  if (!open) return null;

  function submit() {
    if (!amount || Number(amount) <= 0) return;
    onSubmit({ channel, amount: Number(amount), date, campaign });
    setAmount("");
    setCampaign("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative bg-white w-full sm:max-w-md rounded-t-[8px] sm:rounded-[4px] shadow-xl p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-semibold text-[#212121]">+ Dodaj koszt marketingu</h3>
          <button
            onClick={onClose}
            className="text-[#6b6b6b] hover:text-[#212121] text-[18px] leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-[11px] text-[#6b6b6b] mb-5">
          Wprowadź wydatek na kampanię reklamową. Zaktualizuje on Twoją marżę netto.
        </p>

        {/* Kanał */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b] block mb-1.5">
            Kanał
          </label>
          <div className="flex gap-2 flex-wrap">
            {CHANNELS.map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  channel === c
                    ? "border-[#212121] bg-[#212121] text-white"
                    : "border-[#e0dad0] text-[#6b6b6b] hover:border-[#212121]/40"
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ background: CHANNEL_COLOR[c] }}
                />
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Data + Kwota */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b] block mb-1">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-[12px] text-[#212121] border border-[#e0dad0] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#212121]"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b] block mb-1">
              Kwota (zł)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="np. 350"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-[12px] text-[#212121] border border-[#e0dad0] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#212121]"
            />
          </div>
        </div>

        {/* Kampania */}
        <div className="mb-5">
          <label className="text-[10px] uppercase tracking-[0.07em] text-[#6b6b6b] block mb-1">
            Kampania (opcjonalnie)
          </label>
          <input
            type="text"
            placeholder="np. Promocja letnia"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="w-full text-[12px] text-[#212121] border border-[#e0dad0] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#212121]"
          />
        </div>

        <button
          onClick={submit}
          disabled={!amount || Number(amount) <= 0}
          className="w-full rounded-full bg-[#212121] text-white text-[11px] uppercase tracking-[0.1em] py-3 disabled:opacity-40 hover:bg-[#333] transition-colors"
        >
          Zapisz koszt
        </button>
      </div>
    </div>
  );
}
