import api from "@/apiCalls/api";

// Client calls rely on the httpOnly `access-token` cookie (`withCredentials`).
// Server-side callers (SSR) pass the token they read from cookies() and it's
// forwarded as a Bearer header — hence `getProfile`'s optional `token`.
const authHeader = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export interface ProfileData {
  _id: string;
  idNumber: string;
  nameGe?: string;
  nameEn: string;
  email: string;
  phone: string;
  profileImage: string | null;
  isVerified?: boolean;
  createdAt?: string;
}

/**
 * Throws on error — callers should wrap in try/catch and decide UX
 * (toast, redirect to login, etc.). Matches the contract of
 * `updateProfile`/`changePassword`/etc.
 */
export const getProfile = async (token?: string): Promise<ProfileData> => {
  const res = await api.get("/api/user/profile", { headers: authHeader(token) });
  return res.data.data as ProfileData;
};

export const updateProfile = async (
  data: Omit<ProfileData, "_id" | "profileImage">,
): Promise<ProfileData> => {
  const res = await api.patch("/api/user/profile", data);
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

export const uploadProfileImage = async (file: File): Promise<string> => {
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
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data.profileImage as string;
};

export const deleteProfileImage = async (): Promise<void> => {
  await api.delete("/api/user/profile/image");
};

export const changePassword = async (
  data: { oldPassword: string; newPassword: string; confirmPassword: string },
): Promise<void> => {
  await api.patch("/api/user/password", data);
};

export const deleteAccount = async (password: string): Promise<void> => {
  await api.delete("/api/user/account", { data: { password } });
};
