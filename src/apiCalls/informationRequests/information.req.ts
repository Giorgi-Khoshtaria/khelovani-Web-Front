import api from "@/apiCalls/api";

/** Site information fields keyed by their admin-defined key (email, phone, …). */
export type InformationFields = Record<string, string>;

export const getInformationFields = async (
  signal?: AbortSignal,
): Promise<InformationFields> => {
  const res = await api.get("/api/information-fields", { signal });
  return (res.data?.data ?? {}) as InformationFields;
};
