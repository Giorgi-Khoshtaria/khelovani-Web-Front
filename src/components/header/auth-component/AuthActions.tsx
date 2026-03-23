import Link from "next/link";
import "./authAction.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthActionsProps {
  mobile?: boolean;
}

function AuthActions({ mobile }: AuthActionsProps) {
  const { t } = useClientTranslation("navigation");
  const { isAuthenticated, logout } = useAuth();
  const { lang } = useLanguage();

  const logoutText = lang === "ge" ? "გასვლა" : "Logout";

  if (isAuthenticated) {
    return (
      <div className={`auth-action ${mobile ? "mobile" : ""}`}>
        <button onClick={logout} className="logout-btn">
          {logoutText}
        </button>
      </div>
    );
  }

  return (
    <div className={`auth-action ${mobile ? "mobile" : ""}`}>
      <Link href="/login" className="login-btn">
        {t("login")}
      </Link>
      <Link href="/register" className="register-btn">
        {t("register")}
      </Link>
    </div>
  );
}

export default AuthActions;
