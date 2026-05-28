"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileData } from "@/apiCalls/profileRequests/profile.req";
import { getProfile } from "@/apiCalls/profileRequests/profile.req";
import ProfileHeaderCard from "./ProfileHeaderCard/ProfileHeaderCard";
import ProfileInfoSection from "./ProfileInfoSection/ProfileInfoSection";
import ChangePasswordSection from "./ChangePasswordSection/ChangePasswordSection";
import PaymentsSection from "./PaymentsSection/PaymentsSection";
import AddressesSection from "./AddressesSection/AddressesSection";
import DangerZoneSection from "./DangerZoneSection/DangerZoneSection";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface Props {
  initialProfile: ProfileData | null;
}

type TabId = "personal" | "addresses" | "security" | "payments" | "danger";

const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4 21c0-4 3.6-7 8-7s8 3 8 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="10"
      width="16"
      height="11"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 10V7a4 4 0 0 1 8 0v3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3 2 20h20L12 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12 10v4M12 17h.01"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function ProfileClient({ initialProfile }: Props) {
  const { isHydrated, isAuthenticated, userName, profileImage } = useAuth();
  const router = useRouter();
  const { t: tProfile } = useClientTranslation("pages");
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (profile) return;

    const token = localStorage.getItem("access-token");
    if (!token) return;

    document.cookie = `access-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

    getProfile(token)
      .then((data) => setProfile(data))
      .catch(() => router.replace("/login"));
  }, [isHydrated, isAuthenticated, profile, router]);

  if (!isHydrated || !profile) {
    return (
      <div className="profile-page__loading">
        <span className="spinner" />
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode; danger?: boolean }[] = [
    {
      id: "personal",
      label: tProfile("profile.tabs.personal") || "პირადი მონაცემები",
      icon: <PersonIcon />,
    },
    {
      id: "addresses",
      label: tProfile("profile.tabs.addresses") || "მისამართები",
      icon: <PinIcon />,
    },
    {
      id: "security",
      label: tProfile("profile.tabs.security") || "უსაფრთხოება",
      icon: <LockIcon />,
    },
    {
      id: "payments",
      label: tProfile("profile.tabs.payments") || "გადახდები",
      icon: <CardIcon />,
    },
    {
      id: "danger",
      label: tProfile("profile.tabs.danger") || "სახიფათო ზონა",
      icon: <AlertIcon />,
      danger: true,
    },
  ];

  return (
    <div className="profile-settings">
      <ProfileHeaderCard
        currentImage={profileImage}
        displayName={userName}
        email={profile.email}
        idNumber={profile.idNumber}
        isVerified={profile.isVerified}
      />

      <div className="profile-settings__body">
        <nav className="profile-settings__nav" aria-label="profile sections">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  className={`profile-settings__nav-item${
                    activeTab === tab.id ? " active" : ""
                  }${tab.danger ? " danger" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id}
                >
                  <span className="profile-settings__nav-icon">{tab.icon}</span>
                  <span className="profile-settings__nav-label">
                    {tab.label}
                  </span>
                  <span className="profile-settings__nav-chevron" aria-hidden>
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="profile-settings__content">
          {activeTab === "personal" && (
            <ProfileInfoSection
              profile={profile}
              onUpdated={(updated) => setProfile(updated)}
            />
          )}
          {activeTab === "addresses" && <AddressesSection />}
          {activeTab === "security" && <ChangePasswordSection />}
          {activeTab === "payments" && <PaymentsSection />}
          {activeTab === "danger" && <DangerZoneSection />}
        </div>
      </div>
    </div>
  );
}
