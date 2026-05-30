import { OrderStatus } from "./orderStatus.enum";

export interface OrderItem {
  product: string;
  titleGe: string;
  titleEn?: string;
  image: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
}

export interface OrderPartner {
  _id: string;
  companyNameGe: string;
  companyNameEn?: string;
}

export interface OrderContact {
  person: string;
  email: string;
  phone: string;
}

export interface OrderAddress {
  label?: string;
  addressLine: string;
  city: string;
  postalCode?: string;
  additionalComment?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  partner: OrderPartner | string;
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  contact: OrderContact;
  shippingAddress: OrderAddress;
  placedAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusCounts {
  all: number;
  paid: number;
  delivered: number;
  cancelled: number;
}

export interface CheckoutPayload {
  addressId: string;
  contact: OrderContact;
}
