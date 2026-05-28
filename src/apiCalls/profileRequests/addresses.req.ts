import api from "@/apiCalls/api";
import type { Address, AddressPayload } from "@/lib/types/addressTypes";

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getAddresses = async (token: string): Promise<Address[]> => {
  const res = await api.get("/api/user/addresses", {
    headers: authHeader(token),
  });
  return res.data.data as Address[];
};

export const addAddress = async (
  token: string,
  data: AddressPayload,
): Promise<Address> => {
  const res = await api.post("/api/user/addresses", data, {
    headers: authHeader(token),
  });
  return res.data.data as Address;
};

export const updateAddress = async (
  token: string,
  id: string,
  data: AddressPayload,
): Promise<Address> => {
  const res = await api.patch(`/api/user/addresses/${id}`, data, {
    headers: authHeader(token),
  });
  return res.data.data as Address;
};

export const setDefaultAddress = async (
  token: string,
  id: string,
): Promise<Address[]> => {
  const res = await api.patch(
    `/api/user/addresses/${id}/default`,
    {},
    { headers: authHeader(token) },
  );
  return res.data.data as Address[];
};

export const deleteAddress = async (
  token: string,
  id: string,
): Promise<void> => {
  await api.delete(`/api/user/addresses/${id}`, { headers: authHeader(token) });
};
