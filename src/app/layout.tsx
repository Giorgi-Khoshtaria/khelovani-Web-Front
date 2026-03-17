import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "ხელოვანი — ქართული ხელნაკეთი ნივთები",
  description:
    "აღმოაჩინეთ ნამდვილი ქართული ხელოვნება და ხელნაკეთი ნივთები, შექმნილი ოსტატი ხელოსნების მიერ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body>
        {children}
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
