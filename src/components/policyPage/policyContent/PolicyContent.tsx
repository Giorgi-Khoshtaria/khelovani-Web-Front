"use client";

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { usePolicyScrollSpy } from "@/lib/hooks/usePolicyScrollSpy";
import {
  POLICY_CONTENT,
  type PolicyCategory,
} from "@/lib/utils/policyContent.data";
import "./policyContent.scss";

interface PolicyContentProps {
  activeCategory: PolicyCategory;
}

export default function PolicyContent({ activeCategory }: PolicyContentProps) {
  const { t } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";

  const activeDoc = POLICY_CONTENT[activeCategory];

  const sectionIds = useMemo(
    () =>
      activeDoc.sections.map((section) => `${activeCategory}-${section.id}`),
    [activeCategory, activeDoc],
  );

  const { activeId, scrollToSection } = usePolicyScrollSpy(sectionIds);

  return (
    <section className="policy-content">
      <div className="policy-content__inner">
        <nav
          className="policy-content__toc"
          aria-label={
            t("policy.toc_label") || (isGe ? "გვერდის სარჩევი" : "On this page")
          }
        >
          <span className="policy-content__toc-label">
            {t("policy.toc_label") ||
              (isGe ? "გვერდის სარჩევი" : "On this page")}
          </span>

          <ol className="policy-content__toc-list">
            {activeDoc.sections.map((section, index) => {
              const id = `${activeCategory}-${section.id}`;
              const isActive = activeId === id;

              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`policy-content__toc-link${isActive ? " policy-content__toc-link--active" : ""}`}
                    onClick={() => scrollToSection(id)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="policy-content__toc-index">
                      {index + 1}
                    </span>
                    <span>{isGe ? section.title.ge : section.title.en}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="policy-content__panel">
          <div className="policy-content__summary">
            <span className="policy-content__summary-label">
              {t("policy.short_version") ||
                (isGe ? "მოკლედ" : "The short version")}
            </span>
            <p>{isGe ? activeDoc.shortVersion.ge : activeDoc.shortVersion.en}</p>
          </div>

          {activeDoc.sections.map((section, index) => {
            const id = `${activeCategory}-${section.id}`;
            const paragraphs = isGe ? section.body.ge : section.body.en;

            return (
              <article key={id} id={id} className="policy-content__section">
                <span className="policy-content__section-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{isGe ? section.title.ge : section.title.en}</h3>
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
