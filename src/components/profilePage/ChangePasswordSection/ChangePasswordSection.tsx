"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PasswordInput from "@/components/ui/PasswordInput";
import { changePassword } from "@/apiCalls/profileRequests/profile.req";
import { validateChangePassword, type ChangePasswordFormData } from "@/lib/validations/changePasswordValidations";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./changePasswordSection.scss";

const INITIAL: ChangePasswordFormData = { oldPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePasswordSection() {
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tAlerts } = useClientTranslation("alerts");

  const [formData, setFormData] = useState<ChangePasswordFormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateChangePassword(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const token = localStorage.getItem("access-token");
    if (!token) return;

    setLoading(true);
    try {
      await changePassword(token, formData);
      setFormData(INITIAL);
      setErrors({});
      toast.success(tAlerts("password_updated") || "პაროლი შეიცვალა");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        if (msg === "old_password_incorrect") {
          setErrors({ oldPassword: tAlerts("old_password_incorrect") || "ძველი პაროლი არასწორია" });
        } else if (err.response?.data?.errors) {
          const apiErrors: Record<string, string> = {};
          err.response.data.errors.forEach((e: { field: string; message: string }) => {
            apiErrors[e.field] = e.message;
          });
          setErrors(apiErrors);
        } else {
          toast.error(tAlerts("error") || "შეცდომა");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-section">
      <div className="change-password-section__header">
        <h2 className="change-password-section__title">პაროლის შეცვლა</h2>
      </div>

      <form className="change-password-section__form" onSubmit={handleSubmit} noValidate>
        <PasswordInput
          id="oldPassword"
          label={tInputs("label.old_password") || "ძველი პაროლი"}
          value={formData.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          placeholder={tInputs("placeholder.old_password") || "შეიყვანე ძველი პაროლი"}
          fullWidth
        />
        <PasswordInput
          id="newPassword"
          label={tInputs("label.new_password") || "ახალი პაროლი"}
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          placeholder={tInputs("placeholder.new_password") || "შეიყვანე ახალი პაროლი"}
          fullWidth
        />
        <PasswordInput
          id="confirmPassword"
          label={tInputs("label.confirm_password") || "გაიმეორე პაროლი"}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder={tInputs("placeholder.confirm_password") || "გაიმეორე ახალი პაროლი"}
          fullWidth
        />
        <button type="submit" className="change-password-section__btn" disabled={loading}>
          {loading ? (tCommon("loading") || "...") : (tCommon("update") || "განახლება")}
        </button>
      </form>
    </div>
  );
}
