"use client";

import React, { useState } from "react";
import TextInput from "../../ui/TextInput";
import TextareaInput from "../../ui/TextareaInput";
import Button from "../../ui/Button";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./contactForm.scss";

export default function ContactForm() {
  const { t: Pages } = useClientTranslation("pages");
  const { t: Inputs } = useClientTranslation("inputs");
  const { t: Common } = useClientTranslation("common");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="contact-form-card">
      <div className="contact-form-card__title">
        <h2>{Pages("contact_title")}</h2>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form__row contact-form__row--two-cols">
          <TextInput
            id="fullName"
            label={
              <>
                {Inputs("placeholder.full_name")}{" "}
                <span className="required-asterisk">*</span>
              </>
            }
            placeholder={Inputs("placeholder.full_name")}
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
          />
          <TextInput
            id="email"
            type="email"
            label={
              <>
                {Inputs("label.email")}{" "}
                <span className="required-asterisk">*</span>
              </>
            }
            placeholder={Inputs("placeholder.email")}
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className="contact-form__row">
          <TextInput
            id="subject"
            label={
              <>
                {Inputs("placeholder.subject")}{" "}
                <span className="required-asterisk">*</span>
              </>
            }
            placeholder={Inputs("placeholder.subject")}
            value={formData.subject}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <TextareaInput
          id="message"
          label={
            <>
              {Inputs("placeholder.message")}{" "}
              <span className="required-asterisk">*</span>
            </>
          }
          placeholder={Inputs("placeholder.message")}
          value={formData.message}
          onChange={handleChange}
          rows={6}
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          leadingIcon={
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
            </svg>
          }
        >
          {Common("submit")}
        </Button>
      </form>
    </div>
  );
}
