import { cookies } from "next/headers";
import { getProfile, type ProfileData } from "@/apiCalls/profileRequests/profile.req";
import ProfileClient from "@/components/profilePage/ProfileClient";
import "./profile.scss";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;

  let profile: ProfileData | null = null;
  if (token) {
    profile = await getProfile(token);
  }

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <ProfileClient initialProfile={profile} />
      </div>
    </div>
  );
}
