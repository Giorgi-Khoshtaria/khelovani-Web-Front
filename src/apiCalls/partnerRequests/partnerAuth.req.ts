import api from "@/apiCalls/api";
import { PartnerRegisterData } from "../../lib/types/partnerTypes";

export const partnerRegisterRequest = async (
  data: PartnerRegisterData,
  lang: string,
) => {
  try {
    const response = await api.post(`/api/partner/register`, data, {
      params: { lang },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
