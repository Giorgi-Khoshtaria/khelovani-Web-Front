import axios from "axios";
import { PartnerRegisterData } from "../../types/partnerTypes";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const partnerRegisterRequest = async (data: PartnerRegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/api/partner/register`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
