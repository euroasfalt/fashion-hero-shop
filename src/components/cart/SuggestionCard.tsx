"use client";

import Image from "next/image";
import type { Product } from "@/types";

interface SuggestionCardProps {
  product: Product;
  remainingToThreshold: number;
  added: boolean;
  onAdd: (product: Product) => void;
}

function getSuggestionReason(product: Product, remainingToThreshold: number): string {
  if (product.productCategory === "shoes") return "Pasuje do butów";
  if (product.productCategory === "socks") return "Pasuje do butów";
  if (product.productCategory === "accessories") return "Uzupełnienie stylizacji";
  return "Uzupełnienie garderoby";
}

export function SuggestionCard({
  product,
  remainingToThreshold,
  added,
  onAdd,
}: SuggestionCardProps) {
  const firstColor = product.colors[0];
  const imgSrc = firstColor?.image ?? product.images[0] ?? "";
  const reason = getSuggestionReason(product, remainingToThreshold);

  return (
    <div className="flex items-center gap-2.5 py-2.5 border-b border-cream-dark last:border-0">
      {/* Thumbnail */}
      <div
        className="w-11 h-11 rounded flex-shrink-0 overflow-hidden"
        style={{
          background: firstColor
            ? `radial-gradient(ellipse at 50% 60%, ${firstColor.hex}33 0%, ${firstColor.hex}11 40%, #ece9e2 70%)`
            : "#f5f4f1",
        }}
      >
        {imgSrc.startsWith("/images/") && (
          <Image
            src={imgSrc}
            alt={product.name}
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium uppercase tracking-[0.5px] truncate text-charcoal">
          {product.name}
        </p>
        <p className="text-[11px] text-warm-gray mt-0.5">{reason}</p>
      </div>

      {/* Price */}
      <span className="text-[12px] font-medium text-charcoal whitespace-nowrap mr-2">
        {product.price} zł
      </span>

      {/* Add button */}
      <button
        onClick={() => !added && onAdd(product)}
        disabled={added}
        className={
          added
            ? "text-[11px] font-semibold px-2.5 py-1.5 rounded bg-green-600 text-white cursor-default flex-shrink-0"
            : "text-[11px] font-semibold px-2.5 py-1.5 rounded bg-charcoal text-white hover:bg-charcoal-light transition-colors flex-shrink-0"
        }
      >
        {added ? "✓" : "+ Dodaj"}
      </button>
    </div>
  );
}
