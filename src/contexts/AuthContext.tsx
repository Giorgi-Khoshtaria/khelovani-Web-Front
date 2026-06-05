"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile } from "@/apiCalls/profileRequests/profile.req";
import { logoutUser } from "@/apiCalls/userRequests/auth.req";
import { useLanguage } from "@/contexts/LanguageContext";

// Readable, non-sensitive flag set by the backend alongside the httpOnly
// auth cookie. Browser JS can't read the token itself, so this tells us
// whether a session exists without probing a protected endpoint.
const hasSessionCookie = () =>
  document.cookie.split("; ").some((c) => c.startsWith("logged_in="));

interface AuthContextType {
  isAuthenticated: boolean;
  isHydrated: boolean;
  userName: string | null;
  profileImage: string | null;
  login: (nameEn?: string, nameGe?: string, image?: string | null) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [nameEn, setNameEn] = useState<string | null>(null);
  const [nameGe, setNameGe] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const applyProfile = (en?: string | null, ge?: string | null, image?: string | null) => {
    if (en) { localStorage.setItem("user-name-en", en); setNameEn(en); }
    if (ge) { localStorage.setItem("user-name-ge", ge); setNameGe(ge); }
    const img = image ?? null;
    if (img) localStorage.setItem("user-profile-image", img);
    else localStorage.removeItem("user-profile-image");
    setProfileImage(img);
  };

  useEffect(() => {
    // Purge any legacy token left in localStorage by the pre-cookie auth
    // flow. Nothing reads it anymore, but a lingering token is still
    // XSS-exposed, so wipe it on load. Safe to remove after all clients
    // have run this once.
    localStorage.removeItem("access-token");

    // Auth state comes from the readable `logged_in` flag; the token itself
    // lives in an httpOnly cookie the browser attaches automatically.
    if (hasSessionCookie()) {
      setIsAuthenticated(true);

      const storedEn = localStorage.getItem("user-name-en");
      const storedGe = localStorage.getItem("user-name-ge");
      setNameEn(storedEn);
      setNameGe(storedGe);
      setProfileImage(localStorage.getItem("user-profile-image"));

      if (!storedEn && !storedGe) {
        getProfile()
          .then((profile) =>
            applyProfile(profile.nameEn, profile.nameGe, profile.profileImage),
          )
          .catch(() => {
            // Profile fetch failed — the session may be stale; the axios 401
            // interceptor will redirect if appropriate. Otherwise just skip
            // the profile hydration; cached name/image stays empty.
          });
      }
    }
    setIsHydrated(true);
  // One-shot hydration on mount. Reading the cookie / setting state doesn't
  // require deps; including any would cause re-runs we don't want.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProfile = async () => {
    if (!hasSessionCookie()) return;
    try {
      const profile = await getProfile();
      applyProfile(profile.nameEn, profile.nameGe, profile.profileImage);
    } catch {
      // Caller doesn't need the failure surfaced — UI continues with
      // whatever cached profile data we have.
    }
  };

  const login = (en?: string, ge?: string, image?: string | null) => {
    // The backend already set the httpOnly token + readable `logged_in`
    // cookies on the login response. We only cache non-sensitive profile bits.
    setIsAuthenticated(true);
    applyProfile(en, ge, image);
  };

  const logout = async () => {
    await logoutUser(); // backend clears the httpOnly cookie
    localStorage.removeItem("user-name-en");
    localStorage.removeItem("user-name-ge");
    localStorage.removeItem("user-profile-image");
    document.cookie = "logged_in=; path=/; max-age=0";
    setIsAuthenticated(false);
    setNameEn(null);
    setNameGe(null);
    setProfileImage(null);
  };

  const userName = useMemo(() => {
    if (lang === "ge") return nameGe || nameEn;
    return nameEn || nameGe;
  }, [lang, nameEn, nameGe]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isHydrated, userName, profileImage, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
