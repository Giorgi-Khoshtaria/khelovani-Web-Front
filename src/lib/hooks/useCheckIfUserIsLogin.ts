import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

export const useCheckIfUserIsLogin = () => {
  const router = useRouter();
  const hasRun = useRef(false);
  const { t: tPages } = useClientTranslation("pages");

  useEffect(() => {
    if (hasRun.current) return;

    const token = localStorage.getItem("access-token");
    if (token) {
      hasRun.current = true;
      toast.error(tPages("login.already_logged_in") || "თქვენ უკვე შესული ხართ სისტემაში");
      setTimeout(() => router.push("/"), 1500);
    }
  }, [router]);
};
