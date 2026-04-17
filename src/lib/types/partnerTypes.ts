// ─────────────────────────────────────────────────────────────
// Partner domain — all partner-related types live here
// ─────────────────────────────────────────────────────────────

// ── Registration (become-partner form → backend) ─────────────

export interface PartnerRegisterData {
  companyNameGe: string;
  companyNameEn: string;
  identificationCode: string;
  contactPerson: string;
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
  linkedin?: string;
  youtube?: string;
  terms: boolean;
  category?: string;
}

// ── Public partner (returned by API) ─────────────────────────

export interface Partner {
  _id: string;
  companyNameGe: string;
  companyNameEn: string;
  city: string;
  address: string;
  addressEn: string;
  description?: string;
  descriptionEn?: string;
  profilePhoto?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
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
  category: string; // exact-match → backend query param
  city: string;     // exact-match → backend query param
  minRating: number; // reserved for future backend support
}

// ── Component prop interfaces ─────────────────────────────────

export interface PartnerListingProps {
  initialPartners?: Partner[];
  initialTotalPages?: number;
}

export interface PartnerCardProps {
  partner: Partner;
  lang: string;
  index: number;
}

export interface PartnerSidebarProps {
  filters: PartnerFilterState;
  isOpen: boolean;
  activeCount: number;
  onSearchChange: (v: string) => void;
  onCategoryChange: (cat: string) => void;
  onCityChange: (city: string) => void;
  onRatingChange: (r: number) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export interface PartnerPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
}
