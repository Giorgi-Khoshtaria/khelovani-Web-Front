"use client";

import "./partnerRegistration.scss";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import TextInput from "@/components/ui/TextInput";
import PhoneInput from "@/components/ui/PhoneInput";
import SelectInput from "@/components/ui/SelectInput";
import TextareaInput from "@/components/ui/TextareaInput";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import { CITY_OPTIONS } from "@/components/ui/CityOptions";
import {
  validatePartnerForm,
  type PartnerFormData,
} from "@/lib/validations/becomePartnerValidations";
import { useFormHandler } from "@/lib/hooks/useFormHandler";
import { partnerRegisterRequest } from "@/lib/requests/partnerRequests/partnerAuth.req";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
const INITIAL_FORM: PartnerFormData = {
  companyNameGe: "",
  companyNameEn: "",
  identificationCode: "",
  contactPerson: "",
  phone: "",
  city: "",
  email: "",
  address: "",
  addressEn: "",
  description: "",
  terms: false,
};

function PartnerRegistration() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tAlerts } = useClientTranslation("alerts");
  const { lang } = useLanguage();

  const { formData, errors, setErrors, handleChange } =
    useFormHandler<PartnerFormData>(INITIAL_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validatePartnerForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // add your partner register request here
      await partnerRegisterRequest(formData, lang);
      toast.success(tAlerts("partner_registered") || "განაცხადი წარმატებით გაიგზავნა!");
      setTimeout(() => router.push("/"), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData = error?.response?.data;
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach(
            (err: { field: string; message: string }) => {
              toast.error(err.message);
            },
          );
        } else if (responseData?.message) {
          toast.error(responseData.message);
        } else {
          toast.error(
            tAlerts("registration_error") ||
              "რეგისტრაციის დროს დაფიქსირდა შეცდომა",
          );
        }
      } else {
        toast.error(
          tAlerts("registration_error") ||
            "რეგისტრაციის დროს დაფიქსირდა შეცდომა",
        );
      }
    }
 finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-page__form">
        <div className="registration-content">
          <h2>{tPages("become_partner.title")}</h2>
          <p>{tPages("become_partner.subtitle")}</p>
        </div>

        <form
          className="registration-form__inputs"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextInput
            id="companyNameGe"
            label={
              tInputs("label.company_name_ge") || "კომპანიის სახელი (ქართულად)"
            }
            value={formData.companyNameGe}
            onChange={handleChange}
            error={errors.companyNameGe}
            placeholder={tInputs("placeholder.company_name")}
          />

          <TextInput
            id="companyNameEn"
            label={
              tInputs("label.company_name_en") || "კომპანიის სახელი (ლათინურად)"
            }
            value={formData.companyNameEn}
            onChange={handleChange}
            error={errors.companyNameEn}
            placeholder="Company Name"
          />

          <TextInput
            id="identificationCode"
            label={tInputs("label.identification_code")}
            value={formData.identificationCode}
            onChange={handleChange}
            error={errors.identificationCode}
            placeholder={tInputs("placeholder.id_code")}
            maxLength={9}
            fullWidth
          />

          <TextInput
            id="contactPerson"
            label={tInputs("label.contact_person")}
            value={formData.contactPerson}
            onChange={handleChange}
            error={errors.contactPerson}
            placeholder={tInputs("placeholder.full_name")}
          />

          <PhoneInput
            id="phone"
            label={tInputs("label.phone")}
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <SelectInput
            id="city"
            label={tInputs("label.city")}
            value={formData.city}
            onChange={handleChange}
            options={CITY_OPTIONS}
            placeholder={tInputs("placeholder.city")}
            error={errors.city}
          />

          <TextInput
            id="email"
            label={tInputs("label.email")}
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder={tInputs("placeholder.email")}
          />

          <TextInput
            id="address"
            label={tInputs("label.address")}
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder={tInputs("placeholder.address")}
          />

          <TextInput
            id="addressEn"
            label={tInputs("label.address_en") || "მისამართი (ინგლისურად)"}
            value={formData.addressEn}
            onChange={handleChange}
            error={errors.addressEn}
            placeholder="Street, Building, Office"
          />

          <TextareaInput
            id="description"
            label={tInputs("label.description")}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder={tInputs("placeholder.description")}
            rows={5}
            fullWidth
          />

          <TermsCheckbox
            id="terms"
            checked={formData.terms}
            onChange={handleChange}
            error={errors.terms}
          />

          <div className="create-account-button form-group--full">
            <button
              type="submit"
              disabled={isLoading}
              className="create-account-btn"
            >
              {isLoading
                ? tCommon("loading") || "მიმდინარეობს..."
                : tNav("register") || "რეგისტრაცია"}
            </button>
          </div>
        </form>
      </div>

      <div className="back-to-home">
        <Link href="/">
          <Image
            src="/assets/arrow-left-solid-full.svg"
            width={24}
            height={24}
            alt="უკან"
          />
          {tNav("back_to_home") || "მთავარ გვერდზე დაბრუნება"}
        </Link>
      </div>
    </div>
  );
}

export default PartnerRegistration;
