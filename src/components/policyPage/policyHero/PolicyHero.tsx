"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { PolicyTabConfig } from "@/lib/hooks/usePolicyTabs";
import type { PolicyCategory } from "@/lib/utils/policyContent.data";
import "./policyHero.scss";

interface PolicyHeroProps {
  tabs: PolicyTabConfig[];
  activeTab: PolicyCategory;
  onChange: (tab: PolicyCategory) => void;
}

export default function PolicyHero({ tabs, activeTab, onChange }: PolicyHeroProps) {
  const { t } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";

  return (
    <section className="policy-hero">
      <div className="policy-hero__inner">
        <span className="policy-hero__eyebrow">
          {t("policy.eyebrow") || (isGe ? "სამართლებრივი" : "Legal")}
        </span>

        <h1 className="policy-hero__title">
          {t("policy.title_a") || (isGe ? "პირობები და" : "Terms &")}{" "}
          <em>{t("policy.title_b") || (isGe ? "კონფიდენციალურობა" : "Privacy")}</em>
        </h1>

        <p className="policy-hero__description">
          {t("policy.description") ||
            (isGe
              ? "სამი დოკუმენტი: წესები ყიდვისთვის, წესები ხელოსნებისთვის, რომლებიც პლატფორმაზე ყიდიან, და როგორ ვმართავთ თქვენს მონაცემებს. დაწერილია წასაკითხად — არცერთი პუნქტი სქოლიოში არ იმალება."
              : "Three documents: the rules for buying, the rules for makers who list and sell here, and what we do with your data. Written to be read — no clause is hidden in a footnote.")}
        </p>

        <p className="policy-hero__meta">
          <span>
            {t("policy.last_updated") || (isGe ? "ბოლო განახლება" : "Last updated")}{" "}
            12 {isGe ? "ივნისი" : "June"} 2026
          </span>
          <span className="policy-hero__meta-dot" aria-hidden="true">
            ·
          </span>
          <span>
            {t("policy.effective") || (isGe ? "ძალაშია" : "Effective")} 1{" "}
            {isGe ? "ივლისი" : "July"} 2026
          </span>
        </p>

        <div className="policy-hero__tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`policy-hero__tab${activeTab === tab.id ? " policy-hero__tab--active" : ""}`}
              onClick={() => onChange(tab.id)}
            >
              {t(tab.labelKey) || (isGe ? tab.ge : tab.en)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
