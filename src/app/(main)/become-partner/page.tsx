"use client";

import "./partnerRegistration.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import TextInput from "@/components/ui/TextInput";
import PhoneInput from "@/components/ui/PhoneInput";
import SearchableSelect from "@/components/ui/SearchableSelect/SearchableSelect";
import FormField from "@/components/ui/FormField";
import TextareaInput from "@/components/ui/TextareaInput";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import Button from "@/components/ui/Button";
import { CITY_OPTIONS } from "@/lib/utils/CityOptions";
import {
  validatePartnerForm,
  type PartnerFormData,
} from "@/lib/validations/becomePartnerValidations";
import { PartnerTypeEnum, type PartnerType } from "@/lib/types/partnerTypes";
import { useFormHandler } from "@/lib/hooks/useFormHandler";
import { partnerRegisterRequest } from "@/apiCalls/partnerRequests/partnerAuth.req";
import {
  getPublicCategories,
  type PublicCategory,
} from "@/apiCalls/categoryRequests/category.req";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import CategoryMultiSelect from "./CategoryMultiSelect";

const buildInitialForm = (partnerType: PartnerType): PartnerFormData => {
  if (partnerType === PartnerTypeEnum.INDIVIDUAL) {
    return {
      partnerType: PartnerTypeEnum.INDIVIDUAL,
      personalNumber: "",
      companyNameGe: "",
      companyNameEn: "",
      phone: "",
      city: "",
      email: "",
      address: "",
      addressEn: "",
      description: "",
      categories: [],
      terms: false,
    };
  }
  return {
    partnerType: PartnerTypeEnum.ORGANIZATION,
    identificationCode: "",
    contactPerson: "",
    companyNameGe: "",
    companyNameEn: "",
    phone: "",
    city: "",
    email: "",
    address: "",
    addressEn: "",
    description: "",
    categories: [],
    terms: false,
  };
};

function PartnerRegistration() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [partnerType, setPartnerType] = useState<PartnerType>(
    PartnerTypeEnum.ORGANIZATION,
  );
  const [categories, setCategories] = useState<PublicCategory[]>([]);

  useEffect(() => {
    getPublicCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tAlerts } = useClientTranslation("alerts");
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();

  const { formData, errors, setErrors, handleChange, setFormData } =
    useFormHandler<PartnerFormData>(
      buildInitialForm(PartnerTypeEnum.ORGANIZATION),
    );

  const handleTypeSwitch = (type: PartnerType) => {
    setPartnerType(type);
    setFormData((prev) => ({
      ...buildInitialForm(type),
      companyNameGe: prev.companyNameGe,
      companyNameEn: prev.companyNameEn,
      phone: prev.phone,
      city: prev.city,
      email: prev.email,
      address: prev.address,
      addressEn: prev.addressEn,
      description: prev.description ?? "",
      categories: prev.categories ?? [],
      terms: prev.terms,
    }));
    setErrors({});
  };

  const handleCategoryToggle = (slug: string) => {
    setFormData((prev) => {
      const current = prev.categories ?? [];
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      return { ...prev, categories: next };
    });
  };

  const handleCategoriesClear = () => {
    setFormData((prev) => ({ ...prev, categories: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validatePartnerForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await partnerRegisterRequest(
        {
          ...formData,
          phone: formData.phone.replace(/^\+?995/, ""),
          description: formData.description || "",
        },
        lang,
      );
      const successKey =
        partnerType === PartnerTypeEnum.INDIVIDUAL
          ? "register_as_individual_success"
          : "partner_registered";
      toast.success(tAlerts(successKey) || "განაცხადი წარმატებით გაიგზავნა!");
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
    } finally {
      setIsLoading(false);
    }
  };

  const isOrg = partnerType === PartnerTypeEnum.ORGANIZATION;

  return (
    <div className="partner-registration-page">
      <div className="partner-registration-page__form">
        <div className="partner-registration-content">
          <h2>{tPages("become_partner.title")}</h2>
          <p>{tPages("become_partner.subtitle")}</p>
        </div>

        <div
          className="partner-type-toggle"
          role="group"
          aria-label={tInputs("label.partner_type") || "რეგისტრაციის ტიპი"}
        >
          <p className="partner-type-toggle__label">
            {tInputs("label.partner_type") || "რეგისტრაციის ტიპი"}
          </p>
          <div className="partner-type-toggle__options">
            <label
              className={`partner-type-toggle__option ${isOrg ? "active" : ""}`}
            >
              <input
                type="radio"
                name="partnerType"
                value={PartnerTypeEnum.ORGANIZATION}
                checked={isOrg}
                onChange={() => handleTypeSwitch(PartnerTypeEnum.ORGANIZATION)}
              />
              <span className="partner-type-toggle__name">
                {tInputs("label.partner_type_organization") || "კომპანია"}
              </span>
              <span className="partner-type-toggle__hint">
                {tInputs("label.partner_type_organization_hint") ||
                  "მაგ: შპს, ი/მ, სააქციო საზოგადოება"}
              </span>
            </label>
            <label
              className={`partner-type-toggle__option ${!isOrg ? "active" : ""}`}
            >
              <input
                type="radio"
                name="partnerType"
                value={PartnerTypeEnum.INDIVIDUAL}
                checked={!isOrg}
                onChange={() => handleTypeSwitch(PartnerTypeEnum.INDIVIDUAL)}
              />
              <span className="partner-type-toggle__name">
                {tInputs("label.partner_type_individual") || "ბრენდი"}
              </span>
              <span className="partner-type-toggle__hint">
                {tInputs("label.partner_type_individual_hint") ||
                  "მაგ: ხელოსანი, არტისტი, მცირე ბრენდი"}
              </span>
            </label>
          </div>
        </div>

        <form
          className="partner-registration-form__inputs"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* ── Company Names (truly stacked) ── */}
          <div className="form-section">
            <TextInput
              id="companyNameGe"
              label={
                isOrg
                  ? tInputs("label.company_name_ge") ||
                    "კომპანიის სახელი (ქართულად)"
                  : tInputs("label.full_name_ge") ||
                    "სახელი და გვარი (ქართულად)"
              }
              value={formData.companyNameGe}
              onChange={handleChange}
              error={errors.companyNameGe}
              placeholder={tInputs(
                isOrg ? "placeholder.company_name" : "placeholder.full_name",
              )}
              fullWidth
            />

            <TextInput
              id="companyNameEn"
              label={
                isOrg
                  ? tInputs("label.company_name_en") ||
                    "კომპანიის სახელი (ლათინურად)"
                  : tInputs("label.full_name_en") ||
                    "სახელი და გვარი (ლათინურად)"
              }
              value={formData.companyNameEn}
              onChange={handleChange}
              error={errors.companyNameEn}
              placeholder={isOrg ? "Company Name" : "First Last"}
              fullWidth
            />
          </div>

          {/* ── Identification/Contact Person (truly stacked) ── */}
          <div className="form-section">
            {isOrg ? (
              <>
                <div>
                  <TextInput
                    id="identificationCode"
                    label={tInputs("label.identification_code")}
                    value={
                      "identificationCode" in formData
                        ? formData.identificationCode
                        : ""
                    }
                    onChange={handleChange}
                    error={errors.identificationCode}
                    placeholder={tInputs("placeholder.id_code")}
                    maxLength={9}
                    fullWidth
                  />
                </div>
                <div>
                  <TextInput
                    id="contactPerson"
                    label={tInputs("label.contact_person")}
                    value={
                      "contactPerson" in formData
                        ? (formData.contactPerson ?? "")
                        : ""
                    }
                    onChange={handleChange}
                    error={errors.contactPerson}
                    placeholder={tInputs("placeholder.full_name")}
                    fullWidth
                  />
                </div>
              </>
            ) : (
              <div>
                <TextInput
                  id="personalNumber"
                  label={tInputs("label.id_number") || "პირადი ნომერი"}
                  value={
                    "personalNumber" in formData ? formData.personalNumber : ""
                  }
                  onChange={handleChange}
                  error={errors.personalNumber}
                  placeholder={
                    tInputs("placeholder.id_number") || "11-ნიშნა პირადი ნომერი"
                  }
                  maxLength={11}
                  fullWidth
                />
              </div>
            )}
          </div>

          {/* ── Contact Info (truly stacked) ── */}
          <div className="form-section">
            <div>
              <PhoneInput
                id="phone"
                label={tInputs("label.phone")}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                fullWidth
              />
            </div>
            <div>
              <TextInput
                id="email"
                label={tInputs("label.email")}
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder={tInputs("placeholder.email")}
                fullWidth
              />
            </div>
          </div>

          {/* ── Category (full width) ── */}

          <div className="form-section">
            <FormField
              id="city"
              label={tInputs("label.city")}
              error={errors.city}
              fullWidth
            >
              <SearchableSelect
                id="city"
                value={formData.city}
                options={CITY_OPTIONS.map((city) => ({
                  value: city.value,
                  label: city.label[lang === "ge" ? "ge" : "en"],
                }))}
                placeholder={tInputs("placeholder.city")}
                searchPlaceholder={tCommon("search")}
                emptyText={tCommon("no_results")}
                error={!!errors.city}
                onChange={(v) => {
                  setFormData((prev) => ({ ...prev, city: v }));
                  if (errors.city) {
                    setErrors((prev) => ({ ...prev, city: "" }));
                  }
                }}
              />
            </FormField>
          </div>
          {/* ── Address (truly stacked) ── */}
          <div className="form-section">
            <div>
              <TextInput
                id="address"
                label={tInputs("label.address")}
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder={tInputs("placeholder.address")}
                fullWidth
              />
            </div>
            <div>
              <TextInput
                id="addressEn"
                label={tInputs("label.address_en") || "მისამართი (ინგლისურად)"}
                value={formData.addressEn}
                onChange={handleChange}
                error={errors.addressEn}
                placeholder="Street, Building, Office"
                fullWidth
              />
            </div>
          </div>

          {/* ── Categories ── */}
          {categories.length > 0 && (
            <div className="form-section">
              <CategoryMultiSelect
                id="categories"
                label={tInputs("category") || "კატეგორიები"}
                options={categories.map((cat) => ({
                  value: cat.slug,
                  label: lang === "ge" ? cat.nameGe : cat.nameEn,
                }))}
                selected={formData.categories ?? []}
                onToggle={handleCategoryToggle}
                onClear={handleCategoriesClear}
                placeholder={
                  tInputs("placeholder.categories") ||
                  (lang === "ge" ? "აირჩიეთ კატეგორიები" : "Select categories")
                }
                searchPlaceholder={
                  tInputs("placeholder.search_categories") ||
                  (lang === "ge" ? "ძებნა..." : "Search...")
                }
                selectedSuffix={lang === "ge" ? "არჩეული" : "selected"}
                emptyText={lang === "ge" ? "შედეგი ვერ მოიძებნა" : "No results"}
                clearLabel={lang === "ge" ? "გასუფთავება" : "Clear all"}
                error={errors.categories}
              />
            </div>
          )}

          {/* ── Description (truly stacked) ── */}
          <div className="form-section">
            <div>
              <TextareaInput
                id="description"
                label={tInputs("label.description")}
                value={formData.description ?? ""}
                onChange={handleChange}
                error={errors.description}
                placeholder={tInputs("placeholder.description")}
                rows={5}
                fullWidth
              />
            </div>
          </div>

          <TermsCheckbox
            id="terms"
            checked={formData.terms}
            onChange={handleChange}
            error={errors.terms}
          />

          <div className="create-account-button form-group--full">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              {tNav("register") || "რეგისტრაცია"}
            </Button>
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
