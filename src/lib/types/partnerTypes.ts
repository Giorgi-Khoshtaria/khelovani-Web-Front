// ─────────────────────────────────────────────────────────────
// Partner domain — all partner-related types live here
// ─────────────────────────────────────────────────────────────

export const PartnerTypeEnum = {
  ORGANIZATION: "organization",
  INDIVIDUAL: "individual",
} as const;

export type PartnerType = (typeof PartnerTypeEnum)[keyof typeof PartnerTypeEnum];

// ── Registration (become-partner form → backend) ─────────────

export interface Partner {
  _id?: string;
  partnerType: PartnerType;
  companyNameGe: string;
  companyNameEn: string;
  identificationCode?: string;
  personalNumber?: string;
  contactPerson?: string;
  phone: string;
  city: string;
  email: string;
  address: string;
  addressEn: string;
  description: string;
  descriptionEn?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  categories?: string[];
  profilePhoto?: string;
  rating?: number;
  reviewCount?: number;
  productCount?: number;
  establishedYear?: number;
  verified?: boolean;
  terms?: boolean;
}

// ── Hero stats (server-derived) ──────────────────────────────

export interface PartnersHeroStats {
  totalMakers: number;
  regionCount: number;
  craftCount: number;
  oldestYear?: number;
  samplePhotos: string[];
}

// ── Paginated API response ────────────────────────────────────

export interface PaginatedPartnerResponse {
  data: Partner[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

// ── Filter state (PartnerListing UI) ─────────────────────────

export interface PartnerFilterState {
  search: string;
  city: string;
  minRating: number;
  partnerType: PartnerType | "";
}

// ── Component prop interfaces ─────────────────────────────────

export interface PartnerListingProps {
  initialPartners?: Partner[];
  initialTotalPages?: number;
  initialTotalCount?: number;
}

export interface PartnersHeroProps {
  stats: PartnersHeroStats;
}

export interface PartnerCardProps {
  partner: Partner;
  index?: number;
}

export interface PartnerPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
}
