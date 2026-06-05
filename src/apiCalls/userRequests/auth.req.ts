import api from "@/apiCalls/api";
import type { UserTypes, LoginTypes } from "@/lib/types/userTypes";

export const registerUser = async (data: UserTypes, lang: string) => {
  try {
    const response = await api.post(`/api/user/register`, data, {
      params: { lang },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error registering user::", error);
    throw error;
  }
};

export const loginUser = async (data: LoginTypes, lang: string) => {
  try {
    const response = await api.post(`/api/user/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      params: { lang },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Tells the backend to clear the httpOnly auth cookie. The browser sends
    // the cookie automatically via `withCredentials`.
    await api.post(`/api/user/logout`);
  } catch (error) {
    // Logout should never block the UI — clearing client state still happens.
    console.error("Error logging out user:", error);
  }
};

export const forgotPassword = async (email: string, lang: string) => {
  try {
    const response = await api.post(
      `/api/user/forgot-password`,
      { email },
      {
        params: { lang },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error sending forgot-password email:", error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  password: string,
  lang: string,
) => {
  try {
    const response = await api.post(
      `/api/user/reset-password`,
      { token, password },
      {
        params: { lang },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await api.get(`/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data as { nameEn?: string; nameGe?: string };
  } catch {
    return null;
  }
};

export const verifyUser = async (token: string) => {
  try {
    const response = await api.get(`/api/user/verify`, {
      params: { token },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};
