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

/**
 * Throws on error — callers should wrap in try/catch and decide UX
 * (toast, redirect to login, etc.). Matches the contract of
 * `updateProfile`/`changePassword`/etc.
 */
export const getProfile = async (token: string): Promise<ProfileData> => {
  const res = await api.get("/api/user/profile", { headers: authHeader(token) });
  return res.data.data as ProfileData;
};

export const updateProfile = async (
  token: string,
  data: Omit<ProfileData, "_id" | "profileImage">,
): Promise<ProfileData> => {
  const res = await api.patch("/api/user/profile", data, { headers: authHeader(token) });
  return res.data.data as ProfileData;
};

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class InvalidImageError extends Error {
  constructor(public readonly reason: "size" | "type", message: string) {
    super(message);
    this.name = "InvalidImageError";
  }
}

export const uploadProfileImage = async (token: string, file: File): Promise<string> => {
  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    throw new InvalidImageError(
      "size",
      `Image too large. Max ${MAX_PROFILE_IMAGE_BYTES / 1024 / 1024}MB.`,
    );
  }
  if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
    throw new InvalidImageError(
      "type",
      `Unsupported image type. Use ${ALLOWED_PROFILE_IMAGE_TYPES.join(", ")}.`,
    );
  }

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
