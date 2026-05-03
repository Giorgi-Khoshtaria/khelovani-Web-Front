"use client";
import Link from "next/link";
import Image from "next/image";
import "./authAction.scss";
import { useEffect, useRef, useState } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { Icon } from "@/lib/utils/icons";

interface AuthActionsProps {
  mobile?: boolean;
}

function AuthActions({ mobile }: AuthActionsProps) {
  const { t } = useClientTranslation("navigation");
  const { isAuthenticated, isHydrated, userName, profileImage, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isHydrated) return null;

  if (isAuthenticated) {
    return (
      <div className={`auth-action ${mobile ? "mobile" : ""}`} ref={ref}>
        <button className="user-trigger" onClick={() => setOpen((o) => !o)}>
          <span className="user-trigger__avatar">
            {profileImage ? (
              <Image src={profileImage} alt="avatar" fill className="user-trigger__avatar-img" />
            ) : (
              Icon.user
            )}
          </span>
          {userName && (
            <span className="user-trigger__name">{userName.split(" ")[0]}</span>
          )}
          <span className={`user-trigger__chevron${open ? " open" : ""}`}>
            {Icon.arrowLeft}
          </span>
        </button>

        {open && (
          <div className="user-dropdown">
            <Link href="/profile" className="user-dropdown__item" onClick={() => setOpen(false)}>
              {t("view_profile")}
            </Link>
            <button
              className="user-dropdown__item user-dropdown__logout"
              onClick={() => { setOpen(false); logout(); }}
            >
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`auth-action ${mobile ? "mobile" : ""}`}>
      <Link href="/login" className="login-btn">{t("login")}</Link>
      <Link href="/register" className="register-btn">{t("register")}</Link>
    </div>
  );
}

export default AuthActions;
