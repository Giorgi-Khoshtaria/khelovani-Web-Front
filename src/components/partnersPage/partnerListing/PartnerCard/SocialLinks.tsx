import { Icons } from "../constants";

interface SocialLinkProps {
  url?: string;
  type: keyof typeof Icons;
}

/**
 * Clean sub-component for partner social links with automatic https prefixing.
 * Renders as a button, not an anchor — the whole PartnerCard is itself a
 * Link, and nested <a> tags are invalid HTML (the browser would silently
 * break the surrounding link).
 */
export const SocialLink = ({ url, type }: SocialLinkProps) => {
  if (!url) return null;

  const href = url.startsWith("http") ? url : `https://${url}`;

  return (
    <button
      type="button"
      className="partner-card__social"
      aria-label={String(type)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      {Icons[type]}
    </button>
  );
};

interface SocialLinksProps {
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export const SocialLinks = ({
  website,
  facebook,
  instagram,
  tiktok,
}: SocialLinksProps) => {
  const hasAnySocial = website || facebook || instagram || tiktok;
  if (!hasAnySocial) return null;

  return (
    <div className="partner-card__socials">
      <SocialLink url={website} type="website" />
      <SocialLink url={facebook} type="facebook" />
      <SocialLink url={instagram} type="instagram" />
      <SocialLink url={tiktok} type="tiktok" />
    </div>
  );
};
