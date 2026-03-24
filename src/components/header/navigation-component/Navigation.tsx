import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import "./navigation.scss";

interface MenuItem {
  _id: string;
  label: { ka: string; en: string };
  href: string;
  order: number;
  isActive: boolean;
}
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
        const response = await api.get("/api/menu");
        const activeItems = (response.data as MenuItem[])
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
