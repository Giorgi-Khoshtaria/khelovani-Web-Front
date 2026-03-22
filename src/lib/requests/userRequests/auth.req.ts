import axios from "axios";
import type { UserTypes, LoginTypes } from "@/lib/types/userTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: UserTypes) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/register`, data);
    return response.data;
  } catch (error) {
    console.error("Error registering user::", error);
    throw error;
  }
};

export const loginUser = async (data: LoginTypes) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending forgot-password email:", error);
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/reset-password`, {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
