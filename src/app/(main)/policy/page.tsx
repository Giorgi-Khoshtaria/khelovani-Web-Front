import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getPageByPath } from "@/apiCalls/pageRequests/page.req";
import { Lang } from "@/lib/types/lang.types";
import { buildPageMetadata } from "@/lib/utils/seo";
import PolicyPageClient from "./PolicyPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  try {
    const page = await getPageByPath("/policy");
    return buildPageMetadata({
      path: "/policy",
      title: lang === "ge" ? page.title.ka : page.title.en,
      description: lang === "ge" ? page.description.ka : page.description.en,
      ogImage: page.ogImage,
      noindex: page.noindex,
    });
  } catch {
    return buildPageMetadata({
      path: "/policy",
      title: lang === "ge" ? "პოლიტიკა" : "Policy",
      description:
        lang === "ge"
          ? "Khelovani-ს კონფიდენციალურობის, დაბრუნების და მომსახურების პირობები."
          : "Khelovani's privacy, returns, and terms of service policies.",
    });
  }
}

export default function PolicyPage() {
  return <PolicyPageClient />;
}
