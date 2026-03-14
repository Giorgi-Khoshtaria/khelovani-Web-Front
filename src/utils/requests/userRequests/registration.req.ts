import axios from "axios";
import type { UserTypes } from "../../types/userTypes";

const API_URL = import.meta.env.VITE_API_URL;
export const registerUser = async (data: UserTypes) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/register`, data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
