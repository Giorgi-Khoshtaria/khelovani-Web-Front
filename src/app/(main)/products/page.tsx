import ProductsHero from "@/components/productsPage/productsHero/ProductsHero";
import ProductListing from "@/components/productsPage/productListing/ProductListing";
import {
  getProducts,
  type GetProductsResponse,
} from "@/apiCalls/productRequests/product.req";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 300;

export const metadata: Metadata = { title: "პროდუქტები" };

const EMPTY: GetProductsResponse = {
  data: [],
  meta: { totalCount: 0, totalPages: 1, currentPage: 1, limit: 12 },
};

export default async function ProductsPage() {
  const data = await getProducts({ page: 1, limit: 12 }).catch(
    (): GetProductsResponse => EMPTY,
  );

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
