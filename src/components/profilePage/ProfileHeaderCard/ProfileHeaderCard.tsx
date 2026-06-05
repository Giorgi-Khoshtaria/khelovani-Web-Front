"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  uploadProfileImage,
  deleteProfileImage,
} from "@/apiCalls/profileRequests/profile.req";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./profileHeaderCard.scss";

interface Props {
  currentImage: string | null;
  displayName: string | null;
  email: string;
  idNumber: string;
  isVerified?: boolean;
}

const initials = (name: string | null): string => {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
};

const maskId = (id: string): string => {
  if (!id) return "";
  const tail = id.slice(-4);
  return `${"•".repeat(Math.max(0, id.length - 4))}${tail}`;
};

export default function ProfileHeaderCard({
  currentImage,
  displayName,
  email,
  idNumber,
  isVerified,
}: Props) {
  const { refreshProfile } = useAuth();
  const { t: tProfile } = useClientTranslation("pages");
  const { t: tAlerts } = useClientTranslation("alerts");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadProfileImage(file);
      await refreshProfile();
      toast.success(tAlerts("image_uploaded") || "ფოტო აიტვირთა");
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await deleteProfileImage();
      await refreshProfile();
      toast.success(tAlerts("image_removed") || "ფოტო წაიშალა");
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-header-card">
      <div className="profile-header-card__avatar-wrap">
        <button
          type="button"
          className="profile-header-card__avatar"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label={tProfile("profile.image.change") || "ფოტოს შეცვლა"}
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt="avatar"
              fill
              className="profile-header-card__img"
            />
          ) : (
            <span className="profile-header-card__initials">
              {initials(displayName) || "·"}
            </span>
          )}
          {uploading && (
            <span className="profile-header-card__overlay">
              <span className="spinner" />
            </span>
          )}
        </button>
        <span
          className="profile-header-card__pencil"
          aria-hidden="true"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="profile-header-card__info">
        {displayName && (
          <h1 className="profile-header-card__name">{displayName}</h1>
        )}

        {isVerified && (
          <span className="profile-header-card__verified">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {tProfile("profile.verified") || "ვერიფიცირებული"}
          </span>
        )}

        <p className="profile-header-card__meta">
          {email}
          {idNumber && (
            <>
              <span className="profile-header-card__dot">·</span>
              ID #{maskId(idNumber)}
            </>
          )}
        </p>

        <button
          type="button"
          className="profile-header-card__upload"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0L7 9m5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {tProfile("profile.image.change") || "ფოტოს ატვირთვა"}
        </button>

        {currentImage && (
          <button
            type="button"
            className="profile-header-card__remove"
            onClick={handleRemove}
            disabled={uploading}
          >
            {tProfile("profile.image.remove") || "ფოტოს წაშლა"}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
