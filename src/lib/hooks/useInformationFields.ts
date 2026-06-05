"use client";

import { useEffect, useState } from "react";
import {
  getInformationFields,
  type InformationFields,
} from "@/apiCalls/informationRequests/information.req";

// Module-level cache so the fields are fetched once and shared by every
// component that uses the hook (e.g. contact page + footer).
let cache: InformationFields | null = null;
let inflight: Promise<InformationFields> | null = null;

const load = (): Promise<InformationFields> => {
  if (cache) return Promise.resolve(cache);
  inflight ??= getInformationFields()
    .then((data) => {
      cache = data;
      inflight = null;
      return data;
    })
    .catch(() => {
      inflight = null;
      return {};
    });
  return inflight;
};

export interface UseInformationFields {
  info: InformationFields;
  loading: boolean;
  /** Value for `key`, or `fallback` when it's missing/empty. */
  get: (key: string, fallback?: string) => string;
}

/** Loads the site information fields (email, phone, address, …). */
export const useInformationFields = (): UseInformationFields => {
  const [info, setInfo] = useState<InformationFields>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    let active = true;
    load().then((data) => {
      if (!active) return;
      setInfo(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const get = (key: string, fallback = "") => info[key] || fallback;

  return { info, loading, get };
};
