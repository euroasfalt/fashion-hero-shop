"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EMAIL_BY_PERSONA, type PersonaId } from "@/lib/seller/mock-data";

const PERSONA_PASSWORDS: Record<PersonaId, string> = {
  urbanedge: "urbanedge123",
  marta: "marta123",
  dropstyle: "dropstyle123",
};

export default function SellerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const persona = (Object.keys(EMAIL_BY_PERSONA) as PersonaId[]).find(
      (k) => EMAIL_BY_PERSONA[k] === email.trim()
    );

    setTimeout(() => {
      if (!persona || PERSONA_PASSWORDS[persona] !== password) {
        setError("Nieprawidłowy e-mail lub hasło.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("sellerPersona", persona);
      router.push("/dashboard");
    }, 700);
  }

  return (
    <div className="min-h-screen bg-[#ece9e2] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b6b6b]">
          FashionHero
        </span>
        <h1 className="text-[22px] font-semibold text-[#212121] mt-1">
          Seller Dashboard
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[4px] shadow-sm px-8 py-9">
        <h2 className="text-[15px] font-medium text-[#212121] mb-6">
          Zaloguj się do konta sprzedawcy
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]">
              Adres e-mail
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.pl"
              required
              className="px-3.5 py-2.5 text-[13px] text-[#212121] placeholder:text-[#6b6b6b]/50 bg-[rgba(225,232,247,0.5)] border border-[#e0dad0] rounded-[2px] outline-none focus:border-[#212121] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.08em] text-[#6b6b6b]">
              Hasło
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="px-3.5 py-2.5 text-[13px] text-[#212121] placeholder:text-[#6b6b6b]/50 bg-[rgba(225,232,247,0.5)] border border-[#e0dad0] rounded-[2px] outline-none focus:border-[#212121] transition-colors"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-[#212121] text-white text-[11px] font-medium uppercase tracking-[0.14em] py-3 rounded-full hover:bg-[#3a3a3a] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logowanie…
              </>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>

        {/* Persona hints */}
        <div className="mt-6 pt-5 border-t border-[#e0dad0]">
          <p className="text-[10px] uppercase tracking-[0.09em] text-[#6b6b6b] mb-2.5">
            Demo — wybierz personę
          </p>
          <div className="flex flex-col gap-1.5">
            {(Object.keys(EMAIL_BY_PERSONA) as PersonaId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setEmail(EMAIL_BY_PERSONA[id]);
                  setPassword(PERSONA_PASSWORDS[id]);
                }}
                className="text-left text-[11px] text-[#6b6b6b] hover:text-[#212121] transition-colors py-0.5"
              >
                <span className="font-medium">{id}</span>
                <span className="text-[#6b6b6b]/60 ml-1.5">
                  — {EMAIL_BY_PERSONA[id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-[#6b6b6b]/70">
        &larr;{" "}
        <a href="/" className="hover:text-[#212121] transition-colors underline underline-offset-2">
          Wróć do sklepu
        </a>
      </p>
    </div>
  );
}
