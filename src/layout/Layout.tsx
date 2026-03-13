import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Outlet } from "react-router-dom";
import "./layout.scss";

function Layout() {
  return (
    <div className="layout ">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
