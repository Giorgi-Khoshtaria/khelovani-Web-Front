"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Icon } from "@/lib/utils/icons";
import { uploadProfileImage, deleteProfileImage } from "@/apiCalls/profileRequests/profile.req";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./profileImageSection.scss";

interface Props {
  currentImage: string | null;
  displayName: string | null;
  email: string;
}

export default function ProfileImageSection({ currentImage, displayName, email }: Props) {
  const { refreshProfile } = useAuth();
  const { t: tProfile } = useClientTranslation("pages");
  const { t: tAlerts } = useClientTranslation("alerts");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem("access-token");
    if (!token) return;
    setUploading(true);
    try {
      await uploadProfileImage(token, file);
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
    const token = localStorage.getItem("access-token");
    if (!token) return;
    setUploading(true);
    try {
      await deleteProfileImage(token);
      await refreshProfile();
      toast.success(tAlerts("image_removed") || "ფოტო წაიშალა");
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-image-section">
      <div className="profile-image-section__avatar-wrap">
        <button
          className="profile-image-section__avatar"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="Change photo"
        >
          {currentImage ? (
            <Image src={currentImage} alt="avatar" fill className="profile-image-section__img" />
          ) : (
            <span className="profile-image-section__icon">{Icon.user}</span>
          )}
          {uploading && <div className="profile-image-section__overlay"><span className="spinner" /></div>}
        </button>
      </div>

      <div className="profile-image-section__info">
        {displayName && <p className="profile-image-section__name">{displayName}</p>}
        <p className="profile-image-section__email">{email}</p>
        <div className="profile-image-section__actions">
          <button
            className="profile-image-section__btn"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {tProfile("profile.image.change") || "ფოტოს შეცვლა"}
          </button>
          {currentImage && (
            <button
              className="profile-image-section__btn profile-image-section__btn--remove"
              onClick={handleRemove}
              disabled={uploading}
            >
              {tProfile("profile.image.remove") || "ფოტოს წაშლა"}
            </button>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
    </div>
  );
}
