import Navigation from "../navigation-component/Navigation";
import AuthActions from "../auth-component/AuthActions";
import "./sideMenu.scss";
import Image from "next/image";

import { MenuItem } from "@/apiCalls/menu/menu.req";

interface SideMenuProps {
  closeIcon: string;
  isOpen: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
}

function SideMenu({ closeIcon, isOpen, onClose, menuItems = [] }: SideMenuProps) {
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
        <Navigation mobile={true} menuItems={menuItems} />
      </div>

      <div className="side-menu__auth">
        <AuthActions mobile={true} />
      </div>
    </div>
  );
}

export default SideMenu;
