import Navigation from "../navigation-component/Navigation";
import AuthActions from "../auth-component/AuthActions";
import "./sideMenu.scss";
import Image from "next/image";

interface NavItem {
  title: string;
  titleEn: string;
  path: string;
}

interface SideMenuProps {
  closeIcon: string;
  nav: NavItem[];
  lang: "GE" | "EN";
  isOpen: boolean;
  onClose: () => void;
}

function SideMenu({ closeIcon, nav, lang, isOpen, onClose }: SideMenuProps) {
  return (
    <div className={`side-menu ${isOpen ? "side-menu--open" : ""}`}>
      <div className="side-menu__header">
        <button
          className="side-menu__close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <Image src={closeIcon} width={24} height={24} alt="Close menu" />
        </button>
      </div>

      <div className="side-menu__nav">
        <Navigation nav={nav} lang={lang} mobile={true} />
      </div>

      <div className="side-menu__auth">
        <AuthActions lang={lang} mobile={true} />
      </div>
    </div>
  );
}

export default SideMenu;
