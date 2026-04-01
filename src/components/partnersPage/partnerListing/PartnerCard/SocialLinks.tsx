import { Icons } from "../constants";

interface SocialLinkProps {
  url?: string;
  type: keyof typeof Icons;
}

/**
 * Clean sub-component for partner social links with automatic https prefixing.
 */
export const SocialLink = ({ url, type }: SocialLinkProps) => {
  if (!url) return null;

  const href = url.startsWith("http") ? url : `https://${url}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="partner-card__social"
      aria-label={String(type)}
    >
      {Icons[type]}
    </a>
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
