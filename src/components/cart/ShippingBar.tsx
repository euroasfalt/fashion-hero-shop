"use client";

import { FREE_SHIPPING_THRESHOLD, type ThresholdState } from "@/lib/cart-suggestions";

interface ShippingBarProps {
  subtotal: number;
  state: ThresholdState;
}

export function ShippingBar({ subtotal, state }: ShippingBarProps) {
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  const fillColor =
    state === "reached"
      ? "bg-green-600"
      : state === "critical"
        ? "bg-orange-400"
        : "bg-blue-500";

  return (
    <div className="px-5 py-4 border-b border-cream-dark">
      {state === "reached" ? (
        <p className="text-[13px] font-semibold text-green-700 mb-2 flex items-center gap-1.5">
          <span className="text-green-600">✓</span>
          Darmowa dostawa odblokowana!
        </p>
      ) : (
        <p className="text-[13px] font-medium text-charcoal mb-2 leading-snug">
          {state === "critical"
            ? `Tylko ${remaining} zł do darmowej dostawy!`
            : `Dodaj jeszcze ${remaining} zł i zyskaj darmową dostawę`}
        </p>
      )}
      <div className="h-[5px] bg-cream-dark rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
