"use client";

import "./partnerRegistration.scss";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import TextInput from "@/components/ui/TextInput";
import PhoneInput from "@/components/ui/PhoneInput";
import SelectInput from "@/components/ui/SelectInput";
import TextareaInput from "@/components/ui/TextareaInput";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import { CITY_OPTIONS } from "@/components/ui/CityOptions";

interface PartnerFormData {
  companyNameGe: string;
  companyNameEn: string;
  identificationCode: string;
  contactPerson: string;
  phone: string;
  city: string;
  email: string;
  address: string;
  description: string;
  terms: boolean;
}

interface PartnerFormErrors {
  [key: string]: string | undefined;
}

const INITIAL_FORM: PartnerFormData = {
  companyNameGe: "",
  companyNameEn: "",
  identificationCode: "",
  contactPerson: "",
  phone: "",
  city: "",
  email: "",
  address: "",
  description: "",
  terms: false,
};

function PartnerRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<PartnerFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<PartnerFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // add your partner register request here
      toast.success("განაცხადი წარმატებით გაიგზავნა!");
      setTimeout(() => router.push("/"), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData = error?.response?.data;
        if (responseData?.message) {
          toast.error(responseData.message);
        } else {
          toast.error("რეგისტრაციის დროს დაფიქსირდა შეცდომა");
        }
      } else {
        toast.error("რეგისტრაციის დროს დაფიქსირდა შეცდომა");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-page__form">
        <div className="registration-content">
          <h2>პარტნიორის რეგისტრაცია</h2>
          <p>შეავსე ფორმა და გახდი ჩვენი პლატფორმის პარტნიორი</p>
        </div>

        <form
          className="registration-form__inputs"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextInput
            id="companyNameGe"
            label="კომპანიის სახელი (ქართულად)"
            value={formData.companyNameGe}
            onChange={handleChange}
            error={errors.companyNameGe}
            placeholder="კომპანიის სახელი"
          />

          <TextInput
            id="companyNameEn"
            label="კომპანიის სახელი (ლათინურად)"
            value={formData.companyNameEn}
            onChange={handleChange}
            error={errors.companyNameEn}
            placeholder="Company Name"
          />

          <TextInput
            id="identificationCode"
            label="საიდენტიფიკაციო კოდი"
            value={formData.identificationCode}
            onChange={handleChange}
            error={errors.identificationCode}
            placeholder="9-ნიშნა საიდენტიფიკაციო კოდი"
            maxLength={9}
            fullWidth
          />

          <TextInput
            id="contactPerson"
            label="საკონტაქტო პირის სახელი"
            value={formData.contactPerson}
            onChange={handleChange}
            error={errors.contactPerson}
            placeholder="სახელი გვარი"
          />

          <PhoneInput
            id="phone"
            label="ტელეფონის ნომერი"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <SelectInput
            id="city"
            label="ქალაქი"
            value={formData.city}
            onChange={handleChange}
            options={CITY_OPTIONS}
            placeholder="აირჩიე ქალაქი"
            error={errors.city}
          />

          <TextInput
            id="email"
            label="ელ. ფოსტა"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="company@example.com"
          />

          <TextInput
            id="address"
            label="მისამართი"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="ქუჩა, შენობა, ოფისი"
            fullWidth
          />

          <TextareaInput
            id="description"
            label="კომპანიის მოკლე აღწერა"
            hint="რამდენიმე წინადადებით აღწერე შენი კომპანია"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="მაგ: ჩვენ ვართ ქართული ხელნაკეთი სამკაულების მწარმოებელი კომპანია, დაარსებული 2010 წელს..."
            rows={3}
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
              {isLoading ? "მიმდინარეობს..." : "რეგისტრაცია"}
            </button>
          </div>
        </form>
      </div>

      <div className="back-to-home">
        <Link href="/">
          <img src="/assets/arrow-left-solid-full.svg" alt="უკან" />
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    </div>
  );
}

export default PartnerRegistration;
