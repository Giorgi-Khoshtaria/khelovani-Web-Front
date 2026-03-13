import { Link } from "react-router-dom";
import "./navigation.scss";
interface NavItem {
  title: string;
  titleEn: string;
  path: string;
}

interface NavigationProps {
  nav: NavItem[];
  lang: "GE" | "EN";
  mobile?: boolean;
}
function Navigation({ nav, lang, mobile }: NavigationProps) {
  return (
    <ul className={`navigation ${mobile ? "mobile" : ""}`}>
      {nav.map((item) => (
        <li key={item.path}>
          <Link to={item.path}>
            {lang === "GE" ? item.title : item.titleEn}
          </Link>
        </li>
      ))}
    </ul>
  );
}
export default Navigation;
