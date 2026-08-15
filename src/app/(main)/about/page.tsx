import type { Metadata } from "next";
import { cookies } from "next/headers";
import AboutHero from "@/components/aboutPage/aboutHero/AboutHero";
import AboutStory from "@/components/aboutPage/aboutStory/AboutStory";
import AboutStats from "@/components/aboutPage/aboutStats/AboutStats";
import AboutCategories from "@/components/aboutPage/aboutCategories/AboutCategories";
import AboutValues from "@/components/aboutPage/aboutValues/AboutValues";
import AboutTestimonials from "@/components/aboutPage/aboutTestimonials/AboutTestimonials";
import AboutCta from "@/components/aboutPage/aboutCta/AboutCta";
import { getPublicStats, type PublicStats } from "@/apiCalls/common.req";
import {
  getPinnedCategories,
  type PublicCategory,
} from "@/apiCalls/categoryRequests/category.req";
import { getPageByPath } from "@/apiCalls/pageRequests/page.req";
import { Lang } from "@/lib/types/lang.types";
import { buildPageMetadata } from "@/lib/utils/seo";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  try {
    const page = await getPageByPath("/about");
    return buildPageMetadata({
      path: "/about",
      title: lang === "ge" ? page.title.ka : page.title.en,
      description: lang === "ge" ? page.description.ka : page.description.en,
      ogImage: page.ogImage,
      noindex: page.noindex,
    });
  } catch {
    return buildPageMetadata({
      path: "/about",
      title: lang === "ge" ? "ჩვენ შესახებ" : "About Us",
      description:
        lang === "ge"
          ? "გაიცანით Khelovani — ქართველი ხელოსნების პლატფორმა."
          : "Meet Khelovani — a platform for Georgian artisans.",
    });
  }
}

export default async function AboutPage() {
  const [stats, pinnedCategories] = await Promise.all([
    getPublicStats().catch(
      (): PublicStats => ({ makers: 0, pieces: 0, regions: 12 }),
    ),
    getPinnedCategories().catch((): PublicCategory[] => []),
  ]);

  return (
    <div className="about-page">
      <AboutHero />
      <AboutStory />
      <AboutStats stats={stats} />
      <AboutValues />
      <AboutCategories categories={pinnedCategories} />
      <AboutTestimonials />
      <AboutCta />
    </div>
  );
}
