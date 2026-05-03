import api from "@/apiCalls/api";

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export interface ProfileData {
  _id: string;
  idNumber: string;
  nameGe?: string;
  nameEn: string;
  dateOfBirth: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  profileImage: string | null;
}

export const getProfile = async (token: string): Promise<ProfileData | null> => {
  try {
    const res = await api.get("/api/user/profile", { headers: authHeader(token) });
    return res.data.data as ProfileData;
  } catch {
    return null;
  }
};

export const updateProfile = async (
  token: string,
  data: Omit<ProfileData, "_id" | "profileImage">,
): Promise<ProfileData> => {
  const res = await api.patch("/api/user/profile", data, { headers: authHeader(token) });
  return res.data.data as ProfileData;
};

export const uploadProfileImage = async (token: string, file: File): Promise<string> => {
  const form = new FormData();
  form.append("profileImage", file);
  const res = await api.post("/api/user/profile/image", form, {
    headers: { ...authHeader(token), "Content-Type": "multipart/form-data" },
  });
  return res.data.data.profileImage as string;
};

export const deleteProfileImage = async (token: string): Promise<void> => {
  await api.delete("/api/user/profile/image", { headers: authHeader(token) });
};

export const changePassword = async (
  token: string,
  data: { oldPassword: string; newPassword: string; confirmPassword: string },
): Promise<void> => {
  await api.patch("/api/user/password", data, { headers: authHeader(token) });
};

export const deleteAccount = async (token: string, password: string): Promise<void> => {
  await api.delete("/api/user/account", {
    headers: authHeader(token),
    data: { password },
  });
};
