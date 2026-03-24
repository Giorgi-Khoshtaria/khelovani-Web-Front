import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "ხელოვანი — ქართული ხელნაკეთი ნივთები",
  description:
    "აღმოაჩინეთ ნამდვილი ქართული ხელოვნება და ხელნაკეთი ნივთები, შექმნილი ოსტატი ხელოსნების მიერ.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let translations = {};
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/translations`,
      { cache: "no-store" }, // ensures fresh translations or use revalidate if static
    );
    const data = await response.json();
    if (data.success && data.data.grouped) {
      translations = data.data.grouped;
    }
  } catch (error) {
    console.error("Failed to fetch translations in layout:", error);
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
