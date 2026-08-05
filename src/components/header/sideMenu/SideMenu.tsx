import Image from "next/image";
import Navigation from "../navigation-component/Navigation";
import AuthActions from "../auth-component/AuthActions";
import "./sideMenu.scss";
import { useLanguage } from "@/contexts/LanguageContext";

interface SideMenuProps {
  closeIcon: string;
  isOpen: boolean;
  onClose: () => void;
}

function SideMenu({ closeIcon, isOpen, onClose }: SideMenuProps) {
  const { lang, setLang } = useLanguage();

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

      {/* moved here from the top bar below 768px */}
      <div className="side-menu__lang">
        <button
          type="button"
          className={`side-menu__lang-btn${lang === "en" ? " is-active" : ""}`}
          onClick={() => setLang("en")}
          aria-pressed={lang === "en"}
        >
          EN
        </button>
        <span className="side-menu__lang-sep" aria-hidden="true">
          ·
        </span>
        <button
          type="button"
          className={`side-menu__lang-btn${lang === "ge" ? " is-active" : ""}`}
          onClick={() => setLang("ge")}
          aria-pressed={lang === "ge"}
        >
          GE
        </button>
      </div>

      <div className="side-menu__nav">
        <Navigation mobile={true} />
      </div>

      <div className="side-menu__auth">
        <AuthActions mobile={true} />
      </div>
    </div>
  );
}

export default SideMenu;
