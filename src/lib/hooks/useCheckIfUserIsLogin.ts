import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const useCheckIfUserIsLogin = () => {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const token = localStorage.getItem("access-token");
    if (token) {
      hasRun.current = true;
      toast.error("თქვენ უკვე შესული ხართ სისტემაში");
      setTimeout(() => router.push("/"), 1500);
    }
  }, [router]);
};
