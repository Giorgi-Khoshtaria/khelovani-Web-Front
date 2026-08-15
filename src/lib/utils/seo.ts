import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://khelovani.ge";

export const SITE_NAME = "Khelovani";

interface BuildPageMetadataOptions {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Shared shape for every route's metadata — canonical URL, OpenGraph, and
 * Twitter card, all derived from the same title/description/image so pages
 * don't hand-roll three near-identical blocks each.
 */
export const buildPageMetadata = ({
  path,
  title,
  description,
  ogImage,
  noindex,
}: BuildPageMetadataOptions): Metadata => {
  const url = `${SITE_URL}${path}`;
  const images = ogImage ? [{ url: ogImage }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
};

/** Sitewide Organization schema — rendered once in the root layout. */
export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/og-default.png`,
});

interface ProductJsonLdInput {
  path: string;
  titleKa: string;
  titleEn?: string;
  descriptionKa?: string;
  descriptionEn?: string;
  images?: string[];
  price: number;
  currency: string;
  inStock: boolean;
  partnerName?: string;
}

export const productJsonLd = (input: ProductJsonLdInput) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: input.titleEn || input.titleKa,
  description: input.descriptionEn || input.descriptionKa,
  image: input.images,
  brand: input.partnerName
    ? { "@type": "Brand", name: input.partnerName }
    : undefined,
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}${input.path}`,
    priceCurrency: input.currency,
    price: input.price,
    availability: input.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
  },
});

interface OrganizationDetailJsonLdInput {
  path: string;
  name: string;
  description?: string;
  image?: string;
  city?: string;
}

export const partnerJsonLd = (input: OrganizationDetailJsonLdInput) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: input.name,
  description: input.description,
  image: input.image,
  url: `${SITE_URL}${input.path}`,
  address: input.city
    ? { "@type": "PostalAddress", addressLocality: input.city, addressCountry: "GE" }
    : undefined,
});
