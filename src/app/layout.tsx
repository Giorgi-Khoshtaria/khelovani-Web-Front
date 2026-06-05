import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { Cormorant_Garamond, Noto_Serif_Georgian } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

// Self-hosted at build time (no render-blocking request to fonts.googleapis,
// automatic preload + fallback-metric adjustment to avoid font-swap CLS).
// Cormorant Garamond drives the English UI; Noto Serif Georgian covers ქართული.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ["georgian"],
  variable: "--font-georgian",
  display: "swap",
});
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CartProvider } from "@/contexts/CartContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { cookies } from "next/headers";
import { Lang } from "@/lib/types/lang.types";
import { Translations } from "@/lib/types/translations";

import { getTranslations } from "@/apiCalls/common.req";
import {
  getPublicCategories,
  type PublicCategory,
} from "@/apiCalls/categoryRequests/category.req";
import { getMenu, type MenuItem } from "@/apiCalls/menu/menu.req";

// Default title for every page (client-component pages can't export their own
// metadata, so they inherit this). Server pages override `title` with the page
// name, which renders through the template as "Page · Khelovani".
export const metadata: Metadata = {
  title: {
    default: "Khelovani — ქართული ხელნაკეთი ნივთები",
    template: "%s · Khelovani",
  },
  description:
    "Khelovani — ქართველი ხელოსნებისა და ბრენდების ონლაინ მარკეტი: ხელნაკეთი კერამიკა, სამკაული, ტექსტილი და სხვა.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLang = (cookieStore.get("lang")?.value as Lang) || "ge";

  const [translations, categories, menuItems] = await Promise.all([
    getTranslations().catch((err): Translations => {
      console.warn("Failed to fetch translations:", err);
      return {};
    }),
    getPublicCategories().catch((err): PublicCategory[] => {
      console.warn("Failed to fetch categories:", err);
      return [];
    }),
    getMenu().catch((err): MenuItem[] => {
      console.warn("Failed to fetch menu:", err);
      return [];
    }),
  ]);

  return (
    <html
      lang={initialLang === "ge" ? "ka" : "en"}
      className={`${cormorant.variable} ${notoSerifGeorgian.variable}`}
    >
      <body>
        <LanguageProvider
          initialTranslations={translations}
          initialLang={initialLang}
        >
          <CategoriesProvider initialCategories={categories}>
            <MenuProvider initialMenuItems={menuItems}>
              <AuthProvider>
                <FavoritesProvider>
                  <CartProvider>{children}</CartProvider>
                </FavoritesProvider>
              </AuthProvider>
            </MenuProvider>
          </CategoriesProvider>
        </LanguageProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </body>
    </html>
  );
}
