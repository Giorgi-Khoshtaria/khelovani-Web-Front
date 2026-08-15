import ProductsHero from "@/components/productsPage/productsHero/ProductsHero";
import ProductListing from "@/components/productsPage/productListing/ProductListing";
import {
  getProducts,
  type GetProductsParams,
  type GetProductsResponse,
} from "@/apiCalls/productRequests/product.req";
import {
  clampPrice,
  PRICE_CEIL,
  PRICE_FLOOR,
  sanitizeCategory,
} from "@/lib/utils/productFilters";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { getPageByPath } from "@/apiCalls/pageRequests/page.req";
import { Lang } from "@/lib/types/lang.types";
import { buildPageMetadata } from "@/lib/utils/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  try {
    const page = await getPageByPath("/products");
    return buildPageMetadata({
      path: "/products",
      title: lang === "ge" ? page.title.ka : page.title.en,
      description: lang === "ge" ? page.description.ka : page.description.en,
      ogImage: page.ogImage,
      noindex: page.noindex,
    });
  } catch {
    return buildPageMetadata({
      path: "/products",
      title: lang === "ge" ? "პროდუქტები" : "Products",
      description:
        lang === "ge"
          ? "დაათვალიერეთ ხელნაკეთი პროდუქტები ქართველი ხელოსნებისგან — კერამიკა, სამკაული, ტექსტილი და სხვა."
          : "Browse handmade products from Georgian artisans — ceramics, jewelry, textiles, and more.",
    });
  }
}

const EMPTY: GetProductsResponse = {
  data: [],
  meta: { totalCount: 0, totalPages: 1, currentPage: 1, limit: 12 },
};

interface Props {
  // Next 16 App Router: searchParams is a Promise on server components.
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = (v: string | string[] | undefined): string | null =>
  Array.isArray(v) ? (v[0] ?? null) : (v ?? null);

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;

  // Same sanitisation the client filter uses, so what SSR renders for
  // e.g. /products?category=embroidery (as linked from the home page's
  // "Popular categories") matches what the client would otherwise fetch —
  // previously this page ignored the URL entirely and always rendered the
  // unfiltered first page, and the client skipped its own first fetch
  // assuming SSR had already applied the filter.
  const category = sanitizeCategory(first(sp.category));
  const search = first(sp.search) ?? "";
  const partnerId = (first(sp.partnerId) ?? "").split(",")[0] || undefined;
  const minPrice = clampPrice(first(sp.minPrice), PRICE_FLOOR);
  const maxPriceRaw = first(sp.maxPrice);
  const maxPrice =
    maxPriceRaw === null ? PRICE_CEIL : clampPrice(maxPriceRaw, PRICE_CEIL);
  const page = Number(first(sp.page)) || 1;

  const params: GetProductsParams = {
    page,
    limit: 12,
    ...(search && { search }),
    ...(category !== "all" && { category }),
    ...(partnerId && { partnerId }),
    ...(minPrice > PRICE_FLOOR && { minPrice }),
    ...(maxPrice < PRICE_CEIL && { maxPrice }),
  };

  const data = await getProducts(params).catch((): GetProductsResponse => EMPTY);

  const initialProducts = data.data ?? [];
  const initialTotalPages = data.meta?.totalPages ?? 1;
  const initialTotalCount = data.meta?.totalCount ?? 0;

  return (
    <div>
      <ProductsHero />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListing
          initialProducts={initialProducts}
          initialTotalPages={initialTotalPages}
          initialTotalCount={initialTotalCount}
        />
      </Suspense>
    </div>
  );
}
