import axios from "axios";
import { PartnerRegisterData } from "../../lib/types/partnerTypes";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const partnerRegisterRequest = async (
  data: PartnerRegisterData,
  lang: string,
) => {
  try {
    const response = await axios.post(`${API_URL}/api/partner/register`, data, {
      params: { lang },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
