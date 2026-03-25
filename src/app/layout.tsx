import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let translations: Record<string, any> = {};

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const translationsUrl = apiUrl ? `${apiUrl}/api/admin/translations` : null;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchTranslationsWithRetry = async (url: string) => {
    const attempts = 3;
    for (let i = 0; i < attempts; i++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(url, {
          cache: "no-store", // ensures fresh translations
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(
            `Translations fetch failed: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        if (data?.success && data?.data?.grouped) {
          return data.data.grouped;
        }

        return {};
      } catch (error) {
        // Retry quickly on transient startup issues (e.g. API not ready yet).
        if (i === attempts - 1) throw error;
        await sleep(250 * 2 ** i);
      }
    }

    return {};
  };

  if (!translationsUrl) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not set; skipping translations fetch.",
    );
  } else {
    try {
      translations = await fetchTranslationsWithRetry(translationsUrl);
    } catch (error) {
      // Avoid noisy logs in dev; translations will fall back to key names.
      console.warn(
        "Failed to fetch translations in layout (dev fallback):",
        error,
      );
    }
  }

  return (
    <html lang="ka">
      <body>
        <LanguageProvider initialTranslations={translations}>
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
