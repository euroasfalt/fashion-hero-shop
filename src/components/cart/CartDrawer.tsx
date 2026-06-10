"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { ShippingBar } from "./ShippingBar";
import { SuggestionCard } from "./SuggestionCard";
import { FallbackBox } from "./FallbackBox";
import {
  computeSubtotal,
  getThresholdState,
  getSuggestions,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_PARCEL,
} from "@/lib/cart-suggestions";
import { products as allProducts } from "@/data/products";
import type { CartItem, Product, ProductColor } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onAddProduct: (product: Product, color: ProductColor, size: number) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onAddProduct,
}: CartDrawerProps) {
  const subtotal = useMemo(() => computeSubtotal(items), [items]);
  const thresholdState = useMemo(() => getThresholdState(subtotal), [subtotal]);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const suggestions = useMemo(
    () => getSuggestions(items, allProducts, subtotal),
    [items, subtotal]
  );

  const showFallback = thresholdState !== "reached" && suggestions.length === 0;

  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Reset "added" badges when cart items change significantly
  useEffect(() => {
    setAddedIds(new Set());
  }, [items.length]);

  const handleAddSuggestion = useCallback(
    (product: Product) => {
      const firstColor = product.colors[0];
      const firstSize = product.sizes[0];
      if (!firstColor || firstSize === undefined) return;
      setAddedIds((prev) => new Set([...prev, product.id]));
      onAddProduct(product, firstColor, firstSize);
    },
    [onAddProduct]
  );

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3.5 border-b border-cream-dark">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-base font-semibold italic tracking-tight">FashionHero</span>
            <button
              onClick={onClose}
              aria-label="Zamknij koszyk"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-light transition-colors text-warm-gray"
            >
              <CloseIcon />
            </button>
          </div>
          <h2 className="text-nav">
            KOSZYK ({itemCount} {itemCount === 1 ? "produkt" : itemCount < 5 ? "produkty" : "produktów"})
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Shipping threshold bar */}
          <ShippingBar subtotal={subtotal} state={thresholdState} />

          {/* Empty state */}
          {items.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-warm-gray mb-6">
                Twój koszyk jest pusty. Zacznij zakupy!
              </p>
              <div className="space-y-2">
                <Link href="/collections/womens" className="btn-cta block" onClick={onClose}>
                  SHOP WOMEN
                </Link>
                <Link href="/collections/mens" className="btn-cta-outline block" onClick={onClose}>
                  SHOP MEN
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="px-5 py-2">
                {items.map((item, index) => {
                  const thumbSrc = item.color.image;
                  const showThumb = thumbSrc.startsWith("/images/");
                  return (
                    <div
                      key={`${item.product.id}-${item.color.hex}-${item.size}`}
                      className="flex gap-3 py-3.5 border-b border-cream-dark relative"
                    >
                      {/* Thumbnail */}
                      <div
                        className="w-16 h-16 rounded flex-shrink-0 overflow-hidden"
                        style={{
                          background: `radial-gradient(ellipse at 50% 55%, ${item.color.hex}44 0%, ${item.color.hex}22 35%, #ece9e2 65%)`,
                        }}
                      >
                        {showThumb && (
                          <Image
                            src={thumbSrc}
                            alt={`${item.product.name} — ${item.color.name}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="text-[12px] font-medium uppercase tracking-[0.5px] truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-[12px] text-warm-gray mt-0.5">
                          {item.color.name} · Rozmiar {item.size}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-cream-dark">
                            <button
                              className="p-1 hover:bg-cream-light transition-colors"
                              onClick={() =>
                                item.quantity <= 1
                                  ? onRemove(index)
                                  : onUpdateQuantity(index, item.quantity - 1)
                              }
                              aria-label="Zmniejsz ilość"
                            >
                              <MinusIcon />
                            </button>
                            <span className="px-3 text-[12px]">{item.quantity}</span>
                            <button
                              className="p-1 hover:bg-cream-light transition-colors"
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              aria-label="Zwiększ ilość"
                            >
                              <PlusIcon />
                            </button>
                          </div>
                          <span className="text-price font-semibold">
                            {(item.product.price * item.quantity)} zł
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        className="absolute top-3.5 right-0 text-warm-gray/60 hover:text-warm-gray transition-colors text-sm"
                        onClick={() => onRemove(index)}
                        aria-label="Usuń z koszyka"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions */}
              {thresholdState !== "reached" && !showFallback && suggestions.length > 0 && (
                <div className="px-5 pt-3 pb-2">
                  <p className="text-[10px] font-semibold tracking-[0.08em] text-warm-gray uppercase mb-2.5">
                    Dorzuć i odblokuj darmową dostawę
                  </p>
                  {suggestions.map((product) => (
                    <SuggestionCard
                      key={product.id}
                      product={product}
                      remainingToThreshold={remaining}
                      added={addedIds.has(product.id)}
                      onAdd={handleAddSuggestion}
                    />
                  ))}
                </div>
              )}

              {/* Fallback shipping costs */}
              {showFallback && <FallbackBox remaining={remaining} />}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-5 py-4 border-t border-cream-dark bg-white">
            <div className="space-y-1.5 mb-3.5">
              <div className="flex justify-between text-sm">
                <span>Suma produktów</span>
                <span className="font-semibold">{subtotal} zł</span>
              </div>
              <div className="flex justify-between text-sm text-warm-gray">
                <span>Dostawa</span>
                {thresholdState === "reached" ? (
                  <span className="text-green-700 font-semibold">Darmowa</span>
                ) : showFallback ? (
                  <span>od {SHIPPING_PARCEL} zł</span>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

            <Link href="/checkout" className="btn-cta w-full block text-center" onClick={onClose}>
              PRZEJDŹ DO KASY →
            </Link>

            {thresholdState !== "reached" && (
              <button
                onClick={onClose}
                className="block w-full text-center mt-3 text-[12px] text-warm-gray underline hover:text-charcoal transition-colors"
              >
                Kontynuuj zakupy
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
