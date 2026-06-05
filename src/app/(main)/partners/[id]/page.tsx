import { cache } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import PartnerDetail from "@/components/partnersPage/partnerDetail/PartnerDetail";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { IProduct } from "@/lib/types/productTypes";
import { Lang } from "@/lib/types/lang.types";

// Per-request dedupe: generateMetadata + page render share one fetch.
const fetchPartner = cache((id: string) =>
  getPartnerById(id).catch(() => null),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const partner = await fetchPartner(id);
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  if (!partner) {
    return { title: "Partner Not Found | Khelovani" };
  }

  const name = lang === "ge" ? partner.companyNameGe : partner.companyNameEn;
  const description =
    lang === "ge"
      ? partner.description
      : partner.descriptionEn || partner.description;

  return {
    title: `${name} | Khelovani Partner`,
    description:
      description?.slice(0, 160) || `Check out ${name}'s profile on Khelovani.`,
    openGraph: {
      images: partner.profilePhoto ? [partner.profilePhoto] : [],
    },
  };
}

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  const partnerData = await fetchPartner(id);

  let products: IProduct[] = [];
  let productCount = partnerData?.productCount ?? 0;
  if (partnerData) {
    const res = await getProducts({
      partnerId: id,
      limit: 4,
      isShown: true,
    }).catch(() => null);
    if (res) {
      products = res.data || [];
      productCount = res.meta?.totalCount ?? productCount;
    }
  }

  return (
    <main>
      <PartnerDetail
        id={id}
        initialData={partnerData}
        products={products}
        productCount={productCount}
        serverLang={lang}
      />
    </main>
  );
}
