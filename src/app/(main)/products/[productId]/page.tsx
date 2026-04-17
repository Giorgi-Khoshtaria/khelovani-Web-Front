import { notFound } from "next/navigation";
import { getProductById } from "@/apiCalls/productRequests/product.req";
import { IProduct } from "@/lib/types/productTypes";
import ProductDetail from "@/components/productsPage/productDetail/ProductDetail";
import type { Metadata } from "next";
import RelatedProducts from "@/components/productsPage/relatedProducts/RelatedProducts";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  try {
    const product: IProduct = await getProductById(productId);
    const title = product.titleEn || product.titleGe;
    const description = product.descriptionEn || product.descriptionGe;
    return {
      title: `${title} | Khelovani`,
      description: description?.slice(0, 160),
    };
  } catch {
    return { title: "Product | Khelovani" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;

  let product: IProduct;

  try {
    product = await getProductById(productId);
  } catch {
    notFound();
  }

  return (
    <main>
      <ProductDetail product={product!} />
      <RelatedProducts
        currentProductId={product._id}
        category={product.category}
      />
    </main>
  );
}
