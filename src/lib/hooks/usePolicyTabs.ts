"use client";

import { useState } from "react";
import type { PolicyCategory } from "@/lib/utils/policyContent.data";

export interface PolicyTabConfig {
  id: PolicyCategory;
  labelKey: string;
  ge: string;
  en: string;
}

export const POLICY_TABS: PolicyTabConfig[] = [
  { id: "buyer", labelKey: "policy.tab_buyer", ge: "მყიდველის პირობები", en: "Buyer Terms" },
  { id: "partner", labelKey: "policy.tab_partner", ge: "პარტნიორის პირობები", en: "Partner Terms" },
  { id: "privacy", labelKey: "policy.tab_privacy", ge: "კონფიდენციალურობის პოლიტიკა", en: "Privacy Policy" },
];

/** Owns the active Buyer/Partner/Privacy tab shared by PolicyHero and PolicyContent. */
export const usePolicyTabs = (initial: PolicyCategory = "buyer") => {
  const [activeTab, setActiveTab] = useState<PolicyCategory>(initial);

  return { tabs: POLICY_TABS, activeTab, setActiveTab };
};
