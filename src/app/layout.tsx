import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { cookies } from "next/headers";
import { Lang } from "@/lib/types/lang.types";
import { Translations } from "@/lib/types/translations";

import { getTranslations } from "@/apiCalls/common.req";
import { getPublicCategories, type PublicCategory } from "@/apiCalls/categoryRequests/category.req";
import { getMenu, type MenuItem } from "@/apiCalls/menu/menu.req";

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
    <html lang={initialLang === "ge" ? "ka" : "en"}>
      <body>
        <LanguageProvider
          initialTranslations={translations}
          initialLang={initialLang}
        >
          <CategoriesProvider initialCategories={categories}>
            <MenuProvider initialMenuItems={menuItems}>
              <AuthProvider>{children}</AuthProvider>
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
