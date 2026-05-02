// app/partners/[id]/page.tsx
import PartnerProfile from "@/components/partnersPage/partnerProfile/PartnerProfile";
import { PartnerProducts } from "@/components/partnersPage/partnerProfile/PartnerProducts";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Lang } from "@/lib/types/lang.types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const partner = await getPartnerById(id).catch(() => null);
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

  // Fetch partner with better error handling
  const partnerData = await getPartnerById(id).catch((err) => {
    console.error("Failed to fetch partner:", err);
    return null;
  });

  console.log("Partner ID:", id);
  console.log("Partner data:", partnerData);

  // Only fetch products if partner exists
  let products: any[] = [];
  if (partnerData) {
    products = await getProducts({
      partnerId: id,
      limit: 4,
      isShown: true, // ← add this if you have the filter
    })
      .then((res) => res.data || [])
      .catch((err) => {
        console.error("Failed to fetch products for owner", id, err);
        return [];
      });
  }

  console.log("Products fetched:", products.length);
  console.log(
    "Product owners:",
    products.map((p) => p.owner),
  );

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f9f8f6" }}>
      <PartnerProfile id={id} initialData={partnerData} serverLang={lang} />
      <PartnerProducts products={products} partnerId={id} />
    </main>
  );
}
