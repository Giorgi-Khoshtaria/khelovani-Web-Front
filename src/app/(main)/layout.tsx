import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
