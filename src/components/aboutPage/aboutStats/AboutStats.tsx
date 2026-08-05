"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { formatCompact } from "@/lib/utils/formatNumber";
import type { PublicStats } from "@/apiCalls/common.req";
import "./aboutStats.scss";

interface AboutStatsProps {
  stats: PublicStats;
}

export default function AboutStats({ stats }: AboutStatsProps) {
  const { t } = useClientTranslation("pages");

  return (
    <section className="about-stats">
      <div className="about-stats__row">
        <div className="about-stats__item">
          <span className="about-stats__value">
            {stats.makers > 0 ? formatCompact(stats.makers) : "—"}
          </span>
          <span className="about-stats__label">{t("home.stats.makers")}</span>
        </div>

        <div className="about-stats__item">
          <span className="about-stats__value">
            {stats.pieces > 0 ? formatCompact(stats.pieces) : "—"}
          </span>
          <span className="about-stats__label">{t("home.stats.pieces")}</span>
        </div>

        <div className="about-stats__item">
          <span className="about-stats__value">{formatCompact(stats.regions)}</span>
          <span className="about-stats__label">{t("home.stats.regions")}</span>
        </div>

        <div className="about-stats__item">
          <span className="about-stats__value">{t("about.stat_kept_value")}</span>
          <span className="about-stats__label">{t("about.stat_kept_label")}</span>
        </div>
      </div>
    </section>
  );
}
