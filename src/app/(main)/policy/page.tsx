"use client";

import PolicyHero from "@/components/policyPage/policyHero/PolicyHero";
import PolicyContent from "@/components/policyPage/policyContent/PolicyContent";
import PolicyCta from "@/components/policyPage/policyCta/PolicyCta";
import { usePolicyTabs } from "@/lib/hooks/usePolicyTabs";

export default function PolicyPage() {
  const { tabs, activeTab, setActiveTab } = usePolicyTabs();

  return (
    <>
      <PolicyHero tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <PolicyContent activeCategory={activeTab} />
      <PolicyCta />
    </>
  );
}
