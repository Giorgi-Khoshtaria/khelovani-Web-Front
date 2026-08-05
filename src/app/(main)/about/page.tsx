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

export const revalidate = 600;

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
