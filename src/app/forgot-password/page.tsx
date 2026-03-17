"use client";

import Image from "next/image";
import "./forgot-password.scss";
import TextInput from "@/components/ui/TextInput";
import { useState } from "react";

// ✅ Define form type
type FormFields = {
  email: string;
};

function ForgotPassword() {
  const [formData, setFormData] = useState<FormFields>({
    email: "",
  });

  const [errors, setErrors] = useState<FormFields>({
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;

    // ✅ restrict key to known fields
    const field = id as keyof FormFields;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // ✅ clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: FormFields = {
      email: "",
    };

    // ✅ simple validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);

    // ✅ if no errors → proceed
    if (!newErrors.email) {
      console.log("Send reset link to:", formData.email);
      // TODO: call API here
    }
  };
  return (
    <div className="forgot-password">
      <div className="forgot-password__content">
        <div className="image-content">
          <Image
            src="/assets/lock.svg"
            alt="forgot password"
            width={24}
            height={24}
          />
        </div>

        <h1 className="title">დაგავიწყდა პაროლი?</h1>
        <p>
          შეიყვანე შენი მეილი და ჩვენ გამოგიგზავნით <br /> პაროლის აღდგენის
          ბმულს
        </p>
        <form action="" className="form">
          <TextInput
            id="email"
            label="ელ. ფოსტა"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="company@example.com"
          />

          <button className="send-btn">გაგზავნა</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
