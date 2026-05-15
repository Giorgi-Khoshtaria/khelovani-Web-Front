"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/contexts/MenuContext";
import "./navigation.scss";

interface NavItem {
  key: string;
  path: string;
}

interface NavigationProps {
  nav?: NavItem[];
  mobile?: boolean;
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Navigation({ nav, mobile }: NavigationProps) {
  const { menuItems } = useMenu();
  const { lang } = useLanguage();
  const pathname = usePathname();

  if (nav) {
    return (
      <ul className={`navigation ${mobile ? "mobile" : ""}`}>
        {nav.map((item) => (
          <li
            key={item.path}
            className={isActive(pathname, item.path) ? "is-active" : ""}
          >
            <Link href={item.path}>{item.key}</Link>
          </li>
        ))}
      </ul>
    );
  }

  const activeItems = menuItems
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <ul className={`navigation ${mobile ? "mobile" : ""}`}>
      {activeItems.map((item) => (
        <li
          key={item._id}
          className={isActive(pathname, item.href) ? "is-active" : ""}
        >
          <Link href={item.href}>
            {lang === "ge" ? item.label.ka : item.label.en}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;
