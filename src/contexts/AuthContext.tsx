"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile } from "@/apiCalls/profileRequests/profile.req";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthContextType {
  isAuthenticated: boolean;
  isHydrated: boolean;
  userName: string | null;
  profileImage: string | null;
  login: (token: string, nameEn?: string, nameGe?: string, image?: string | null) => void;
  logout: () => void;
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
    const token = localStorage.getItem("access-token");
    const storedEn = localStorage.getItem("user-name-en");
    const storedGe = localStorage.getItem("user-name-ge");
    const storedImg = localStorage.getItem("user-profile-image");

    if (token) {
      setIsAuthenticated(true);
      setNameEn(storedEn);
      setNameGe(storedGe);
      setProfileImage(storedImg);

      if (!storedEn && !storedGe) {
        getProfile(token).then((profile) => {
          if (profile) applyProfile(profile.nameEn, profile.nameGe, profile.profileImage);
        });
      }
    }
    setIsHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProfile = async () => {
    const token = localStorage.getItem("access-token");
    if (!token) return;
    const profile = await getProfile(token);
    if (profile) applyProfile(profile.nameEn, profile.nameGe, profile.profileImage);
  };

  const login = (token: string, en?: string, ge?: string, image?: string | null) => {
    localStorage.setItem("access-token", token);
    document.cookie = `access-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    setIsAuthenticated(true);
    applyProfile(en, ge, image);
  };

  const logout = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("user-name-en");
    localStorage.removeItem("user-name-ge");
    localStorage.removeItem("user-profile-image");
    document.cookie = "access-token=; path=/; max-age=0";
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
