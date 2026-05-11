"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileData } from "@/apiCalls/profileRequests/profile.req";
import { getProfile } from "@/apiCalls/profileRequests/profile.req";
import ProfileImageSection from "./ProfileImageSection/ProfileImageSection";
import ProfileInfoSection from "./ProfileInfoSection/ProfileInfoSection";
import ChangePasswordSection from "./ChangePasswordSection/ChangePasswordSection";
import DangerZoneSection from "./DangerZoneSection/DangerZoneSection";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  initialProfile: ProfileData | null;
}

export default function ProfileClient({ initialProfile }: Props) {
  const { isHydrated, isAuthenticated, userName, profileImage } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (profile) return;

    const token = localStorage.getItem("access-token");
    if (!token) return;

    // Sync cookie for future SSR visits
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

  return (
    <>
      <ProfileImageSection
        currentImage={profileImage}
        displayName={userName}
        email={profile.email}
      />
      <ProfileInfoSection
        profile={profile}
        onUpdated={(updated) => setProfile(updated)}
      />
      <ChangePasswordSection />
      <DangerZoneSection />
    </>
  );
}
