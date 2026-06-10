import type { CartItem, Product, ProductCategory } from "@/types";

export const FREE_SHIPPING_THRESHOLD = 299;
export const SHIPPING_COURIER = 17;
export const SHIPPING_PARCEL = 9;
const MAX_SUGGESTIONS = 3;

export function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export type ThresholdState = "unreached" | "critical" | "reached";

export function getThresholdState(subtotal: number): ThresholdState {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return "reached";
  if (FREE_SHIPPING_THRESHOLD - subtotal <= 100) return "critical";
  return "unreached";
}

function getDominantCategory(items: CartItem[]): ProductCategory {
  const totals: Partial<Record<ProductCategory, number>> = {};
  for (const item of items) {
    const cat = item.product.productCategory;
    totals[cat] = (totals[cat] ?? 0) + item.product.price * item.quantity;
  }
  const sorted = (Object.entries(totals) as [ProductCategory, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return sorted[0]?.[0] ?? "shoes";
}

export function getSuggestions(
  cartItems: CartItem[],
  catalogue: Product[],
  subtotal: number
): Product[] {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return [];

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const cartProductIds = new Set(cartItems.map((i) => i.product.id));
  const dominantCat = getDominantCategory(cartItems);

  const pool = catalogue.filter(
    (p) => p.productCategory === dominantCat && !cartProductIds.has(p.id)
  );

  if (remaining <= 100) {
    // Rule #1 — price match within ±20% of remaining
    const lo = remaining * 0.8;
    let hi = remaining * 1.2;
    let matched = pool.filter((p) => p.price >= lo && p.price <= hi);

    if (matched.length === 0) {
      // Relax upper bound by 50 zł
      hi = remaining + 50;
      matched = pool.filter((p) => p.price >= lo && p.price <= hi);
    }
    if (matched.length === 0) matched = pool;

    return matched.slice(0, MAX_SUGGESTIONS);
  }

  // Rule #2 — all from dominant category
  return pool.slice(0, MAX_SUGGESTIONS);
}
