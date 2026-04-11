import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getMenu, MenuItem } from "@/apiCalls/menu/menu.req";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let menuItems: MenuItem[] = [];
  try {
    menuItems = await getMenu();
  } catch (err) {
    console.error("Failed to fetch menu:", err);
  }

  return (
    <div className="layout">
      <Header menuItems={menuItems} />
      {children}
      <Footer />
    </div>
  );
}
