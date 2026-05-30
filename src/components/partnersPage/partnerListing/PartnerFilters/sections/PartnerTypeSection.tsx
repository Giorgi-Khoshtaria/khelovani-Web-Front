"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartnerType, PartnerTypeEnum } from "@/lib/types/partnerTypes";
import { FilterSection, FilterChip } from "@/components/ui/FilterDrawer";

interface Props {
  value: PartnerType | "";
  onChange: (type: PartnerType | "") => void;
}

export default function PartnerTypeSection({ value, onChange }: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tInputs } = useClientTranslation("inputs");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const labels = {
    type: tCommon("type") || (isGe ? "ტიპი" : "Type"),
    allPartners: tCommon("all_partners") || (isGe ? "ყველა" : "All"),
    company:
      tInputs("label.partner_type_organization") ||
      (isGe ? "კომპანია" : "Company"),
    brand:
      tInputs("label.partner_type_individual") || (isGe ? "ბრენდი" : "Brand"),
  };

  return (
    <FilterSection label={labels.type}>
      <div className="fd-chips">
        <FilterChip active={value === ""} onClick={() => onChange("")}>
          {labels.allPartners}
        </FilterChip>
        <FilterChip
          active={value === PartnerTypeEnum.ORGANIZATION}
          onClick={() => onChange(PartnerTypeEnum.ORGANIZATION)}
        >
          {labels.company}
        </FilterChip>
        <FilterChip
          active={value === PartnerTypeEnum.INDIVIDUAL}
          onClick={() => onChange(PartnerTypeEnum.INDIVIDUAL)}
        >
          {labels.brand}
        </FilterChip>
      </div>
    </FilterSection>
  );
}
