import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { cookies } from "next/headers";
import { Lang } from "@/lib/types/lang.types";

import { getTranslations } from "@/apiCalls/common.req";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLang = (cookieStore.get("lang")?.value as Lang) || "ge";
  let translations: Record<string, any> = {};

  try {
    translations = await getTranslations();
  } catch (error) {
    // translations will fallback to {} in context
    console.warn("Failed to fetch translations in layout:", error);
  }

  return (
    <html lang={initialLang === "ge" ? "ka" : "en"}>
      <body>
        <LanguageProvider
          initialTranslations={translations}
          initialLang={initialLang}
        >
          <AuthProvider>{children}</AuthProvider>
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
