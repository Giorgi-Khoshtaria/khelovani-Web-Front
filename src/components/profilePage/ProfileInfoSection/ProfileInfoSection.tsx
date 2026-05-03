"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import TextInput from "@/components/ui/TextInput";
import PhoneInput from "@/components/ui/PhoneInput";
import SelectInput from "@/components/ui/SelectInput";
import { CITY_OPTIONS } from "@/components/ui/CityOptions";
import { updateProfile } from "@/apiCalls/profileRequests/profile.req";
import type { ProfileData } from "@/apiCalls/profileRequests/profile.req";
import { validateProfileUpdate, type ProfileUpdateFormData } from "@/lib/validations/profileUpdateValidations";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./profileInfoSection.scss";

interface Props {
  profile: ProfileData;
  onUpdated: (updated: ProfileData) => void;
}

function toFormData(p: ProfileData): ProfileUpdateFormData {
  return {
    idNumber: p.idNumber ?? "",
    nameGe: p.nameGe ?? "",
    nameEn: p.nameEn ?? "",
    dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : "",
    city: p.city ?? "",
    address: p.address ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
  };
}

export default function ProfileInfoSection({ profile, onUpdated }: Props) {
  const { refreshProfile } = useAuth();
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tAlerts } = useClientTranslation("alerts");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateFormData>(toFormData(profile));
  const [snapshot, setSnapshot] = useState<ProfileUpdateFormData>(toFormData(profile));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleEdit = () => {
    setSnapshot(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(snapshot);
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    const errs = validateProfileUpdate(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const token = localStorage.getItem("access-token");
    if (!token) return;

    setLoading(true);
    try {
      const updated = await updateProfile(token, formData);
      onUpdated(updated);
      await refreshProfile();
      setIsEditing(false);
      setErrors({});
      toast.success(tAlerts("profile_updated") || "პროფილი განახლდა");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        err.response.data.errors.forEach((e: { field: string; message: string }) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      } else {
        toast.error(tAlerts("error") || "შეცდომა");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-info-section">
      <div className="profile-info-section__header">
        <h2 className="profile-info-section__title">პირადი მონაცემები</h2>
        {!isEditing ? (
          <button className="profile-info-section__edit-btn" onClick={handleEdit}>
            {tCommon("edit") || "რედაქტირება"}
          </button>
        ) : (
          <div className="profile-info-section__actions">
            <button className="profile-info-section__cancel-btn" onClick={handleCancel} disabled={loading}>
              {tCommon("cancel") || "გაუქმება"}
            </button>
            <button className="profile-info-section__save-btn" onClick={handleSave} disabled={loading}>
              {loading ? (tCommon("loading") || "...") : (tCommon("save") || "შენახვა")}
            </button>
          </div>
        )}
      </div>

      <div className="profile-info-section__grid">
        <TextInput
          id="idNumber"
          label={tInputs("label.id_number") || "პირადი ნომერი"}
          value={formData.idNumber}
          onChange={handleChange}
          error={errors.idNumber}
          placeholder={tInputs("placeholder.id_number") || ""}
          maxLength={11}
          fullWidth
          disabled={!isEditing}
        />
        <TextInput
          id="nameGe"
          label={tInputs("label.full_name_ge") || "სახელი (ქართულად)"}
          value={formData.nameGe}
          onChange={handleChange}
          error={errors.nameGe}
          placeholder={tInputs("placeholder.full_name") || ""}
          disabled={!isEditing}
        />
        <TextInput
          id="nameEn"
          label={tInputs("label.full_name_en") || "სახელი (ლათინურად)"}
          value={formData.nameEn}
          onChange={handleChange}
          error={errors.nameEn}
          placeholder="First and Last Name"
          disabled={!isEditing}
        />
        <TextInput
          id="email"
          label={tInputs("label.email") || "ელ-ფოსტა"}
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder={tInputs("placeholder.email") || ""}
          disabled={!isEditing}
        />
        <PhoneInput
          id="phone"
          label={tInputs("label.phone") || "ტელეფონი"}
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          disabled={!isEditing}
        />
        <TextInput
          id="dateOfBirth"
          label={tInputs("label.date_of_birth") || "დაბადების თარიღი"}
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
          disabled={!isEditing}
        />
        <SelectInput
          id="city"
          label={tInputs("label.city") || "ქალაქი"}
          value={formData.city}
          onChange={handleChange}
          options={CITY_OPTIONS}
          placeholder={tInputs("placeholder.city") || ""}
          error={errors.city}
          disabled={!isEditing}
        />
        <TextInput
          id="address"
          label={tInputs("label.address") || "მისამართი"}
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder={tInputs("placeholder.address") || ""}
          fullWidth
          disabled={!isEditing}
        />
      </div>
    </div>
  );
}
