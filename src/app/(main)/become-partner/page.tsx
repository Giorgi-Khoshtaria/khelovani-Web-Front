import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getPageByPath } from "@/apiCalls/pageRequests/page.req";
import { Lang } from "@/lib/types/lang.types";
import { buildPageMetadata } from "@/lib/utils/seo";
import BecomePartnerPageClient from "./BecomePartnerPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  try {
    const page = await getPageByPath("/become-partner");
    return buildPageMetadata({
      path: "/become-partner",
      title: lang === "ge" ? page.title.ka : page.title.en,
      description: lang === "ge" ? page.description.ka : page.description.en,
      ogImage: page.ogImage,
      noindex: page.noindex,
    });
  } catch {
    return buildPageMetadata({
      path: "/become-partner",
      title: lang === "ge" ? "გახდი პარტნიორი" : "Become a Partner",
      description:
        lang === "ge"
          ? "დარეგისტრირდი, როგორც Khelovani-ს პარტნიორი და გაყიდე შენი ნამუშევრები."
          : "Register as a Khelovani partner and start selling your work.",
    });
  }
}

export default function BecomePartnerPage() {
  return <BecomePartnerPageClient />;
}
