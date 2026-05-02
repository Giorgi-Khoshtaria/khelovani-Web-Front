import api from "@/apiCalls/api";
import { Partner } from "../../lib/types/partnerTypes";

export const partnerRegisterRequest = async (
  data: Partner,
  lang: string,
) => {
  try {
    const response = await api.post(`/api/partner/register`, data, {
      params: { lang },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
