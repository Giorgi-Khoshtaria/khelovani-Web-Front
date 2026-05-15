import { notFound } from "next/navigation";
import { getProductById } from "@/apiCalls/productRequests/product.req";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";
import { IProduct, IPopulatedOwner } from "@/lib/types/productTypes";
import { Partner } from "@/lib/types/partnerTypes";
import ProductDetail from "@/components/productsPage/productDetail/ProductDetail";
import type { Metadata } from "next";
import RelatedProducts from "@/components/productsPage/relatedProducts/RelatedProducts";

interface Props {
  params: Promise<{ productId: string }>;
}

const DEFAULT_OG_IMAGE = "/assets/og-default.png";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  try {
    const product: IProduct = await getProductById(productId);
    const title = product.titleEn || product.titleGe;
    const description = product.descriptionEn || product.descriptionGe;
    const ogImage = product.images?.[0] || DEFAULT_OG_IMAGE;
    return {
      title: `${title} | Khelovani`,
      description: description?.slice(0, 160),
      openGraph: { images: [ogImage] },
    };
  } catch {
    return {
      title: "Product | Khelovani",
      openGraph: { images: [DEFAULT_OG_IMAGE] },
    };
  }
}

const resolveOwnerId = (owner: IProduct["owner"]): string | null => {
  if (!owner) return null;
  if (typeof owner === "string") return owner;
  return (owner as IPopulatedOwner)._id || null;
};

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;

  let product: IProduct;
  try {
    product = await getProductById(productId);
  } catch {
    return notFound();
  }

  const ownerId = resolveOwnerId(product.owner);
  let partner: Partner | null = null;
  if (ownerId) {
    try {
      partner = await getPartnerById(ownerId);
    } catch {
      partner = null;
    }
  }

  return (
    <main>
      <ProductDetail product={product} partner={partner} />
      <RelatedProducts
        currentProductId={product._id}
        category={product.category}
      />
    </main>
  );
}
