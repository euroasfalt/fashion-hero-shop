import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types";

/** 0-indexed grid positions where promoted cards are injected. */
const PROMOTED_POSITIONS = new Set([0, 4, 8]);

interface InGridPromotionProps {
  organicProducts: Product[];
  promotedProducts: Product[];
  className?: string;
}

function mergeProducts(
  organic: Product[],
  promoted: Product[]
): Product[] {
  const result: Product[] = [];
  let pi = 0;
  let oi = 0;
  const totalSlots = organic.length + Math.min(promoted.length, PROMOTED_POSITIONS.size);

  for (let i = 0; i < totalSlots; i++) {
    if (PROMOTED_POSITIONS.has(i) && pi < promoted.length) {
      result.push({ ...promoted[pi++], isPromoted: true });
    } else if (oi < organic.length) {
      result.push(organic[oi++]);
    }
  }

  return result;
}

export function InGridPromotion({
  organicProducts,
  promotedProducts,
  className,
}: InGridPromotionProps) {
  const merged = mergeProducts(organicProducts, promotedProducts);

  return (
    <div className={className}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merged.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
