"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import PasswordInput from "@/components/ui/PasswordInput";
import { deleteAccount } from "@/apiCalls/profileRequests/profile.req";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./dangerZoneSection.scss";

export default function DangerZoneSection() {
  const { logout } = useAuth();
  const router = useRouter();
  const { t: tCommon } = useClientTranslation("common");
  const { t: tAlerts } = useClientTranslation("alerts");
  const { t: tProfile } = useClientTranslation("pages");

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("password_required");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(password);
      toast.success(tAlerts("account_deleted") || "ანგარიში წაიშალა");
      await logout();
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        if (msg === "old_password_incorrect") {
          setError(tAlerts("old_password_incorrect") || "პაროლი არასწორია");
        } else {
          toast.error(tAlerts("error") || "შეცდომა");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="danger-zone-section">
      <div className="danger-zone-section__header">
        <h2 className="danger-zone-section__title">სახიფათო ზონა</h2>
        <p className="danger-zone-section__warning">
          {tProfile("profile.danger.warning") || "ანგარიშის წაშლა შეუქცევადია"}
        </p>
      </div>

      <button
        className="danger-zone-section__delete-btn"
        onClick={() => setShowModal(true)}
      >
        {tCommon("delete") || "ანგარიშის წაშლა"}
      </button>

      {showModal && (
        <div
          className="danger-zone-section__overlay"
          onClick={() => !loading && setShowModal(false)}
        >
          <div
            className="danger-zone-section__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="danger-zone-section__modal-title">
              {tProfile("profile.delete.confirm_title") || "დაადასტურე წაშლა"}
            </h3>
            <p className="danger-zone-section__modal-text">
              {tProfile("profile.delete.confirm_text") || "შეიყვანე პაროლი"}
            </p>
            <form onSubmit={handleDelete} noValidate>
              <PasswordInput
                id="deletePassword"
                label=""
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                error={error}
                placeholder="პაროლი"
                fullWidth
              />
              <div className="danger-zone-section__modal-actions">
                <button
                  type="button"
                  className="danger-zone-section__modal-cancel"
                  onClick={() => {
                    setShowModal(false);
                    setPassword("");
                    setError("");
                  }}
                  disabled={loading}
                >
                  {tCommon("cancel") || "გაუქმება"}
                </button>
                <button
                  type="submit"
                  className="danger-zone-section__modal-confirm"
                  disabled={loading}
                >
                  {loading
                    ? tCommon("loading") || "..."
                    : tCommon("delete") || "წაშლა"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
