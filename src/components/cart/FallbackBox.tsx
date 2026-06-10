import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COURIER,
  SHIPPING_PARCEL,
} from "@/lib/cart-suggestions";

interface FallbackBoxProps {
  remaining: number;
}

export function FallbackBox({ remaining }: FallbackBoxProps) {
  return (
    <div className="mx-5 my-3 rounded-xl bg-blue-50 border border-blue-100 p-4">
      <p className="text-[12px] font-bold text-charcoal mb-2.5 flex items-center gap-1.5">
        <span>🚚</span> Koszty dostawy
      </p>
      <div className="space-y-0">
        <div className="flex justify-between text-[12px] text-warm-gray py-1.5 border-b border-blue-100">
          <span>Kurier InPost / DPD</span>
          <span className="font-medium text-charcoal">{SHIPPING_COURIER} zł</span>
        </div>
        <div className="flex justify-between text-[12px] text-warm-gray py-1.5 border-b border-blue-100">
          <span>Paczkomat InPost</span>
          <span className="font-medium text-charcoal">{SHIPPING_PARCEL} zł</span>
        </div>
        <p className="text-[11px] text-warm-gray pt-2">
          Darmowa dostawa od {FREE_SHIPPING_THRESHOLD} zł. Brakuje Ci jeszcze{" "}
          <strong className="text-charcoal">{remaining} zł</strong>.
        </p>
      </div>
    </div>
  );
}
