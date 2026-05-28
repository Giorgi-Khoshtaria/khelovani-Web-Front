export enum AddressType {
  Home = "home",
  Work = "work",
  Family = "family",
  Other = "other",
}

export interface Address {
  _id: string;
  type: AddressType;
  label: string;
  addressLine: string;
  city: string;
  postalCode?: string;
  additionalComment?: string;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface AddressPayload {
  type: AddressType;
  label: string;
  addressLine: string;
  city: string;
  postalCode?: string;
  additionalComment?: string;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
  isDefault?: boolean;
}
