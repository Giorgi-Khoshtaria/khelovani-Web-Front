import ProductsHero from "@/components/productsPage/productsHero/ProductsHero";
import ProductListing from "@/components/productsPage/productListing/ProductListing";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { IProduct } from "@/lib/types/productTypes";
import { Suspense } from "react";

export default async function ProductsPage() {
  let initialProducts: IProduct[] = [];
  let initialTotalPages = 1;

  try {
    const data = await getProducts({ page: 1, limit: 12 });
    initialProducts = data.products || [];
    initialTotalPages = data.totalPages || 1;
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
  }

  return (
    <main>
      <ProductsHero />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListing 
          initialProducts={initialProducts} 
          initialTotalPages={initialTotalPages} 
        />
      </Suspense>
    </main>
  );
}
