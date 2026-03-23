import Link from "next/link";
import "./navigation.scss";
import { Lang } from "@/lib/types/lang.types";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

export interface NavItem {
  key: string;
  path: string;
}

const pathMap: Record<string, string> = {
  home: "/",
  about: "/about",
  products: "/products",
  partners: "/partners",
  contact: "/contact",
};

interface NavigationProps {
  nav?: NavItem[];
  mobile?: boolean;
}

function Navigation({ nav, mobile }: NavigationProps) {
  const { t, translations } = useClientTranslation("navigation");

  const items = nav || Object.keys(translations)
    .filter((key) => pathMap[key])
    .map((key) => ({ key, path: pathMap[key] }));

  return (
    <ul className={`navigation ${mobile ? "mobile" : ""}`}>
      {items.map((item) => (
        <li key={item.path}>
          <Link href={item.path}>{t(item.key)}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;
