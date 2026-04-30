import MainPageHero from "@/components/mainPage/mainPageHero/MainPageHero";
import PopularCategory from "@/components/mainPage/popularCategory/PopularCategory";
import {
  getPinnedCategories,
  type PublicCategory,
} from "@/apiCalls/categoryRequests/category.req";
import { getPinnedProducts } from "@/apiCalls/productRequests/product.req";
import { IProduct } from "@/lib/types/productTypes";
import PopularProduct from "@/components/mainPage/popularProducts/PopularProduct";
import PopularPartners from "@/components/mainPage/popularPartner/PopularPartners";
import { Partner } from "@/lib/types/partnerTypes";
import { getPinnedPartners } from "@/apiCalls/partnerRequests/partner.req";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let pinnedCategories: PublicCategory[] = [];
  let pinnedProducts: IProduct[] = [];
  let PinnedPartners: Partner[] = [];

  try {
    pinnedCategories = await getPinnedCategories();
    pinnedProducts = await getPinnedProducts();
    PinnedPartners = await getPinnedPartners();
  } catch (error) {
    console.warn("Failed to fetch pinned categories:", error);
    console.warn("Failed to fetch pinned products:", error);
    console.warn("Failed to fetch pinned partners:", error);
  }

  return (
    <div className="main-page">
      <MainPageHero />
      <PopularCategory pinnedCategories={pinnedCategories} />
      <PopularProduct pinnedProducts={pinnedProducts} />
      <PopularPartners PinnedPartners={PinnedPartners} />
    </div>
  );
}
