import Link from "next/link";
import "./authAction.scss";

interface AuthActionsProps {
  lang: "GE" | "EN";
  mobile?: boolean;
}

function AuthActions({ lang, mobile }: AuthActionsProps) {
  return (
    <div className={`auth-action ${mobile ? "mobile" : ""}`}>
      <Link href="/login" className="login-btn">
        {lang === "GE" ? "შესვლა" : "Login"}
      </Link>
      <Link href="/register" className="register-btn">
        {lang === "GE" ? "რეგისტრაცია" : "Register"}
      </Link>
    </div>
  );
}

export default AuthActions;
