import api from "@/apiCalls/api";
import type { Address, AddressPayload } from "@/lib/types/addressTypes";

// Auth is carried by the httpOnly `access-token` cookie (sent automatically
// via `withCredentials`). These are all client-side calls — no token param.

export const getAddresses = async (): Promise<Address[]> => {
  const res = await api.get("/api/user/addresses");
  return res.data.data as Address[];
};

export const addAddress = async (data: AddressPayload): Promise<Address> => {
  const res = await api.post("/api/user/addresses", data);
  return res.data.data as Address;
};

export const updateAddress = async (
  id: string,
  data: AddressPayload,
): Promise<Address> => {
  const res = await api.patch(`/api/user/addresses/${id}`, data);
  return res.data.data as Address;
};

export const setDefaultAddress = async (id: string): Promise<Address[]> => {
  const res = await api.patch(`/api/user/addresses/${id}/default`, {});
  return res.data.data as Address[];
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`/api/user/addresses/${id}`);
};
