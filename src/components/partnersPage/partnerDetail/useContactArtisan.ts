"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { sendPartnerMessage } from "@/apiCalls/partnerRequests/partner.req";

export const MAX_MESSAGE = 600;
const MAX_SUBJECT = 120;
const MIN_MESSAGE = 10;

export interface ContactErrors {
  subject?: string;
  message?: string;
}

interface Params {
  partnerId: string;
  onClose: () => void;
}

/**
 * Drives the "Contact artisan" modal: subject/message state, translated
 * format validation, a character counter, and the send call. Sending requires
 * a logged-in user (the cookie carries the identity) — guests are sent to login.
 */
export const useContactArtisan = ({ partnerId, onClose }: Params) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t: tAlerts } = useClientTranslation("alerts");

  const [subject, setSubjectState] = useState("");
  const [message, setMessageState] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sending, setSending] = useState(false);

  const setSubject = (value: string) => {
    setSubjectState(value);
    if (errors.subject) setErrors((p) => ({ ...p, subject: undefined }));
  };

  const setMessage = (value: string) => {
    setMessageState(value.slice(0, MAX_MESSAGE));
    if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
  };

  const validate = (): ContactErrors => {
    const next: ContactErrors = {};
    const s = subject.trim();
    const m = message.trim();
    if (!s) next.subject = "subject_required";
    else if (s.length > MAX_SUBJECT) next.subject = "subject_too_long";
    if (m.length < MIN_MESSAGE) next.message = "message_too_short";
    else if (m.length > MAX_MESSAGE) next.message = "message_too_long";
    return next;
  };

  const handleSend = async () => {
    if (!isAuthenticated) {
      toast.info(tAlerts("login_required") || "გთხოვთ, გაიაროთ ავტორიზაცია");
      router.push("/login");
      return;
    }

    const found = validate();
    if (found.subject || found.message) {
      setErrors(found);
      return;
    }

    setSending(true);
    try {
      await sendPartnerMessage(partnerId, {
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success(tAlerts("message_sent") || "შეტყობინება გაიგზავნა");
      onClose();
    } catch {
      setSending(false);
      toast.error(tAlerts("message_failed") || "შეტყობინება ვერ გაიგზავნა");
    }
  };

  return {
    subject,
    message,
    errors,
    sending,
    charCount: message.length,
    maxChars: MAX_MESSAGE,
    canSend: subject.trim().length > 0 && message.trim().length >= MIN_MESSAGE,
    setSubject,
    setMessage,
    handleSend,
  };
};
