"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSellerById } from "@/data/sellers";
import type { Product } from "@/types";

interface SponsoredStripProps {
  products: Product[];
  className?: string;
}

function productGradient(hex: string): string {
  return `radial-gradient(ellipse at 50% 60%, ${hex}33 0%, ${hex}11 40%, #ece9e2 70%)`;
}

function SponsoredBadge() {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="absolute top-2.5 left-2.5 z-10"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Tooltip */}
      <div
        className={cn(
          "absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-charcoal text-white text-[11px] whitespace-nowrap px-2.5 py-1.5 rounded pointer-events-none transition-opacity duration-150 z-20",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        This is a paid placement
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal" />
      </div>

      {/* Badge */}
      <span className="text-[9px] font-medium uppercase tracking-[0.06em] bg-white/92 text-warm-gray px-1.5 py-0.5 rounded border border-black/8 backdrop-blur-sm cursor-default select-none">
        Sponsored
      </span>
    </div>
  );
}

function SponsoredCard({ product }: { product: Product }) {
  const firstColor = product.colors[0];
  const seller = getSellerById(product.sellerId);
  const imageSrc = firstColor?.image ?? "";
  const showImage = imageSrc.startsWith("/images/");

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div
          className="relative aspect-square overflow-hidden mb-3"
          style={{ background: productGradient(firstColor?.hex ?? "#ece9e2") }}
        >
          <SponsoredBadge />

          {showImage ? (
            <Image
              src={imageSrc}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full" />
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 text-[10px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block whitespace-nowrap z-10">
            QUICK VIEW
          </div>
        </div>
      </Link>

      <Link href={`/products/${product.slug}`} className="block">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.5px] mb-0.5">
          {product.name}
        </h3>
        <p className="text-[12px] text-warm-gray mb-0.5">{firstColor?.name}</p>
        {seller && (
          <p className="text-[11px] text-warm-gray/70 mb-1">
            Sold by{" "}
            <span className="text-charcoal/60 hover:text-charcoal transition-colors">
              {seller.name}
            </span>
            {seller.rating >= 4.5 && (
              <span className="inline-block ml-1 text-[9px] bg-charcoal/10 text-charcoal/70 px-1 py-0.5 rounded uppercase tracking-wide">
                Pro
              </span>
            )}
          </p>
        )}
        <span className="text-[14px] font-medium">{product.price} zł</span>
      </Link>
    </div>
  );
}

export function SponsoredStrip({ products, className }: SponsoredStripProps) {
  if (products.length === 0) return null;

  return (
    <section
      className={cn(
        "bg-cream-light border-y border-cream-dark py-7 px-4",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="text-[18px] font-semibold text-charcoal">Featured Sellers</h2>
          <span className="text-[10px] font-medium uppercase tracking-[0.07em] text-warm-gray border border-cream-dark px-1.5 py-0.5 rounded">
            Sponsored
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <SponsoredCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
