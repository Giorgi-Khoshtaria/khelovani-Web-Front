import { notFound } from "next/navigation";
import { getProductById } from "@/apiCalls/productRequests/product.req";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";
import { IProduct, IPopulatedOwner } from "@/lib/types/productTypes";
import { Partner } from "@/lib/types/partnerTypes";
import ProductDetail from "@/components/productsPage/productDetail/ProductDetail";
import type { Metadata } from "next";
import RelatedProducts from "@/components/productsPage/relatedProducts/RelatedProducts";
import { buildPageMetadata, productJsonLd } from "@/lib/utils/seo";

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
    // Brand suffix is added by the root layout's title template.
    return buildPageMetadata({
      path: `/products/${productId}`,
      title,
      description: description?.slice(0, 160) || "",
      ogImage,
    });
  } catch {
    return buildPageMetadata({
      path: `/products/${productId}`,
      title: "Product",
      description: "",
      ogImage: DEFAULT_OG_IMAGE,
    });
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

  const jsonLd = productJsonLd({
    path: `/products/${productId}`,
    titleKa: product.titleGe,
    titleEn: product.titleEn,
    descriptionKa: product.descriptionGe,
    descriptionEn: product.descriptionEn,
    images: product.images,
    price: product.price,
    currency: product.currency,
    inStock: product.stockQuantity > 0,
    partnerName: partner
      ? partner.companyNameEn || partner.companyNameGe
      : undefined,
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} partner={partner} />
      <RelatedProducts
        currentProductId={product._id}
        category={product.category}
      />
    </div>
  );
}
