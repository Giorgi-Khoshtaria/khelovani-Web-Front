import Link from "next/link";
import { useState, useEffect } from "react";
import { getMenu, MenuItem } from "@/apiCalls/menu/menu.req";
import { useLanguage } from "@/contexts/LanguageContext";
import "./navigation.scss";
interface NavItem {
  key: string;
  path: string;
}

interface NavigationProps {
  nav?: NavItem[];
  mobile?: boolean;
}

function Navigation({ nav, mobile }: NavigationProps) {
  const [dynamicItems, setDynamicItems] = useState<MenuItem[]>([]);
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        const activeItems = (data as MenuItem[])
          .filter((item) => item.isActive)
          .sort((a, b) => a.order - b.order);
        setDynamicItems(activeItems);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };
    fetchMenu();
  }, []);

  // Standard static override fallback
  if (nav) {
    return (
      <ul className={`navigation ${mobile ? "mobile" : ""}`}>
        {nav.map((item) => (
          <li key={item.path}>
            <Link href={item.path}>{item.key}</Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`navigation ${mobile ? "mobile" : ""}`}>
      {dynamicItems.map((item) => (
        <li key={item._id}>
          <Link href={item.href}>
            {lang === "ge" ? item.label.ka : item.label.en}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;
