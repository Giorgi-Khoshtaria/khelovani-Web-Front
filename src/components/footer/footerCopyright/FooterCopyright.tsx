"use client";

import React from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./FooterCopyright.scss";

export default function FooterCopyright() {
  const { t } = useClientTranslation("pages");

  const copyrightText = t("footer.copyright");
  const finalCopyright =
    copyrightText === "footer.copyright"
      ? "© 2024 Khelovani. All rights reserved. Preserving Georgian heritage through art."
      : copyrightText;

  return (
    <div className="khelovani-footer__bottom">
      <p>{finalCopyright}</p>
    </div>
  );
}
